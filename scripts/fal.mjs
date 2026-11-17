#!/usr/bin/env node
// fal.ai from any repo: find models, read a model's inputs, check its price, run it through the
// queue and download what it returns. No dependencies (Node 18+).
//
// Key: FAL_KEY from the environment, else from FAL_ENV_FILE (default ~/.config/fal/.env).
// Every paid run is appended to ~/.config/fal/usage.jsonl with its estimated cost.
//
//   node fal.mjs search "kling image to video" [--category text-to-video] [--limit 10]
//   node fal.mjs schema fal-ai/flux/schnell            # input fields, types, defaults, enums
//   node fal.mjs price fal-ai/flux/schnell [more ids]   # list price per unit
//   node fal.mjs run fal-ai/flux/schnell --prompt "..." [--input '{"num_images":2}'] \
//       [--file image_url=ref.png] [--out assets/gen] [--name hero] [--max-usd 2] [--dry-run]
//   node fal.mjs spend [--since 30d]                    # estimated spend from the usage log

import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve, extname, basename } from 'node:path';
import { setDefaultAutoSelectFamilyAttemptTimeout } from 'node:net';

// Node gives each address 250 ms before trying the next; slow CDN hosts need longer.
setDefaultAutoSelectFamilyAttemptTimeout(1000);

const CONFIG_DIR = join(homedir(), '.config', 'fal');
const USAGE_LOG = join(CONFIG_DIR, 'usage.jsonl');
const DEFAULT_MAX_USD = 1; // per run; raise with --max-usd when the brief allows it
const API = 'https://api.fal.ai/v1';
const QUEUE = 'https://queue.fal.run';

const die = (msg) => { process.stderr.write(`fal: ${msg}\n`); process.exit(1); };

function parseArgs(argv) {
  const pos = [], opt = {}, files = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const k = a.slice(2);
    if (k === 'dry-run' || k === 'help' || k === 'no-download') { opt[k] = true; continue; }
    const v = argv[++i];
    if (v === undefined) die(`--${k} needs a value`);
    if (k === 'file') files.push(v); else opt[k] = v;
  }
  return { pos, opt, files };
}

function loadKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const file = process.env.FAL_ENV_FILE ?? join(CONFIG_DIR, '.env');
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*FAL_KEY\s*=\s*(.*)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  die(`FAL_KEY is not set. Put FAL_KEY=... in ${file} (chmod 600) or export it.`);
}

async function http(url, { key, method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  if (key) headers.Authorization = `Key ${key}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = undefined; }
  if (!res.ok) die(`${method} ${url.replace(/\?.*/, '')} -> ${res.status}: ${text.slice(0, 500)}`);
  return json ?? text;
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };

function dataUri(path) {
  const mime = MIME[extname(path).toLowerCase()] ?? 'application/octet-stream';
  return `data:${mime};base64,${readFileSync(path).toString('base64')}`;
}

// --- price estimate ------------------------------------------------------------------------

const SIZE_PRESETS = { square_hd: [1024, 1024], square: [512, 512], portrait_4_3: [768, 1024], portrait_16_9: [576, 1024],
  landscape_4_3: [1024, 768], landscape_16_9: [1024, 576] };

function estimate(price, input) {
  if (!price) return { usd: null, why: 'no list price found' };
  const n = Number(input.num_images ?? input.num_outputs ?? 1) || 1;
  const unit = String(price.unit).toLowerCase().replace(/s$/, '');
  if (unit === 'image') return { usd: price.unit_price * n, why: `${n} image(s) x $${price.unit_price}` };
  if (unit === 'second') {
    const d = parseFloat(String(input.duration ?? input.num_seconds ?? '')) || 10;
    const why = input.duration ? `${d}s` : `${d}s assumed (no duration given)`;
    return { usd: price.unit_price * d, why: `${why} x $${price.unit_price}/s` };
  }
  if (unit === 'megapixel') {
    const s = input.image_size;
    const [w, h] = typeof s === 'object' && s ? [s.width, s.height] : SIZE_PRESETS[s] ?? [1024, 1024];
    const mp = Math.max(1, Math.ceil((w * h) / 1e6));
    return { usd: price.unit_price * mp * n, why: `${n} x ${mp} MP x $${price.unit_price}/MP` };
  }
  if (unit === 'video' || unit === 'request' || unit === 'call' || unit === 'generation')
    return { usd: price.unit_price * n, why: `${n} ${unit}(s) x $${price.unit_price}` };
  return { usd: null, why: `unit "${price.unit}" can't be estimated` };
}

async function getPrices(key, ids) {
  const r = await http(`${API}/models/pricing?endpoint_id=${ids.map(encodeURIComponent).join(',')}`, { key });
  return Object.fromEntries((r.prices ?? []).map((p) => [p.endpoint_id, p]));
}

// --- commands ------------------------------------------------------------------------------

async function search(key, { pos, opt }) {
  const q = pos.join(' ');
  const params = new URLSearchParams({ limit: opt.limit ?? '10' });
  if (q) params.set('q', q);
  if (opt.category) params.set('category', opt.category);
  const r = await http(`${API}/models?${params}`, { key });
  const rows = (r.models ?? []).filter((m) => m.metadata?.status !== 'deprecated' || opt.all);
  const prices = rows.length ? await getPrices(key, rows.map((m) => m.endpoint_id)) : {};
  for (const m of rows) {
    const p = prices[m.endpoint_id];
    const cost = p ? `$${p.unit_price}/${p.unit}` : 'price n/a';
    console.log(`${m.endpoint_id}  [${m.metadata?.category}]  ${cost}  ${m.metadata?.display_name ?? ''}`);
  }
  if (!rows.length) console.log('no models found (deprecated ones are hidden; pass --all to show them)');
}

async function schema(_key, { pos }) {
  const id = pos[0] ?? die('schema needs an endpoint id');
  const doc = await http(`https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=${encodeURIComponent(id)}`);
  const schemas = doc.components?.schemas ?? {};
  const post = Object.values(doc.paths ?? {}).map((p) => p.post).find(Boolean);
  const ref = post?.requestBody?.content?.['application/json']?.schema?.$ref;
  const input = ref ? schemas[ref.split('/').pop()] : undefined;
  if (!input) die(`no input schema for ${id}`);
  const meta = doc.info?.['x-fal-metadata'] ?? {};
  console.log(`${id}  [${meta.category ?? '?'}]`);
  const req = new Set(input.required ?? []);
  const typeOf = (s) => {
    if (!s) return '?';
    if (s.$ref) { const t = schemas[s.$ref.split('/').pop()]; return t?.enum ? `enum(${t.enum.join('|')})` : s.$ref.split('/').pop(); }
    if (s.enum) return `enum(${s.enum.join('|')})`;
    if (s.anyOf) return s.anyOf.map(typeOf).join(' | ');
    if (s.type === 'array') return `${typeOf(s.items)}[]`;
    return s.type ?? '?';
  };
  for (const [name, s] of Object.entries(input.properties ?? {})) {
    const def = s.default !== undefined ? ` = ${JSON.stringify(s.default)}` : '';
    const desc = (s.description ?? '').replace(/\s+/g, ' ').slice(0, 140);
    console.log(`  ${req.has(name) ? '*' : ' '} ${name}: ${typeOf(s)}${def}${desc ? `  — ${desc}` : ''}`);
  }
  console.log('(* = required)');
}

async function price(key, { pos }) {
  if (!pos.length) die('price needs one or more endpoint ids');
  const prices = await getPrices(key, pos);
  for (const id of pos) {
    const p = prices[id];
    console.log(p ? `${id}  $${p.unit_price} per ${p.unit}` : `${id}  no list price`);
  }
}

function collectUrls(value, out = []) {
  if (!value || typeof value !== 'object') return out;
  if (typeof value.url === 'string' && /^https?:/.test(value.url)) out.push({ url: value.url, name: value.file_name, type: value.content_type });
  for (const v of Object.values(value)) if (v && typeof v === 'object' && v !== value) collectUrls(v, out);
  return out;
}

async function run(key, { pos, opt, files }) {
  const id = pos[0] ?? die('run needs an endpoint id');
  let input = {};
  if (opt['input-file']) input = JSON.parse(readFileSync(opt['input-file'], 'utf8'));
  if (opt.input) input = { ...input, ...JSON.parse(opt.input) };
  if (opt.prompt) input.prompt = opt.prompt;
  for (const f of files) {
    const [field, path] = f.split(/=(.*)/s);
    if (!path) die(`--file takes field=path, got "${f}"`);
    const uri = dataUri(resolve(path));
    if (field.endsWith('[]')) (input[field.slice(0, -2)] ??= []).push(uri); else input[field] = uri;
  }

  const prices = await getPrices(key, [id]);
  const est = estimate(prices[id], input);
  const maxUsd = Number(opt['max-usd'] ?? DEFAULT_MAX_USD);
  const shown = Object.fromEntries(Object.entries(input).map(([k, v]) =>
    [k, typeof v === 'string' && v.startsWith('data:') ? `<${v.length} chars data uri>` : Array.isArray(v) ? v.map((x) => typeof x === 'string' && x.startsWith('data:') ? '<data uri>' : x) : v]));
  process.stderr.write(`fal: ${id}  estimate ${est.usd == null ? 'unknown' : `$${est.usd.toFixed(4)}`} (${est.why}); cap $${maxUsd}\n`);
  if (opt['dry-run']) { console.log(JSON.stringify({ endpoint: id, input: shown, estimate_usd: est.usd, why: est.why, max_usd: maxUsd }, null, 1)); return; }
  if (est.usd == null && opt['max-usd'] === undefined) die(`cost can't be estimated (${est.why}); check "price ${id}" and pass --max-usd to confirm`);
  if (est.usd != null && est.usd > maxUsd) die(`estimate $${est.usd.toFixed(4)} is above the $${maxUsd} cap; lower the request or pass --max-usd`);

  const started = Date.now();
  const sub = await http(`${QUEUE}/${id}`, { key, method: 'POST', body: input });
  process.stderr.write(`fal: queued ${sub.request_id}\n`);
  const timeoutMs = Number(opt['timeout-s'] ?? 900) * 1000;
  let last = '';
  for (;;) {
    const st = await http(`${sub.status_url}?logs=0`, { key });
    if (st.status !== last) { process.stderr.write(`fal: ${st.status}${st.queue_position != null ? ` (position ${st.queue_position})` : ''}\n`); last = st.status; }
    if (st.status === 'COMPLETED') break;
    if (Date.now() - started > timeoutMs) die(`still ${st.status} after ${timeoutMs / 1000}s; request ${sub.request_id} (result later: GET ${sub.response_url})`);
    await new Promise((r) => setTimeout(r, st.status === 'IN_QUEUE' ? 3000 : 2000));
  }
  const result = await http(sub.response_url, { key });

  const outDir = resolve(opt.out ?? 'fal-output');
  mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const stem = opt.name ?? `${id.replace(/[^\w]+/g, '-')}-${stamp}`;
  const saved = [];
  if (!opt['no-download']) {
    const urls = collectUrls(result);
    for (let i = 0; i < urls.length; i++) {
      const { url, name, type } = urls[i];
      const ext = extname(name ?? new URL(url).pathname) || (type ? `.${type.split('/')[1]}` : '');
      const file = join(outDir, `${stem}${urls.length > 1 ? `-${i + 1}` : ''}${ext}`);
      const res = await fetch(url);
      if (!res.ok) { process.stderr.write(`fal: download failed ${res.status} ${url}\n`); continue; }
      writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      saved.push(file);
    }
  }
  const meta = join(outDir, `${stem}.json`);
  writeFileSync(meta, JSON.stringify({ endpoint: id, request_id: sub.request_id, input: shown, estimate_usd: est.usd, result, files: saved.map((f) => basename(f)) }, null, 1));

  mkdirSync(CONFIG_DIR, { recursive: true });
  appendFileSync(USAGE_LOG, JSON.stringify({ at: new Date().toISOString(), endpoint: id, request_id: sub.request_id, usd: est.usd, why: est.why, cwd: process.cwd(), files: saved }) + '\n');
  process.stderr.write(`fal: done in ${((Date.now() - started) / 1000).toFixed(1)}s, ~$${est.usd?.toFixed(4) ?? '?'}\n`);
  for (const f of saved) console.log(f);
  console.log(meta);
}

function spend(_key, { opt }) {
  if (!existsSync(USAGE_LOG)) { console.log('no runs logged yet'); return; }
  const m = String(opt.since ?? '30d').match(/^(\d+)d$/) ?? die('--since takes Nd, e.g. 30d');
  const from = Date.now() - Number(m[1]) * 864e5;
  const rows = readFileSync(USAGE_LOG, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => Date.parse(r.at) >= from);
  const total = rows.reduce((s, r) => s + (r.usd ?? 0), 0);
  const unknown = rows.filter((r) => r.usd == null).length;
  console.log(`${rows.length} runs in the last ${m[1]} days, ~$${total.toFixed(3)} estimated${unknown ? ` (+${unknown} with unknown cost)` : ''}`);
  console.log('Estimates only: the real bill is at fal.ai/dashboard/usage-billing.');
}

const HELP = `node fal.mjs <command>
  search [words] [--category text-to-image|image-to-image|text-to-video|image-to-video|...] [--limit 10] [--all]
  schema <endpoint>                 input fields (* = required)
  price <endpoint...>               list price per unit
  run <endpoint> [--prompt "..."] [--input '{json}'] [--input-file f.json] [--file field=path | --file field[]=path]
      [--out dir (default ./fal-output)] [--name stem] [--max-usd 1] [--timeout-s 900] [--dry-run] [--no-download]
  spend [--since 30d]               estimated spend from ~/.config/fal/usage.jsonl`;

const { pos, opt, files } = parseArgs(process.argv.slice(2));
const cmd = pos.shift();
if (!cmd || opt.help) { console.log(HELP); process.exit(cmd ? 0 : 1); }
const commands = { search, schema, price, run, spend };
if (!commands[cmd]) die(`unknown command "${cmd}"\n${HELP}`);
await commands[cmd](cmd === 'schema' || cmd === 'spend' ? null : loadKey(), { pos, opt, files });
