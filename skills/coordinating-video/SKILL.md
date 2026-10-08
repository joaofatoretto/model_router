---
name: coordinating-video
description: Coordinates video production in Remotion with the model-router agents (video-editor, video-generator, image-generator, motion-designer, illustrator, ux-writer, design-critic), on top of the coordinating-subagents rules, from script to final render. Use for product videos, demos, social clips, explainers and other video work.
---

# Coordinating video work

First read `${CLAUDE_SKILL_DIR}/../coordinating-subagents/SKILL.md` and follow it: the concurrency limits, planning, routing, briefing and verification rules all apply. This skill adds the video agents and a production workflow.

The user is a designer and owns the creative decisions: the script, the look, and the cut. Show them the options and the checkpoints listed below, and let them choose.

## Roster

Call each agent by its full name. The model and effort shown are its defaults. A per-call `model` or `effort` overrides them, and the concurrency slot follows the model it actually runs on.

| Agent | Default | Use it to |
| --- | --- | --- |
| `model-router:ux-writer` | Sonnet `medium` | Write the script, voiceover lines, on-screen text and captions |
| `model-router:illustrator` | Opus `medium` | Create vector art for the video, or write the art-direction brief for generated assets |
| `model-router:image-generator` | Sonnet `medium` | Generate stills, backgrounds and start frames |
| `model-router:video-generator` | Sonnet `medium` | Generate short clips from text or start frames, testing before the final clip |
| `model-router:motion-designer` | Sonnet `medium` | Design motion graphics, transitions and animated typography |
| `model-router:video-editor` | Sonnet `medium` | Build the Remotion timeline, assemble everything, render stills and the final video |
| `model-router:design-critic` | Opus `medium` | Critique key-frame stills before the final render |

Every agent here except design-critic defaults to Sonnet or Opus, so they share the single big slot and run one at a time. Lower the simple ones, such as a caption pass, to Haiku when you want to run two at once.

## Generation costs money

Image and video generation spend the user's credits, so:
- Before the first generation, check that a generation tool is connected. If none is, tell the user and stop at prompts.
- Agree the budget with the user: how many images and clips, and how many attempts each.
- Pass the budget in every generation brief, and track what's been used.

## Typical flow

1. **Brief:** agree the goal, audience, platform (aspect ratio, length) and look with the user. Read `DESIGN.md` if it exists.
2. **Script and storyboard:** ux-writer drafts the script. You turn it into a shot list: for each shot, the content, duration and whether the asset comes from generation, illustration, motion or existing footage. **Checkpoint:** the user approves the script and shot list.
3. **Assets:** commission what the shot list needs, one big-slot agent at a time:
   - illustrator writes the art direction before generation, so the generated assets share a style
   - image-generator makes start frames before video-generator animates them
   - motion-designer makes the motion graphics
4. **Assemble:** video-editor builds the timeline with labelled placeholders for missing assets, and renders key-frame stills.
5. **Review stills:** look at them yourself, then use design-critic for an independent read. **Checkpoint:** the user approves the stills.
6. **Render:** video-editor renders the final video. Check the duration, resolution and audio sync yourself before handing it over.
