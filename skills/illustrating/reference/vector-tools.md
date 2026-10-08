# Vector tools and techniques

Last checked: 2026-10-08. Tools and models change. Check what the session actually has connected or installed before planning around any of these.

## Contents
- AI vector generation
- Tracing a raster into vectors
- Clean SVG
- Figma vectors
- Rendering and checking

## AI vector generation

| Tool | Output | Notes |
| --- | --- | --- |
| Recraft V4.x Vector (Recraft API, or fal as `recraft/v4.1/text-to-vector`) | Editable SVG with layers | Good for icons, logos and illustration systems. Restyle the output to the system palette afterwards |
| QuiverAI Arrow 1.x | SVG built from primitives (shapes, text) rather than only paths | Has text-to-SVG and vectorize endpoints. Vendor claims are unverified |

Generated SVGs need cleanup: merge redundant shapes, remove hidden ones, map colors to tokens, and check the `viewBox`.

## Tracing a raster into vectors

| Tool | Type | Notes |
| --- | --- | --- |
| VTracer | Open source, local (`pip install vtracer`, `cargo install vtracer` or an npm WASM build) | Handles color. Modes: pixel, polygon or spline. Tune color precision, corner threshold and speckle filter. Free and deterministic |
| Potrace | Open source, local | Black and white only. Clean curves for line art and logos |
| Recraft Vectorize (API, also on fal) | Hosted, about $0.01 per image | Clean, compact shapes. Download the results promptly, because hosted outputs expire |

Trace at the highest resolution available, on a flat background. Use spline mode for organic art, and polygon mode for geometric art.

## Clean SVG

- Use a `viewBox`, with no fixed `width` or `height` unless the brief asks for them.
- Theme colors through `currentColor` (for single-color icons) or CSS custom properties (`fill="var(--illustration-accent)"`). Hardcode hex values only for fixed brand art.
- Strokes: keep them as strokes for icons that must stay editable, or outline them for complex art that scales unevenly. For UI icons that resize, use `vector-effect="non-scaling-stroke"` only where a constant stroke is wanted.
- Accessibility: informative art gets `role="img"` with a `<title>` (and `aria-labelledby` when inline). Decorative art gets `aria-hidden="true"` and `focusable="false"`.
- Optimize with SVGO. Keep the `viewBox` and any IDs or classes needed for animation or theming, and check the output still renders the same.
- Avoid embedded raster images, heavy filters and blurs (slow to render), and text that should be translatable but has been outlined.

## Figma vectors

Through the figma-console MCP:
- Create or edit vectors with the Figma plugin API in `figma_execute`.
- Read styles and variables to apply system colors.
- Use `figma_take_screenshot` to check the result.

To get an SVG into Figma, import it as a node with the plugin API's SVG import, then bind its fills to variables. Name the layers, group them by part, and turn reusable pieces into components. For handoff, set export settings (SVG, plus PNG at 1x and 2x if needed).

## Rendering and checking

- Open the SVG in the browser with Playwright, at its real size and at 2x, on light and dark backgrounds, and screenshot it.
- Or render it from the command line with `rsvg-convert` or `resvg`, if they're installed.
- For sets, build a contact sheet (a simple HTML grid of all the pieces), screenshot it, and compare the pieces side by side.
