---
name: creating-skills
description: Creates or revises Claude Code skills (SKILL.md files) following Anthropic's skill-authoring and prompting best practices, from frontmatter and trigger description to body, supporting files and testing. Use when the user asks to write, improve, review or debug a skill, slash command or SKILL.md.
---

# Creating skills

A skill is a set of instructions that loads only when its description matches the task. Only `name` and `description` sit in context all the time. The body loads when the skill triggers and then stays for the rest of the session, so every line costs tokens on every later turn.

## Check that a skill is the right tool

- A skill fits a repeatable procedure or body of know-how that is needed only sometimes.
- A rule that applies to every task belongs in `CLAUDE.md`.
- Work that should run in its own context, with its own model and tools, fits a subagent. Use the `creating-subagents` skill for that.
- Something that must happen automatically on an event, every time, is a hook, because a skill can't enforce it.

## Start from evidence

1. Do the task once without the skill and note what Claude got wrong or had to be told.
2. Write two or three test prompts that exercise those gaps, including one that should not trigger the skill.
3. Write only enough to close those gaps. Claude already knows general programming. Add what it can't know: your conventions, paths, decisions, gotchas and exact commands.

## Frontmatter

```yaml
---
name: processing-invoices        # lowercase, digits, hyphens; at most 64 chars; no "claude" or "anthropic"
description: Extracts line items from invoice PDFs and reconciles them against the ledger. Use when the user mentions invoices, bills, or reconciling payments.
---
```

- Write the description in the third person, with what the skill does and then when to use it. Include the words a user would actually type. Put the key use case first, because Claude Code truncates `description` plus `when_to_use` at 1,536 characters, and the API caps `description` at 1,024.
- Prefer gerund names (`reviewing-migrations`) and avoid vague ones (`helper`, `utils`).
- Optional Claude Code fields, used only when needed:
  - `disable-model-invocation: true` for workflows with side effects (deploy, commit, publish), so they run only through `/name`.
  - `allowed-tools` for narrow pre-approvals, such as `Bash(git status *)`.
  - `model` and `effort` to override the session while the skill is active.
  - `context: fork` with `agent: <type>` to run the skill as a subagent. The body must then be a self-contained task, because the fork sees no conversation.
  - `paths` to load the skill only around matching files, and `arguments` with `$name`, or `$ARGUMENTS`, for inputs.
- Unknown fields are ignored silently, so a typo in a field name fails without an error.

## Body

- **Be concise.** For each paragraph, ask whether Claude would get it wrong without it. Cut whatever it would get right anyway. Keep the body under 500 lines, and well under that when you can.
- **Explain why, calmly.** A short reason lets Claude generalize. Current models follow instructions closely, and ALL-CAPS or "CRITICAL: you MUST" language makes them overtrigger. Write "Use X when Y."
- **Say what to do rather than what to avoid.** Give one default, with an escape hatch, instead of a menu of options.
- **Match freedom to fragility.** Use heuristics where many approaches work. Use an exact command or script where one wrong step breaks things.
- **Write standing instructions.** The skill isn't re-read on later turns, so phrase rules to hold for the whole task.
- **Use checklists and feedback loops** for multi-step or fragile work: run the validator, fix the errors, then run it again. Include the real check, such as tests, a build or a render, and what passing looks like.
- **Use one term per concept** throughout the skill.
- **Leave out dates and "new in" notes**, since they go stale.
- **Use concrete examples.** One input-to-output example teaches a format better than a description of it. Wrap examples in `<example>` tags when they sit next to instructions.

## Supporting files

- Put long reference material in files beside `SKILL.md` and link to each one directly from `SKILL.md`, never more than one level deep. Say when to read each file.
- Give any reference file longer than 100 lines a short table of contents at the top.
- For deterministic work, ship a script and say whether to run it or read it. A script that handles its own errors beats one that leaves them to Claude.
- Use forward slashes in paths, and descriptive file names (`reference/billing-rules.md`, not `doc2.md`).

## Model differences

Skills run on whatever model loads them, so write for the weakest one that will use yours:

- Haiku needs explicit steps and an explicit "done means" check. At `low` effort it can stop early or skip verification.
- Sonnet follows specific instructions well. At high effort it adds unrequested tests and docs unless the scope is stated.
- Opus needs the least. Over-explaining and "think step by step" lines waste its tokens, and it verifies its own work.

## Test before calling it done

1. Run `claude plugin validate <absolute-plugin-path>` when the skill lives in a plugin.
2. In a fresh session, send the test prompts. Check that the skill triggers when it should and stays quiet when it shouldn't, then compare the output with a run without the skill.
3. Watch which parts Claude ignores, misreads or rereads, and revise those parts instead of adding more text.
4. If it will run on several models, try each of them.

Where skills live: `~/.claude/skills/<name>/SKILL.md` (personal), `.claude/skills/<name>/SKILL.md` (project), or `<plugin>/skills/<name>/SKILL.md` (plugin, invoked as `/plugin:name`).
