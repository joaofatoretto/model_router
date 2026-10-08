---
name: generating-images
description: Plans, prompts, generates, edits and reviews raster images with whichever image-generation tool is connected (fal.ai, Gemini/Nano Banana, GPT Image, FLUX and others). Covers intake questions, choosing a model for the kind of image, prompt structure, editing and consistency, and checking results. Use when asked to generate, edit, extend or upscale an image, or to write prompts for an image model.
---

# Generating images

Generation spends money and each result is a gamble, so the work is mostly before and after the call: know exactly what's needed, pick the model that's good at it, write a precise prompt, and judge every output against the brief.

## 1. Intake

You need these before generating. Take what the brief, `DESIGN.md` or the conversation already answer, and ask only for the rest:

- **Purpose and placement:** where the image goes (hero, product page, social post, app screen, video start frame) and what it must communicate.
- **Format:** aspect ratio or pixel size, file type, and whether it needs a transparent background.
- **Look:** style, mood, palette (hex values if brand colors matter), references to match, and what to avoid.
- **Content:** the subject and any must-haves, plus any exact text that appears in the image.
- **Quantity and budget:** final images wanted and maximum generations. Default to two rounds of four.
- **Rights:** whether real people, logos or trademarks appear, and whether they're cleared.

If you're a subagent and an essential is missing, don't guess. Return the questions (see "Needs input" below). Essentials are purpose, format and subject.

## 2. Check that generation is the right tool

- An icon, logo, diagram or simple illustration is usually better as vector work (SVG or Figma). Hand it to the illustrator.
- A UI screen should be a real design or screenshot. Generation can supply the photos inside it, or a device mockup scene around it.
- A chart or exact diagram is better built in code.
- A logo or trademark should never be generated unless the brief says the rights are cleared.

## 3. Choose the model

List the models the connected tool actually offers. Then pick by the kind of ask, using `${CLAUDE_SKILL_DIR}/reference/models.md` for each model's strengths. Prefer a cheap or fast model for exploring and the best fit for the final images. If the tool offers only one model, use it and adapt the prompt.

## 4. Write the prompt

Find the kind of ask in `${CLAUDE_SKILL_DIR}/reference/playbooks.md` and follow its notes. These apply to every kind:

- **Order:** scene and background, then the subject, then key details, then constraints. State the intended use ("ad", "app onboarding illustration"), because it sets the level of polish.
- **Describe the scene in plain sentences, not keyword lists.** Name materials, textures, lighting, lens and framing ("low angle, shallow depth of field, soft window light").
- **Say what you want instead of what to avoid.** Write "an empty street", not "no cars". Many models, FLUX among them, ignore negative prompts.
- **Put any text that appears in the image in quotes,** with its font style, size, color and placement. Spell out unusual words letter by letter.
- **Colors:** give brand colors as hex values (`color #1A73E8`).
- **References:** refer to each reference image by its position and say what to take from it ("use image 1 for the character, image 2 for the palette").
- **Edits:** say what to change, then "keep everything else exactly the same". Repeat the list of things to keep on every round, because results drift.
- **Iterating:** make one change per round, and restate critical details rather than writing "same as before".

## 5. Generate, review and refine

1. Generate a small first round at draft quality.
2. View every output and check it against the brief:
   - **Subject:** correct and complete.
   - **Composition:** fits the placement, with room for text or UI overlays if needed.
   - **Style:** matches the references and the rest of the set.
   - **Text:** spelled exactly.
   - **Artifacts:** hands, faces, edges, warped geometry, garbled small text.
   - **Format:** the right aspect ratio and resolution.
3. Fix local problems with an edit, and global problems with a new prompt. Stay within the budget, and stop as soon as the brief is met.
4. Save the finals at the requested size and format, with descriptive names. Never flatten a transparent PNG to JPEG.

## Report

For each final image, give the path, the model, the prompt and how it meets the brief. Then give the generations used out of the budget, the rejected directions in one line each, and what would improve the results.

**Needs input:** when essentials are missing, return only a numbered list of questions, each with two to four suggested answers and the one you recommend first. Don't generate anything first. The coordinator turns this list into questions for the user.

If no generation tool is connected, return the model choice and finished prompts so they can be run elsewhere, and say that nothing was generated.
