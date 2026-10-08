# Video models

Last checked: 2026-10-08. Video models change fast and sources disagree on specs and prices. Always list what the connected tool offers, and check its model pages for current limits and costs. Confirm with a cheap test.

| Model | Good at | Notes |
| --- | --- | --- |
| Veo 3.1 (Google) | Realism, physics, native audio with dialogue and lip sync | 4, 6 or 8 second clips at 720p or 1080p (some sources report 4K), 16:9 or 9:16. Image-to-video, first and last frame, reference images ("ingredients"), timestamped segments. Standard, Fast and Lite tiers: use Fast or Lite for tests |
| Kling 3.0 (Kuaishou) | Human motion, stylized storytelling, value per second | Clips up to about 15 seconds. Audio optional by tier. Aggressive motion increases drift from references |
| Seedance 2.x (ByteDance) | Image-to-video, product and commercial shots, reference-heavy scenes | First and last frame. 2.5 is reported to take many references and longer clips. Output tops out around 2K |
| Runway Gen-4.5 | Editing and VFX workflows around generation | Short clips (5 to 10 seconds). No audio through the API |
| Hailuo 2.3 (MiniMax) | Cheap, fast drafts | 6 to 10 second clips at 1080p, no audio. Older than the others |
| Sora 2 (OpenAI) | — | Reported shut down, with API access ending September 2026. Don't plan around it |

## Picking quickly

- Dialogue or synced sound: Veo 3.1.
- Animating an approved still or a product: Seedance or Veo image-to-video.
- Longer or motion-heavy human shots: Kling.
- Loops and transitions: any model with first and last frame input.
- Tests: the cheapest tier available, at short length and low resolution.
