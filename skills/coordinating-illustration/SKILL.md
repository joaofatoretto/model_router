---
name: coordinating-illustration
description: Coordinates vector illustration work (icon sets, spot and empty-state art, heroes, characters, explanatory graphics, illustration systems) with the model-router illustrator, plus image-generator for raster concepts along the way and design-critic for review, on top of the coordinating-subagents rules. Output is always vector (SVG or Figma). Use when the user wants illustrations, icons, an illustration set or an illustration style.
---

# Coordinating illustration work

First read `${CLAUDE_SKILL_DIR}/../coordinating-subagents/SKILL.md` and follow it: the concurrency limits, planning, routing, briefing and verification rules all apply. Then read `${CLAUDE_SKILL_DIR}/../illustrating/SKILL.md`, which defines the intake, the routes and the quality checks. This skill adds the illustration agents and workflow.

The deliverable is always vector: SVG files, inline SVG or Figma components. A generated raster image can be a concept or a tracing source along the way, never the result. When the user wants a raster image as the final output, use the coordinating-images skill instead.

The user is a designer and owns the style. Show options at the checkpoints and let them choose.

## What to ask

Settle the illustrating intake before dispatching anything: purpose and placement, single piece or set, style source, color and theming, output format, decorative or informative, and the generation budget if any generation will happen. Check `DESIGN.md`, the Figma file and the existing illustrations first, then ask the user with `AskUserQuestion` about what's left. Whether a style already exists matters most, because it decides whether the work starts with style exploration.

## Roster

Call each agent by its full name. The model and effort shown are its defaults. A per-call `model` or `effort` overrides them, and the concurrency slot follows the model it actually runs on.

| Agent | Default | Use it to |
| --- | --- | --- |
| `model-router:illustrator` | Opus `medium` | Explore styles, draw vectors (SVG or Figma), write style guides, critique illustration work |
| `model-router:image-generator` | Sonnet `medium` | Make raster concepts or tracing sources when the illustrator asks for one ("Needs a concept") |
| `model-router:design-critic` | Opus `medium` | Give an independent critique of a style test, the hero piece or the finished set |
| `model-router:design-system-guardian` | Haiku `medium` | Check that the SVGs or Figma vectors use the system's colors and tokens |
| `model-router:motion-designer` | Sonnet `medium` | Animate the illustrations, when the brief includes motion |

The Opus and Sonnet agents share the single big slot and run one at a time. For mechanical batch work (SVGO, exporting sizes, building a contact sheet), brief `general-purpose` on Haiku.

## Typical flow

1. **Intake:** ask the questions above.
2. **Style:** if no style exists, have illustrator explore two or three style tests on one representative subject, each with written style rules. **Checkpoint:** the user picks or combines them, and you record the rules in `DESIGN.md`.
3. **Hero piece:** illustrator draws one piece in the chosen style. If it asks for a concept, get one from image-generator, look at it yourself, and pass it back. **Checkpoint:** the user approves the hero.
4. **The rest of the set:** illustrator draws the remaining pieces against the hero, in batches where the set is large.
5. **Technical pass:** optimize the SVGs, add accessibility attributes, check theming on light and dark, and export the sizes. design-system-guardian checks the colors against the tokens.
6. **Review:** build a contact sheet of the whole set, look at it yourself, and for important sets run design-critic. **Checkpoint:** the user signs off.
7. **Deliver:** file paths or Figma links, the style rules, and notes for animation if motion follows.
