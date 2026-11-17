---
name: generating-videos
description: Plans, prompts, generates and reviews short AI video clips with whichever video-generation tool is connected (Veo, Kling, Seedance, Runway, Hailuo and others, often through fal.ai). Covers intake questions, choosing a model for the shot, shot prompts with camera and audio, image-to-video, first and last frames, consistency across shots, and checking clips. Use when asked to generate video clips or b-roll, animate a still, or write prompts for a video model.
---

# Generating videos

Video generation is slow, costly and unpredictable, and each clip covers one shot of a few seconds. Plan every shot fully, test it cheaply, and generate the final clip only when the test proves the prompt works.

## 1. Intake

You need these before generating. Take what the brief, the shot list or `DESIGN.md` already answer, and ask only for the rest:

- **Purpose:** where the clips will be used (an edit in Remotion, a social post, a website background) and the platform.
- **Format:** aspect ratio (16:9 or 9:16), resolution, and the length of each shot.
- **Shots:** for each one, the subject, a single action, the camera and the setting. If there are several shots, how they connect.
- **Look:** style, color grade, references, and any start or end frames.
- **Audio:** none, ambient or sound effects, or dialogue (the exact lines and who says them). Many models can't do audio at all.
- **Budget:** maximum generations. Default to one test and one final per shot.
- **Rights:** real people, voices, logos or trademarks, and whether they're cleared.

If you're a subagent and an essential is missing, don't guess. Return the questions (see "Needs input" below). Essentials are purpose, format and what happens in each shot.

## 2. Check that generation is the right tool

- UI walkthroughs, screen recordings, animated text, charts and logo reveals are better built in Remotion or by the motion designer. The result is exact and editable.
- A real person speaking needs consent. Never generate a real person's likeness or voice unless the brief says it's cleared.
- Anything longer than one shot is an edit. Generate the shots separately, and let the video editor assemble them.

## 3. Choose the model

**fal.ai is available in every repo** through `node ${CLAUDE_PLUGIN_ROOT}/scripts/fal.mjs` (key in `~/.config/fal/.env`), and it hosts most video models (Veo, Kling, Seedance, Hailuo and others):

- `search "<words>" --category text-to-video` (or `image-to-video`) lists live models and their price per second. `schema <endpoint>` shows the inputs (duration, aspect ratio, audio, first and last frame fields).
- `run <endpoint> --prompt "..." --input '{"duration":"5"}' --file image_url=start.png --out <project folder> --name <shot> --dry-run` shows the estimate. Video is priced per second, so always pass `duration`; without it the estimate assumes 10 s. Then run without `--dry-run`. Clips usually take one to five minutes; the script waits up to 15 (`--timeout-s`).
- A run whose estimate is above $1 is refused. Test on a cheap tier at the shortest duration, and pass `--max-usd` for a final only when the brief allows that spend. Costs are logged to `~/.config/fal/usage.jsonl`; `spend --since 30d` totals them.

List the models the tool actually offers. Then pick by the shot's needs (audio, motion, length, references, cost), using `${CLAUDE_SKILL_DIR}/reference/models.md`. Use a fast or cheap tier for tests, and the best fit for the finals.

## 4. Write the shot prompt

Find the kind of shot in `${CLAUDE_SKILL_DIR}/reference/playbooks.md`. These apply to every shot:

- **Formula:** `[cinematography] + [subject] + [action] + [context] + [style and ambiance]`. For example: "Slow dolly-in, close-up of a ceramic mug on a wooden table, steam rising, early morning kitchen with soft window light, warm muted film look."
- **Give each shot one clear action.** Models handle one motion far better than a sequence of events.
- **Camera:** name the move and the framing (dolly, tracking, crane, slow pan, static, aerial; wide shot, close-up, low angle). Name the lens and focus as well (shallow depth of field, macro, wide-angle).
- **Audio:** write spoken lines in quotes, attributed to a speaker, with the delivery (`A woman says calmly, "We're ready."`). Add `SFX: …` and `Ambient noise: …` lines. Leave audio out entirely for models without it.
- **Say what you want instead of what to avoid.** Write "a quiet empty road", not "no cars".
- **Timing within one clip:** some models accept timestamped segments (`[00:00-00:02] …`, `[00:02-00:04] …`). Use them only where the model documents them.

## 5. Consistency across shots

- Make start frames first, with the image-generation skill, from fixed character and style references. Then animate them with image-to-video.
- Where the model supports reference images, pass the same character, object and setting references to every shot, and name them in the prompt.
- Reuse a fixed style block (grade, lens, lighting) word for word in every shot prompt.

## 6. Test, review and finalize

1. Generate a test at the cheapest settings: a shorter clip, lower resolution or a fast tier.
2. Review it at full speed, then frame by frame:
   - **Action:** happens as described, and only that.
   - **Camera:** moves as described.
   - **Temporal artifacts:** morphing, flicker, extra limbs, warped hands or text, objects popping in or out.
   - **Continuity:** matches the start frame and the other shots.
   - **Audio:** in sync and correct, if any.
   - **Format:** the right aspect ratio and length.
3. Adjust the prompt or start frame and retest within the budget. Generate the final only when the test is right.
4. Save each final with a descriptive name. Note the usable frame range, loop points and the model, settings and prompt.

## Report

For each shot, give the clip path, duration, resolution, the model and prompt, and how it meets the brief. Then give the generations used out of the budget, the shots that didn't work and what was tried, and notes for the editor.

**Needs input:** when essentials are missing, return only a numbered list of questions, each with two to four suggested answers and the one you recommend first. Don't generate anything first.

If fal fails (no key, no credit) and no other video tool is connected, return the model choice and finished shot prompts, and say that nothing was generated.
