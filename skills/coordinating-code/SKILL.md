---
name: coordinating-code
description: Coordinates a coding task with the model-router code agents (code-reviewer, spec-reviewer, test-runner, build-error-resolver, e2e-runner, debugger), on top of the coordinating-subagents rules. Use for features, bug fixes, refactors and other code work that has several parts or needs independent verification.
---

# Coordinating code work

First read `${CLAUDE_SKILL_DIR}/../coordinating-subagents/SKILL.md` and follow it: the concurrency limits, planning, routing, briefing and verification rules all apply. This skill adds the code agents and the order to use them in.

## What to ask

Read the relevant code first, so you ask only what the code can't answer. For code work, the questions that most often change the result are these:

- **Scope:** what's in and out, and whether nearby problems you noticed should be fixed now or left.
- **Behavior:** acceptance criteria, edge cases and error handling, especially where the request and the existing code disagree.
- **Constraints:** compatibility (APIs, data, browsers, versions), performance, and dependencies you may or may not add.
- **Approach:** when two designs are both reasonable and hard to change later, show both with their trade-offs.
- **Delivery:** whether to commit, branch, open a PR, or leave the changes uncommitted.

## Roster

Call each agent by its full name. The model and effort shown are its defaults. A per-call `model` or `effort` overrides them, and the concurrency slot follows the model it actually runs on.

| Agent | Default | Use it to |
| --- | --- | --- |
| `model-router:test-runner` | Haiku `medium` | Run tests, type-check, lint or build, and get a compact triage. It never fixes anything |
| `model-router:build-error-resolver` | Haiku `medium` | Fix local type, lint, import and build errors with minimal diffs |
| `model-router:e2e-runner` | Haiku `medium` | Check user flows in a real browser with Playwright |
| `model-router:debugger` | Sonnet `high` | Find and fix the root cause of a reproducible bug. Run it on Opus for intermittent or cross-system bugs |
| `model-router:spec-reviewer` | Sonnet `high` | Check the change does what was asked, requirement by requirement |
| `model-router:code-reviewer` | Sonnet `high` | Review the diff for bugs, regressions and security. Run it on Opus for risky or release-blocking changes |

For implementation itself, brief `general-purpose` at the model and effort from the routing table. For read-only searches, use `Explore` on Haiku.

## Typical flow

1. Explore on Haiku, or read the code yourself, then plan.
2. Implement: `general-purpose` on Sonnet for specified work. Hard parts you decide yourself, or give to Opus.
3. Run test-runner. If there are build or type errors, run build-error-resolver. For other failures, run debugger.
4. When there is a UI flow, run e2e-runner. It can run alongside test-runner, since two Haiku workers fit the limits.
5. Run spec-reviewer, then code-reviewer, one after the other because both use the Sonnet slot. Send findings back to the implementer with SendMessage, and review again only the fixed parts.
6. Verify the final state yourself, as the base skill requires.

Leave steps out when they don't apply. A one-file fix with passing tests doesn't need both reviewers.
