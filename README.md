# model-router

**Send each piece of a task to the cheapest Claude model that can do it well, and check the result.**

A Claude Code plugin with three skills. The main one turns an Opus 5.5 session into a coordinator: it plans the task, hands each piece to a Haiku 5.5, Sonnet 5.5 or Opus 5.5 subagent at the right effort level, and verifies every result before accepting it. The other two help you write your own skills and subagents with the same lessons built in.

## The skills

| Skill | What it does |
| --- | --- |
| `coordinating-subagents` | Plans a coding or design task, routes each piece to a model and effort level, briefs workers so they can start cold, and checks their work by reading diffs and rerunning tests itself. |
| `creating-skills` | Writes or revises a `SKILL.md`: when a skill is the right tool, frontmatter, trigger descriptions, a concise body, supporting files and testing. |
| `creating-subagents` | Writes or revises a subagent definition in `.claude/agents/`: model and effort for the role, the fewest tools needed, a system prompt with a report the parent can verify, and testing. |

Claude loads a skill on its own when your request matches it, or you can call it directly, for example `/model-router:coordinating-subagents`.

## How the coordinator routes work

The deciding question is whether the solution is already known. If it is, a smaller model can carry it out. If the model first has to find out what is wrong, or choose between designs, a larger one is worth it. File count matters less than that.

| Model, effort | Typical work |
| --- | --- |
| Haiku `low` | Finding files or symbols, summarizing logs, extracting lists |
| Haiku `medium` | Mechanical edits from an example: renames, boilerplate, repetitive tests |
| Sonnet `medium` | Well-specified features, endpoints, components, tests, clear refactors |
| Sonnet `high` | Reproducible bugs, multi-module changes, unfamiliar code, routine review |
| Opus `medium` | Open-ended work, unknown root causes, design critique |
| Opus `high` | Decisions that are hard to undo, such as auth, payments, concurrency or data integrity, and final review |

It runs at most one Opus or Sonnet worker at a time, and at most two Haiku workers, or one of each kind. It delegates only when there is bulk to hand off, because for a single chain of dependent steps, delegation costs more than doing the work.

It treats a worker's report as a claim to check. Before accepting code, it reads the diff, reruns the check itself and confirms the change stayed in scope. If a worker fails, it first asks whether the worker lacked effort or lacked knowledge. It re-briefs or raises effort for missing effort, moves one model up for missing knowledge, and takes the piece over itself after two failed attempts.

The guidance comes from Anthropic's documentation on [choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model), [effort](https://platform.claude.com/docs/en/build-with-claude/effort), [prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), [cost and intelligence](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence), and [skill authoring](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

## Install

In a Claude Code terminal session:

```
/plugin install model-router --marketplace joaofatoretto/model_router
```

Answer `y` to add the marketplace, then choose the **user** scope so the skills are available in every session.

Or from the command line:

```bash
claude plugin marketplace add joaofatoretto/model_router
claude plugin install model-router@model-router --scope user
```

To try it for a single session without installing it:

```bash
git clone https://github.com/joaofatoretto/model_router.git
claude --plugin-dir ./model_router
```

For the best results, run the coordinator in an Opus 5.5 session at `high` effort (`/model opus`, then `/effort high`).

## Limitations

- The concurrency limits, model choices and verification steps are instructions, not enforcement. The coordinator follows them, but nothing blocks a call that breaks them.
- The routing table reflects the Claude 5.5 models. When new models arrive, revisit it.
- The skills haven't been measured against formal evals yet. They're built from Anthropic's published guidance and real use.

## Development

```
model_router/
├── .claude-plugin/
│   ├── plugin.json         the manifest
│   └── marketplace.json    makes this repository installable as a marketplace
└── skills/
    ├── coordinating-subagents/SKILL.md
    ├── creating-skills/SKILL.md
    └── creating-subagents/SKILL.md
```

```bash
claude plugin validate .   # checks the manifest and skills as Claude Code reads them
```

To work on it live, install it from a local folder (`claude plugin marketplace add <folder>`). Claude Code then reads the skills straight from that folder, and `/reload-plugins` picks up each edit.

## License

[MIT](LICENSE)
