---
name: coordinating-images
description: Coordinates image work (generated photos and renders, edits and cutouts, consistent image sets, illustrations, art direction) with the model-router agents image-generator, illustrator and design-critic, on top of the coordinating-subagents rules. It asks the user the intake questions and agrees a generation budget first. Use when the user wants images generated, edited or art-directed, or a set of visual assets.
---

# Coordinating image work

First read `${CLAUDE_SKILL_DIR}/../coordinating-subagents/SKILL.md` and follow it: the concurrency limits, planning, routing, briefing and verification rules all apply. Then read `${CLAUDE_SKILL_DIR}/../generating-images/SKILL.md`, which defines the intake, the kinds of ask and how results are judged. This skill adds the image agents and a production workflow.

The user is a designer and owns the look. Show them candidates and let them choose. Don't pick a final on taste alone.

## What to ask

Settle the generating-images intake (purpose and placement, format, look, content, quantity and budget, rights) before dispatching anything. Take what the request, `DESIGN.md` and any references already answer, and put the rest to the user with `AskUserQuestion`. The budget is always worth confirming, because generation spends the user's credits.

## Roster

Call each agent by its full name. The model and effort shown are its defaults. A per-call `model` or `effort` overrides them, and the concurrency slot follows the model it actually runs on.

| Agent | Default | Use it to |
| --- | --- | --- |
| `model-router:image-generator` | Sonnet `medium` | Generate and edit raster images with the connected generation tool, within the budget |
| `model-router:illustrator` | Opus `medium` | Draw SVG or Figma vectors, or write the style guide or art-direction brief that keeps a set consistent |
| `model-router:design-critic` | Opus `medium` | Give an independent critique of candidates or a finished set |

All three use the single big slot, so they run one at a time. For deterministic post-processing (resizing, format conversion, compression, cropping to breakpoints), brief `general-purpose` on Haiku, using tools such as ImageMagick or sharp.

## Typical flow

1. **Intake:** ask the questions above, and check that a generation tool is connected. If none is, say so and offer finished prompts instead.
2. **Route:** send vector work (icons, logos, simple and themeable illustration) to illustrator, and raster work to image-generator. For a set, or anything that must match a brand style, have illustrator write the art-direction brief first.
3. **Explore:** image-generator runs a small first round. Look at every candidate yourself, then show the user the best ones with their paths. **Checkpoint:** the user picks a direction, or asks for changes.
4. **Finalize:** image-generator refines the chosen direction, or generates the rest of the set from the approved hero image. Then run any post-processing.
5. **Review:** for important or brand-critical assets, run design-critic on the finals, and bring its notes to the user.
6. **Deliver:** give the final paths, sizes and formats, the generations used out of the budget, and the model and prompt for each image, so it can be reproduced.
