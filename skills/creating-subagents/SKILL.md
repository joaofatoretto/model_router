---
name: creating-subagents
description: Creates or revises Claude Code subagent definitions (.claude/agents/*.md), choosing the model, effort, tools and system prompt for the role, and testing that delegation and output work. Use when the user asks to create, configure, tune or debug a subagent, agent definition or worker agent.
---

# Creating subagents

A subagent is a separate Claude with its own context, model, effort and tools. It starts cold, without the parent's conversation, and returns one final message. Define one when a role recurs and needs isolation: bulk reading that would flood the parent's context, a cheaper model for routine work, or a restricted tool set. For a one-off task, a well-written brief to an existing agent type is enough.

## File and location

```markdown
---
name: test-writer
description: Writes unit tests for existing, already-specified code, following the project's test conventions. Use proactively after a feature is implemented and needs tests.
tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
effort: medium
---

You write unit tests for code that already exists. ...
```

- Locations, from highest to lowest priority: `--agents` flag, `.claude/agents/` (project), `~/.claude/agents/` (personal), plugin `agents/`.
- Only `name` and `description` are required. Names can't contain `:`. Multi-word fields are camelCase (`disallowedTools`, `maxTurns`, `permissionMode`). Unknown or misspelled fields are ignored without an error, so check the spelling.

## Description

The parent reads the description to decide when to delegate, and every session pays for it, so keep it to one or two sentences: what the agent does and when to use it. Add "Use proactively" if the parent should delegate without being asked. Put details in the body, which loads only when the agent runs.

## Model and effort

Set both explicitly. With `model` left out, the agent inherits the parent's model, so an Opus session runs every worker on Opus. Use the alias (`haiku`, `sonnet`, `opus`) or a full ID. A per-call `model` from the parent overrides the file.

| Role | Model, effort |
| --- | --- |
| Read-only search, inventory, log or doc summaries | `haiku`, `low` |
| Mechanical edits from an example, boilerplate, repetitive tests | `haiku`, `medium` |
| Implementing a specified feature, tests, local refactors | `sonnet`, `medium` |
| Reproducible debugging, multi-module changes, routine review | `sonnet`, `high` |
| Ambiguous investigation, architecture, security or critical review | `opus`, `medium` or `high` |

Pick by whether the solution is already known (a smaller model will do) or still has to be discovered (use a larger one), not by how many files are involved. `xhigh` and `max` suit long autonomous runs. At those levels agents start their own review rounds and extra fixes.

## Tools and other fields

- Grant the fewest tools the role needs. A reviewer or researcher gets `Read, Grep, Glob` and maybe `Bash`, with no `Edit` or `Write`. Use `disallowedTools` to remove a few tools from the inherited set.
- `maxTurns` caps runaway loops. `isolation: worktree` gives agents that write in parallel their own checkout. `background: true` keeps an agent off the main thread.
- `skills` preloads skills into the agent, `memory` gives it a persistent scope, `permissionMode` sets how it handles approvals, and `omitClaudeMd: true` drops CLAUDE.md for agents that don't need project rules.

## System prompt

Write the body as a brief to a capable colleague who has never seen the project:

1. **Role and goal.** One sentence on what it does and why that matters.
2. **Inputs.** What the parent will pass and what to do if something is missing.
3. **Scope.** What it may change and what it leaves alone.
4. **Approach.** Steps only where order matters. Otherwise give heuristics. Smaller models need more specifics, Opus needs fewer.
5. **Done means.** The real check to run before reporting.
6. **Report format.** A fixed structure the parent can verify: files changed, commands run with their actual output, open questions, anything not done and why.

For Haiku and Sonnet agents that edit code, include both of these, adapted to the role:

> Keep working until everything asked is done, and only stop to ask when you can't go on without the user or before a risky step. When the work is done and checked, stop and report. Don't add features, tests, files, docs or refactors that weren't asked for. Mention them at the end instead.

> When you change code that can be run, built, or type-checked, run a real check that exercises the change before reporting it done: the project's tests, type-checker, or build, or the changed command itself. A syntax-only check, or a check command that failed to start, does not count. If no real check can run here, say which one you did not run and why instead of reporting the change as done.

For Opus agents, describe the outcome and constraints. Leave out "think carefully" and repeated verification reminders, since it verifies its own work. Across all models, write calm instructions with reasons rather than ALL-CAPS rules, and say what to do rather than what not to do.

## Test before calling it done

1. Give the agent two or three real tasks, with one that should go to a different agent.
2. Check that the parent delegates to it when expected, and that the run uses the model and effort you set.
3. Check the report against reality: open the diff, rerun the check, and confirm that the cited lines say what the report claims.
4. Tighten whatever went wrong, whether scope, tools or effort, and test again. Run `claude plugin validate` if the agent ships in a plugin.
