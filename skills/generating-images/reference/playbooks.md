# Image playbooks

Each section covers one kind of ask: which model strengths to look for (see [models.md](models.md)), what the prompt needs, and what to check.

## Contents
- Product shots
- Marketing and hero images
- Images inside UI and device mockups
- People and portraits
- Text in the image (posters, social cards, packaging)
- Editing: remove, replace, extend, restyle, upscale
- Transparent assets and cutouts
- Consistent sets and recurring characters
- Textures, patterns and backgrounds
- Illustration-style images
- Start frames for video

## Product shots

- **Look for:** photorealism and accurate materials. If you have a real product photo, use editing models instead, so the product stays exact.
- **Prompt:** the surface and backdrop, the product described exactly (material, finish, color as hex), the lighting setup ("soft three-point studio lighting", "hard sunlight, crisp shadows") and the camera angle. Say whether shadows and reflections should appear.
- **Real products:** pass the real photo as a reference and lock its shape, label and color ("keep the product identical: shape, label text, color").
- **Check:** the label text, the product's proportions against the real one, and that shadows are consistent with the light.

## Marketing and hero images

- **Look for:** aesthetics and composition. Use photorealism or a strong style model, depending on the look.
- **Prompt:** state the use and where copy will sit ("wide hero image, subject on the right third, calm negative space on the left for a headline"). Give the mood through lighting and color, not adjectives alone.
- **Check:** the negative space survives cropping to every breakpoint. Generate wider than needed if the image will be cropped responsively.

## Images inside UI and device mockups

- **Never generate the interface itself.** Generated UIs have fake text and broken components. Use real screens from Figma or the app.
- **Generate only around it:** a device-in-scene photo with a blank or green screen to composite into, or the photos and illustrations that appear inside the UI.
- **Prompt:** device model and angle, environment, and a "plain, evenly lit screen" for compositing.
- **Check:** the screen's perspective is clean enough to map a screenshot onto.

## People and portraits

- **Look for:** photorealism and identity consistency.
- **Prompt:** framing (head and shoulders, full body), gaze, pose, expression and interaction with objects. Ask for natural skin texture for realism, and avoid "studio" or "staged" wording if you want candid.
- **Rights:** don't generate real, identifiable people unless the brief says it's cleared.
- **Check:** hands, teeth, eyes, and accessories that merge into skin or clothing.

## Text in the image (posters, social cards, packaging)

- **Look for:** models rated for text rendering. Use a higher quality setting for small or dense text.
- **Prompt:** the exact text in quotes, the font style ("bold condensed sans-serif"), size relationships, color and placement. Ask for verbatim text with no extra characters.
- **Fallback:** for long or exact copy, generate the image without text and set the type in code or Figma. Real type is sharper and editable.
- **Check:** every character, letter by letter.

## Editing: remove, replace, extend, restyle, upscale

- **Look for:** models rated for editing and instruction-following, or dedicated tools for upscaling and background removal.
- **Prompt:** start with the operation as a verb ("Remove the person on the left", "Replace the sky with overcast clouds", "Extend the canvas 30% to the right"). Then list what must stay unchanged: subject, framing, colors, lighting, text.
- **Restyle:** "Recreate this exact content in the style of [style]", with a style reference if you have one.
- **Check:** compare against the original. Look for color shifts, changed faces or text, and seams at the edges of the edit. Some models shift colors over several editing rounds, so restart from the original rather than editing an edit many times.

## Transparent assets and cutouts

- **Look for:** models with a native transparent-background option, or generate on a plain contrasting background and run background removal.
- **Prompt:** "isolated subject, transparent background, no backdrop, no cast shadow" (or ask for a soft shadow if it's wanted).
- **Check:** edges and halos at 2x zoom, on both light and dark backgrounds. Save as PNG or WebP.

## Consistent sets and recurring characters

- **Look for:** multi-reference and identity-consistency strength.
- **Prompt:** write a fixed character or style block once (features, proportions, outfit, palette as hex, rendering style) and reuse it word for word in every prompt. Feed the best approved image back in as the reference anchor.
- **Workflow:** get one hero image approved first, then generate the rest from it.
- **Check:** view the whole set side by side. Any image that drifts in palette, line or proportion breaks the set.

## Textures, patterns and backgrounds

- **Prompt:** say "seamless tileable" for patterns, give the scale of the detail and the palette as hex values, and keep contrast low if text will sit on top.
- **Check:** tile the image 2x2 and look at the seams. Check text contrast on top of it.

## Illustration-style images

- **Prefer vector.** If the product needs editable, themeable or crisp illustrations, have the illustrator make SVG or Figma vectors.
- **Use generation for:** painterly or textured styles, or complex scenes that are impractical as vector. Follow the illustrator's style guide or art-direction brief when one exists.
- **Check:** the style matches the rest of the product's illustrations.

## Start frames for video

- **Format:** match the video's aspect ratio and resolution exactly (16:9 or 9:16).
- **Prompt:** compose for motion. Leave room in the direction the camera or subject will move, and avoid fine detail that video models tend to smear.
- **Consistency:** for several shots, generate all the start frames from the same character and style references before any video generation.
