---
name: coordinating-motion
description: Coordinates motion work (UI micro-interactions and transitions, Lottie and Rive animations, motion graphics, product motion systems) with the model-router motion-designer, illustrator, interaction-designer, visual-qa and e2e-runner, on top of the coordinating-subagents rules, spec first and prototype before building out. Use when the user wants interactions animated, an animated asset, or a motion language for a product.
---

# Coordinating motion work

First read `${CLAUDE_SKILL_DIR}/../coordinating-subagents/SKILL.md` and follow it: the concurrency limits, planning, routing, briefing and verification rules all apply. Then read `${CLAUDE_SKILL_DIR}/../designing-motion/SKILL.md`, which defines the intake, the medium choice, the spec and the checks. This skill adds the motion agents and workflow.

Motion has to be seen at full speed to be judged, and neither you nor the agents can watch it. Frames and specs catch mechanical problems. The feel needs the user, so the workflow includes a prototype the user tries before anything is built out.

## What to ask

Settle the designing-motion intake before dispatching anything: what moves, its trigger and job, the personality, the medium and runtime, platforms and budgets, accessibility, and the deliverable. Check `DESIGN.md`, the motion tokens and the animation libraries already in the code first, then ask the user with `AskUserQuestion` about what's left. References matter more for motion than for most work, so ask for examples the user likes or dislikes.

## Roster

Call each agent by its full name. The model and effort shown are its defaults. A per-call `model` or `effort` overrides them, and the concurrency slot follows the model it actually runs on.

| Agent | Default | Use it to |
| --- | --- | --- |
| `model-router:motion-designer` | Sonnet `medium` | Write motion specs, and build CSS, Motion, GSAP, Lottie, Rive integration or Remotion motion |
| `model-router:illustrator` | Opus `medium` | Prepare vector art structured for animation (named, separated layers) for Lottie or Rive |
| `model-router:interaction-designer` | Opus `medium` | Map the states and triggers of a complex interaction before its motion is designed |
| `model-router:visual-qa` | Haiku `medium` | Check end states, layout stability and the reduced-motion version across viewports |
| `model-router:e2e-runner` | Haiku `medium` | Check that animated interactions still work: focus, clicks during transitions, no blocked input |
| `model-router:video-editor` | Sonnet `medium` | Place motion graphics in a Remotion video |

The Opus and Sonnet agents share the single big slot and run one at a time. visual-qa and e2e-runner can run together.

## Typical flow

1. **Intake:** ask the questions above.
2. **States:** for complex interactions, interaction-designer maps the states and triggers first.
3. **Spec:** motion-designer writes the motion spec, using the project's tokens or the documented defaults. Review it yourself for purpose, timing range and reduced motion.
4. **Prototype:** motion-designer builds one representative interaction. Give the user the URL or command to try it. **Checkpoint:** the user approves the feel, or asks for changes such as faster, softer or less movement.
5. **Assets:** when Lottie or Rive art is needed, illustrator prepares layered vectors. For Rive, motion-designer writes the state-machine spec for the user to build in the Rive editor, then wires the runtime.
6. **Build out:** motion-designer applies the approved motion to the rest of the scope.
7. **Verify:** run visual-qa and e2e-runner together, check the reduced-motion version and file sizes, and look at the key frames yourself.
8. **Deliver:** the files, the motion spec or tokens (offer to record them in `DESIGN.md`), and what the user should watch at full speed.
