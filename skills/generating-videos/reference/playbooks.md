# Video playbooks

Each section covers one kind of shot: which model strengths to look for (see [models.md](models.md)), what the prompt needs, and what to check.

## Contents
- B-roll and atmosphere
- Product in motion
- Animating a still image
- Transitions between two frames
- Characters and dialogue
- Seamless loops (backgrounds, website heroes)
- Vertical social clips
- Multi-shot sequences

## B-roll and atmosphere

- **Look for:** realism and good physics. Cheap tiers are fine for tests.
- **Prompt:** one setting, one gentle motion (drifting fog, a slow pan over a desk, light shifting across a wall), and the grade. Add ambient sound only if the edit wants it.
- **Check:** motion that looks natural and stays slow enough to cut anywhere.

## Product in motion

- **Look for:** image-to-video with strong reference adherence, so the product stays exact.
- **Start from:** an approved product image, or the real photo.
- **Prompt:** "Slow 90-degree orbit around the product, studio lighting, seamless backdrop". Lock the product ("the product's shape, label and color stay exactly the same").
- **Check:** the label and proportions frame by frame, since products warp mid-orbit. Shorter clips drift less.

## Animating a still image

- **Look for:** image-to-video.
- **Prompt:** describe only the motion and the camera. The image already defines the content. Keep the motion subtle for illustrations and UI-like images.
- **Check:** the first frame matches the still, and details such as text and faces don't melt.

## Transitions between two frames

- **Look for:** models with first and last frame input.
- **Prompt:** describe the camera path or transformation between the two frames ("smooth 180-degree arc from the front view to behind the subject").
- **Check:** the path is believable, with nothing popping in at the midpoint.

## Characters and dialogue

- **Look for:** native audio with lip sync for dialogue, and reference images for character consistency.
- **Prompt:** the character from a fixed description or reference image, one action, and the line in quotes with who says it and how. Add `SFX` and `Ambient noise` lines.
- **Rights:** no real people's likenesses or voices unless cleared.
- **Check:** lip sync, a consistent face from start to end, and audio quality.

## Seamless loops (backgrounds, website heroes)

- **Look for:** first and last frame input. Use the same image for both to close the loop.
- **Prompt:** slow, continuous, cyclical motion (waves, drifting particles, a gradient flow) with no camera cuts.
- **Check:** play the clip on repeat and watch the seam. For website use, check file size after compression and that text placed on top stays readable. Consider a Remotion or CSS animation instead for abstract loops.

## Vertical social clips

- **Format:** generate at 9:16 natively rather than cropping from 16:9.
- **Prompt:** keep the subject centered and in the middle two thirds, clear of the platform's top and bottom UI.
- **Check:** the safe areas, and that the first second hooks attention.

## Multi-shot sequences

- **Plan:** a shot list, with each shot as its own generation. Never ask one generation for several shots.
- **Consistency:** shared start frames and references, plus a style block reused word for word (see the main skill).
- **Check:** view the shots in order, and look at the cuts for jumps in lighting, grade or character.
