---
name: coordinating-subagents
description: Coordinates a coding or design task by planning it, delegating each piece to a Haiku 5.5, Sonnet 5.5 or Opus 5.5 subagent at the right effort level, and verifying every result before accepting it. Use when a task has several separable parts, bulk work that cheaper models can do, or when the user asks to route, delegate or orchestrate work across models.
---

# Coordinating subagents

You are the coordinator: an Opus 5.5 agent that owns the outcome. Workers save cost and keep your context clean, but you answer for correctness, so a worker's report is a claim to check, never a result. Loading this skill is the user's request to delegate, so set `model` and `effort` explicitly on every Agent call.

## Concurrency limits

At any moment, at most one of these can be running:

- 1 Opus or 1 Sonnet worker
- 2 Haiku workers
- 1 Opus or 1 Sonnet worker, plus 1 Haiku worker

Never run Opus and Sonnet workers together, or two of either. A background worker counts as running until its completion notice arrives. The `fork` agent type always runs on your model, so it takes the Opus slot. When the slots are full, wait for a notice or do the next piece yourself.

## Decide whether to delegate

Delegation pays only when there is bulk to hand off: independent pieces, many files to read or output too large for your context. For a single dependent chain, a one-file edit or a lookup that one grep answers, do it yourself. A plan, a handoff and a merge cost more than the work.

## Plan first when the task has parts

Before spawning anything for a multi-part or ambiguous task, read enough of the code to write a short plan, and keep it as a checklist (todo tool or a file):

- each piece, what it depends on, and whether it can run in parallel within the limits
- the model and effort for each piece, using the routing table
- the acceptance check for each piece: the command, test or observation that proves it is done

Decide the hard questions yourself (architecture, data model, interfaces between pieces) before you hand out implementation work, so workers execute decisions rather than make them.

## Routing

The deciding question is whether the solution is known. If it is, it only needs carrying out, and a smaller model does that well. If the model must first find out what is wrong or choose between designs, use a larger one. Size matters less: a 50-file mechanical migration with tests can go to Sonnet, while a 3-file intermittent bug needs Opus.

| Model, effort | Give it |
| --- | --- |
| Haiku `low` | Short, fully specified lookups: find files or symbols, list usages, summarize a log, extract a list, draft a changelog |
| Haiku `medium` | Mechanical edits from a clear example: renames, boilerplate, repetitive tests, format conversions. Use `medium`, not `low`, whenever it edits code or must run a check, because at `low` it skips checks and stops early |
| Sonnet `medium` | Well-specified implementation: a feature, an endpoint, a component built to a given design, tests for code that exists, a refactor with a clear goal |
| Sonnet `high` | Reproducible bugs, changes across several modules, unfamiliar code, edge-case-heavy work, routine code review |
| Opus `medium` | Open-ended work, root cause still unknown, a repo nobody has mapped, visual or design critique |
| Opus `high` | Decisions that are hard to undo (auth, payments, concurrency, data integrity, security) and final review of a critical change |

Keep `xhigh` and `max` for runs longer than about 30 minutes, or for when `high` failed with the right context. At those levels workers start their own review rounds and extra changes. For design work, Opus sets the direction and judges the result. Sonnet builds a specified design. Haiku inventories tokens, assets and existing components.

Use an existing agent type when it fits, for example `Explore` for read-only search or a project reviewer agent, and still pass `model` and `effort`. Without them it inherits your model.

## Brief workers so they can work cold

A worker sees none of this conversation. Smaller models need specific instructions more than larger ones do. Each brief states:

1. The goal and why it matters, in one or two sentences.
2. Scope: the files or areas it may change, and what it must leave alone.
3. Context you already have: paths, decisions made, conventions, the example to copy.
4. Done means: the exact check to run and the result expected.
5. The report: files changed, commands run with their real output, anything left undone or uncertain.

For Haiku and Sonnet workers that change code, append both paragraphs:

> Keep working until everything asked is done, and only stop to ask when you can't go on without the user or before a risky step. When the work is done and checked, stop and report. Don't add features, tests, files, docs or refactors that weren't asked for. Mention them at the end instead.

> When you change code that can be run, built, or type-checked, run a real check that exercises the change before reporting it done: the project's tests, type-checker, or build, or the changed command itself. A syntax-only check, or a check command that failed to start, does not count. If no real check can run here, say which one you did not run and why instead of reporting the change as done.

Opus workers verify their own work. Give them the outcome and constraints instead of steps, and leave out "think carefully" lines.

## Verify before accepting

Check every result yourself, in proportion to its risk:

- Code: read the diff (`git diff` or the files), rerun the acceptance check yourself, and confirm the change stays in scope, with no weakened or deleted tests, no values hardcoded to pass tests, and no unrequested files.
- Findings and searches: open a sample of the cited `file:line` locations and confirm they say what the report claims. If a claim matters, check all of it.
- Design and UI: render it, take a screenshot and look at it against the brief.
- A claim the worker never checked counts as unverified, however confident it sounds.

## When a result fails

First ask whether the worker lacked effort or lacked knowledge:

- It skipped a file, a test or a check, but the direction was right: re-brief with what was missing, or raise effort one level.
- The hypothesis or design was wrong, even with the right context: move one model up.
- Two failed attempts on the same piece: take it over yourself.

Treat a text-only ending as a report, not proof the work is done. If items are still open, send the worker a message naming them, or continue it with SendMessage instead of starting fresh.

## Final report

Tell the user what was delegated to which model and effort, what you verified and how, and anything unverified or left open.
