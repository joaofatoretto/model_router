# model-router

**Send each piece of a task to the cheapest Claude model that can do it well, and check the result.**

A Claude Code plugin with coordinator skills and a roster of 18 subagents for code, design and video work. The coordinators turn an Opus 5.5 session into a lead: it plans the task, hands each piece to a Haiku 5.5, Sonnet 5.5 or Opus 5.5 subagent at the right effort level, and verifies every result before accepting it. Two more skills help you write your own skills and subagents with the same lessons built in.

## The skills

| Skill | What it does |
| --- | --- |
| `coordinating-subagents` | The default coordinator. Plans a task, routes each piece to a model and effort level, briefs workers so they can start cold, and checks their work by reading diffs and rerunning tests itself. It asks you about anything still open before it starts, because workers can't ask. |
| `coordinating-code` | Adds the code agents and a build, test and review flow to the default coordinator. |
| `coordinating-design` | Adds the design agents and a research, flow, direction, build and review flow, with checkpoints where you choose the direction. |
| `coordinating-video` | Adds the video agents and a script-to-render flow in Remotion, with a budget for image and video generation. |
| `coordinating-images` | Adds the image agents and a flow for raster image generation and editing: intake questions, an agreed budget, candidates to choose from, then finals. |
| `coordinating-illustration` | Adds the illustration agents and a flow for vector work: style exploration, an approved hero piece, the rest of the set, a technical pass and review. The output is always SVG or Figma vectors, even when a generated concept is used along the way. |
| `coordinating-motion` | Adds the motion agents and a flow that writes a spec, has you try a prototype, then builds out and verifies, including reduced motion. |
| `generating-images` | How to generate and edit images well: intake, when not to generate, choosing a model per kind of ask, prompt rules, review, plus playbooks and a dated model reference. Preloaded into `image-generator`. |
| `generating-videos` | The same for video clips: shot prompts with camera and audio, image-to-video, consistency across shots, cheap tests before finals. Preloaded into `video-generator`. |
| `illustrating` | How to make vector illustrations: intake, choosing between drawing, AI vector models and tracing a concept, style rules before pieces, clean SVG and Figma vectors, plus playbooks and a vector-tools reference. Preloaded into `illustrator`. |
| `designing-motion` | How to design and build motion: intake, choosing a medium, writing the spec first, timing and easing by purpose, accessibility, frame-by-frame checks, plus playbooks and default tokens. Preloaded into `motion-designer`. |
| `creating-skills` | Writes or revises a `SKILL.md`: when a skill is the right tool, frontmatter, trigger descriptions, a concise body, supporting files and testing. |
| `creating-subagents` | Writes or revises a subagent definition in `.claude/agents/`: model and effort for the role, the fewest tools needed, a system prompt with a report the parent can verify, and testing. |

Claude loads a skill on its own when your request matches it, or you can call it directly, for example `/model-router:coordinating-subagents`.

## The agents

Each agent has a default model and effort. A coordinator can override both per call.

| Area | Agent | Default | What it does |
| --- | --- | --- | --- |
| Code | `test-runner` | Haiku `medium` | Runs tests, type-check, lint or build, and triages the failures. It never fixes anything |
| Code | `build-error-resolver` | Haiku `medium` | Fixes type, lint, import and build errors with minimal diffs |
| Code | `e2e-runner` | Haiku `medium` | Checks user flows in a real browser with Playwright |
| Code | `debugger` | Sonnet `high` | Reproduces a bug, confirms the root cause, fixes it and adds a regression test |
| Code | `spec-reviewer` | Sonnet `high` | Checks the change against what was asked, requirement by requirement. Read-only |
| Code | `code-reviewer` | Sonnet `high` | Reviews a diff for bugs, regressions and security, with `file:line` evidence. Read-only |
| Design | `ux-researcher` | Sonnet `medium` | Synthesizes feedback, interviews and competitor patterns into sourced findings |
| Design | `interaction-designer` | Opus `medium` | Maps flows, information architecture and every screen state, and can draw in FigJam |
| Design | `ui-designer` | Opus `medium` | Explores distinct visual directions as Figma frames or HTML mockups |
| Design | `design-system-guardian` | Haiku `medium` | Audits Figma and code against tokens and components. Read-only |
| Design | `ux-writer` | Sonnet `medium` | Writes interface copy and checks it for consistency |
| Design | `visual-qa` | Haiku `medium` | Screenshots the UI across viewports and states and lists visible defects, without reading code |
| Design | `design-critic` | Opus `medium` | Critiques a design from screenshots only, as an independent second opinion |
| Assets | `motion-designer` | Sonnet `medium` | Designs and builds motion: UI interactions, Lottie, Rive state machines and runtime, Remotion motion graphics |
| Assets | `illustrator` | Opus `medium` | Makes vector illustrations and icons (SVG or Figma), by drawing them, generating vectors, or tracing a concept, and writes style guides |
| Assets | `image-generator` | Sonnet `medium` | Generates images with the connected generation tool, within a budget |
| Video | `video-generator` | Sonnet `medium` | Generates short clips with the connected generation tool, testing before the final clip |
| Video | `video-editor` | Sonnet `medium` | Builds and renders videos in Remotion |

The agents are listed in every session as `model-router:<name>`, so you can also call them directly, for example `@agent-model-router:design-critic`.

Some agents work best with extra tools you install separately:
- `e2e-runner` and `visual-qa` need the Playwright plugin.
- The design agents use the [figma-console](https://github.com/southleft/figma-console-mcp) MCP server for Figma work.
- `image-generator` and `video-generator` need an image or video generation tool, such as fal.ai's MCP server. Without one, they return ready-to-use prompts instead. When a brief is missing essentials, they return questions rather than spending credits.
- `motion-designer` and `video-editor` use LottieFiles' [`motion-design`](https://github.com/LottieFiles/motion-design-skill) skill and Remotion's [`remotion-best-practices`](https://github.com/remotion-dev/skills) skill when they're installed.

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
- The image and video model references were last checked on 2026-10-08. Generation models change every few months, so the agents also check what the connected tool offers.
- The skills haven't been measured against formal evals yet. They're built from Anthropic's published guidance and real use.

## Development

```
model_router/
├── .claude-plugin/
│   ├── plugin.json         the manifest
│   └── marketplace.json    makes this repository installable as a marketplace
├── agents/                 one file per subagent
└── skills/
    ├── coordinating-subagents/SKILL.md    the default coordinator and shared rules
    ├── coordinating-code/SKILL.md         loads the default, adds the code agents
    ├── coordinating-design/SKILL.md       loads the default, adds the design agents
    ├── coordinating-video/SKILL.md        loads the default, adds the video agents
    ├── coordinating-images/SKILL.md       loads the default, adds the image agents
    ├── generating-images/                 SKILL.md, plus reference/playbooks.md and reference/models.md
    ├── generating-videos/                 SKILL.md, plus reference/playbooks.md and reference/models.md
    ├── coordinating-illustration/SKILL.md loads the default, adds the illustration agents
    ├── coordinating-motion/SKILL.md       loads the default, adds the motion agents
    ├── illustrating/                      SKILL.md, plus reference/playbooks.md and reference/vector-tools.md
    ├── designing-motion/                  SKILL.md, plus reference/playbooks.md and reference/tokens-and-tools.md
    ├── creating-skills/SKILL.md
    └── creating-subagents/SKILL.md
```

```bash
claude plugin validate .   # checks the manifest as Claude Code reads it
```

To work on it live, install it from a local folder (`claude plugin marketplace add <folder>`). Claude Code then reads the skills straight from that folder, and `/reload-plugins` picks up each edit.

## License

[MIT](LICENSE)
