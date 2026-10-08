---
name: coordinating-design
description: Coordinates UI/UX and visual design work with the model-router design agents (ux-researcher, interaction-designer, ui-designer, design-system-guardian, ux-writer, motion-designer, illustrator, image-generator, visual-qa, design-critic), on top of the coordinating-subagents rules, keeping the user as the design decision-maker. Use for product design, flows, visual direction, design systems, UI builds that must match a design, and design assets.
---

# Coordinating design work

First read `${CLAUDE_SKILL_DIR}/../coordinating-subagents/SKILL.md` and follow it: the concurrency limits, planning, routing, briefing and verification rules all apply. This skill adds the design agents and a design workflow.

The user is a product designer and owns the design decisions. Agents research, map, explore, build and check. At each decision point, show the user the options with `AskUserQuestion`, or as screenshots and links, and let them choose. Don't pick a direction on their behalf.

## DESIGN.md

Look for a `DESIGN.md` in the project before starting. It holds the product's principles, tokens, approved references and rejected patterns. Pass its path in every design brief. If there is none, offer to draft one with the user from the existing product, because without it every agent falls back on its own defaults. When the user approves or rejects a direction, offer to record that in the file.

## Roster

Call each agent by its full name. The model and effort shown are its defaults. A per-call `model` or `effort` overrides them, and the concurrency slot follows the model it actually runs on.

| Agent | Default | Use it to |
| --- | --- | --- |
| `model-router:ux-researcher` | Sonnet `medium` | Synthesize feedback, interviews and competitor patterns into sourced findings |
| `model-router:interaction-designer` | Opus `medium` | Map flows, information architecture and every screen state, with options where the flow is open. Can draw in FigJam |
| `model-router:ui-designer` | Opus `medium` | Explore distinct visual directions as Figma frames or HTML mockups |
| `model-router:design-system-guardian` | Haiku `medium` | Audit Figma and code against tokens and components. Run it on Sonnet to map a new direction onto the system |
| `model-router:ux-writer` | Sonnet `medium` | Write interface copy, or run a consistency pass. Run it on Haiku for a mechanical consistency pass |
| `model-router:motion-designer` | Sonnet `medium` | Design and build UI motion, Lottie, Rive or Remotion motion graphics |
| `model-router:illustrator` | Opus `medium` | Draw SVG or Figma illustrations, write style guides and art-direction briefs, or critique illustration work |
| `model-router:image-generator` | Sonnet `medium` | Generate raster images with the connected generation tool, within a budget |
| `model-router:visual-qa` | Haiku `medium` | Screenshot the built UI across viewports and states, and list visible defects |
| `model-router:design-critic` | Opus `medium` | Give an independent critique from screenshots only, for a second opinion or final review |

For building UI, brief `general-purpose` on Sonnet to implement from the approved design and `DESIGN.md`, using existing components and making no new visual decisions. For code-side checks, the code agents (`model-router:e2e-runner`, `model-router:code-reviewer`) are available too.

## Typical flow

Pick the stages the task needs. A copy fix needs one agent, while a new feature may need all of these.

1. **Understand:** ux-researcher, when there is evidence to synthesize or patterns to survey.
2. **Define:** interaction-designer maps the flows and states. **Checkpoint:** the user approves the flow and resolves its open decisions.
3. **Explore:** ui-designer produces two or three directions. **Checkpoint:** the user picks one, or combines them.
4. **Specify:** design-system-guardian maps the direction onto tokens and components, and ux-writer writes the copy. Commission any assets the design needs: illustrator, image-generator, motion-designer.
5. **Build:** `general-purpose` on Sonnet implements it.
6. **Verify:** run visual-qa and design-system-guardian together (two Haiku workers), then e2e-runner for the flows. Send defects back to the implementer.
7. **Review:** design-critic on the final screenshots. Bring its critique to the user rather than acting on taste-level points yourself.

## Briefing design agents

Besides the base briefing rules, a design brief states:
- the user and task the design serves
- the `DESIGN.md` path
- the Figma file or frame link, if there is one
- the states and viewports that matter
- where to save outputs

Look at every visual output yourself, as screenshots, before you pass it on to the user.
