# Image models

Last checked: 2026-10-08. The landscape changes every few months. Always list the models the connected tool actually offers, and check its own model pages for current names, prices and limits. Strengths below come from vendor documentation and third-party comparisons that often disagree, so treat them as a starting point and confirm with a test round.

| Model | Good at | Notes |
| --- | --- | --- |
| GPT Image 2 (OpenAI) | Text in images, precise instruction-following, controlled photorealism, UI-adjacent and commercial work | Native transparent background (PNG/WebP). Custom sizes up to 3840px on the long edge. `low` quality for drafts, `medium`/`high` for small text or finals. `gpt-image-1-mini` is the cheap draft option |
| Nano Banana Pro (Gemini 3 Pro Image) | Editing, photorealism, combining many references (up to 14), conversational refinement | Prompts in natural sentences, not tags. Can shift colors over repeated edit rounds |
| Nano Banana 2 (Gemini 3.1 Flash Image) | Fast and cheaper. Identity and character consistency | Adds extreme aspect ratios (1:4, 4:1, 1:8, 8:1) and 512px drafts |
| FLUX.2 / FLUX 3 (Black Forest Labs) | Materials, lighting, typography, exact brand colors via hex, structured JSON prompts | Open weights for some variants. Ignores negative prompts, so describe what you want. JSON prompts suit complex, repeatable scenes |
| Ideogram 4.0 | Text and typography-heavy designs (posters, logos-as-type) | Open weights |
| Seedream 5.0 (ByteDance) | Editing quality, close to the top on edit benchmarks | Less independent coverage |
| Imagen 4 (Google) | Photorealism | Sparse recent coverage. Prefer Nano Banana when both are available |
| Midjourney V8.x | Aesthetics and stylization | No public API, so an agent usually can't use it. Write prompts for the user to run instead |

## Picking quickly

- Exact text in the image: GPT Image 2 or Ideogram, otherwise set the type yourself afterwards.
- Edit a real photo while preserving it: Nano Banana Pro, GPT Image 2 or Seedream.
- A consistent character or a set: Nano Banana 2 or Pro with references. GPT Image 2 when the character interacts with text.
- Exact brand colors: FLUX with hex values.
- Transparent asset: GPT Image 2 with a transparent background, or any model plus background removal.
- Cheap exploration: the tool's fast or mini tier, then the final on the best fit.
