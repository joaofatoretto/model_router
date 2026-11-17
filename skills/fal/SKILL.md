---
name: fal
description: Runs any fal.ai model from any repo (images, image edits, upscales, background removal, video, audio, speech, 3D) through a small script that finds models, reads their inputs, checks the price, runs them and downloads the results. Use when the user mentions fal or fal.ai, names a fal model (FLUX, Nano Banana, Veo, Kling, Seedance and others), or asks to generate, edit or animate media with fal.
---

# fal.ai

One script does everything: `node ${CLAUDE_PLUGIN_ROOT}/scripts/fal.mjs`. It reads `FAL_KEY` from the environment or from `~/.config/fal/.env`, and has no dependencies.

For a planned image or video job (a brief, a set of assets, several shots), the generating-images and generating-videos skills cover prompting and review. This skill is the direct route: run what the user asked for.

## Steps

1. **Find the model.** Use `search "<words>" [--category <category>]` when the user hasn't named an exact endpoint. It lists live endpoint ids with their list price. Never guess an id. Categories include `text-to-image`, `image-to-image`, `text-to-video`, `image-to-video`, `video-to-video`, `text-to-speech`, `speech-to-text`, `text-to-audio` and `image-to-3d`.
2. **Read its inputs.** Run `schema <endpoint>` before the first run of a model. Required fields are starred, and enums show the allowed values (sizes, aspect ratios, durations).
3. **Check the cost.** Run with `--dry-run` first. It prints the input and an estimate from fal's list price (per image, megapixel, second or video).
4. **Run it.** Run the same command without `--dry-run`. Save into the current project, for example `--out assets/generated --name hero-v1`, unless the user names a folder.
5. **Look at the result** (Read the image, or check a video's duration and size) before calling it done, and say what came back.

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/fal.mjs search "nano banana" --category image-to-image
node ${CLAUDE_PLUGIN_ROOT}/scripts/fal.mjs schema fal-ai/flux/schnell
node ${CLAUDE_PLUGIN_ROOT}/scripts/fal.mjs price fal-ai/flux/schnell fal-ai/veo3
node ${CLAUDE_PLUGIN_ROOT}/scripts/fal.mjs run fal-ai/flux/schnell --prompt "..." --input '{"image_size":"portrait_16_9","num_images":2}' --out assets/generated --name poster --dry-run
node ${CLAUDE_PLUGIN_ROOT}/scripts/fal.mjs run <image-edit endpoint> --prompt "..." --file image_urls[]=ref1.png --file image_urls[]=ref2.png --out assets/generated
node ${CLAUDE_PLUGIN_ROOT}/scripts/fal.mjs run <image-to-video endpoint> --prompt "..." --input '{"duration":"5"}' --file image_url=start.png --out assets/video --name shot-1
node ${CLAUDE_PLUGIN_ROOT}/scripts/fal.mjs spend --since 30d
```

## Inputs

- `--prompt` sets `prompt`. `--input '<json>'` and `--input-file f.json` set any other field, and `--input` wins over the file.
- `--file field=path` sends a local file as a data URI. Use `field[]=path` for list fields such as `image_urls`, repeated once per file. Public URLs go straight into `--input`.
- Video is priced per second, so always pass `duration` (as the schema types it, often a string such as `"5"`). Without it the estimate assumes 10 s.

## Outputs

- Every URL in the result is downloaded to `--out` (default `./fal-output`) as `<name>[-N].<ext>`. A `<name>.json` file next to it holds the endpoint, input, request id and raw result, including seeds, which are useful for re-running.
- Long jobs are polled through fal's queue for up to 15 minutes (`--timeout-s`). If one times out, the error prints the request id and the URL to fetch the result later.

## Spend

- A run whose estimate is above **$1** is refused. Pass `--max-usd <n>` only when the user has agreed to that spend for this request. Say the estimate and ask before going above the cap.
- A run whose cost can't be estimated (an unusual unit) is refused until you pass `--max-usd`. Check `price <endpoint>` first and tell the user the unit price.
- Each run's estimate is logged to `~/.config/fal/usage.jsonl`, and `spend` totals it. These are list-price estimates; the real bill is at fal.ai/dashboard/usage-billing.
- Explore on a cheap model or at low resolution and short duration. Move to the expensive model for the final once the direction is right.

## When it fails

- `FAL_KEY is not set`: ask the user to put `FAL_KEY=...` in `~/.config/fal/.env` (chmod 600). Never print the key.
- `422` with a validation message: an input doesn't match the schema. Re-read `schema` and fix the field.
- `403` or a balance or credit message: the account is out of credit. Stop and tell the user.
- The result has no URLs (for example, a text or JSON output): read `<name>.json`.
