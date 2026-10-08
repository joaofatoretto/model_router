---
name: illustrating
description: Creates vector illustrations (icons, spot and empty-state art, heroes, characters, explanatory graphics, patterns, illustration sets) as clean SVG or Figma vectors, by drawing them directly, generating them with an AI vector model, or tracing and redrawing a raster concept. Also covers style guides and critique. The deliverable is always vector. Use when asked for an illustration, icon, set or illustration style.
---

# Illustrating

An illustration belongs to its product: one consistent style, built from the product's colors and shapes, simple enough to read at the size it's used, and delivered as clean, editable vectors. A raster image can be a step on the way, as a concept or a tracing source, but never the deliverable.

## 1. Intake

You need these before drawing. Take what the brief, `DESIGN.md` and the existing illustrations already answer, and ask only for the rest:

- **Purpose and placement:** where it appears (empty state, onboarding, marketing hero, icon set, docs), at what sizes, and on which backgrounds (light, dark or both).
- **Single piece or set:** if it's a set, which pieces it includes, and whether a style already exists to follow.
- **Style:** references, existing illustrations to match, level of detail, line or fill, and mood.
- **Color and theming:** palette from the design system, and whether colors must follow the theme (`currentColor`, CSS variables) or stay fixed.
- **Output:** SVG files, inline SVG in code, or Figma components. Note whether it will be animated later, because animation needs separate, named layers.
- **Meaning:** whether it's decorative or carries information, which determines its alt text.
- **Generation budget:** if AI vector models or raster concepts will be used, how many attempts.

If you're a subagent and an essential is missing, don't guess. Return the questions (see "Needs input" below). Essentials are purpose, sizes and style source.

## 2. Choose the route

Pick the cheapest route that produces clean, on-style vectors:

- **Draw directly** (SVG code or Figma vectors): icons, geometric or flat illustrations, diagrams, and anything that must follow a strict grid or match an existing set exactly. This is the default.
- **Generate vectors** with an AI vector model, when the connected tool offers one: richer illustrative styles that are slow to draw by hand. Always clean up and restyle the result to the system palette.
- **Concept, then vectorize:** for complex or painterly scenes, get a raster concept first (from the image-generation route), trace it, then redraw or simplify. The trace is a starting point. Expect to rebuild shapes by hand.

`${CLAUDE_SKILL_DIR}/reference/vector-tools.md` lists the vector models, tracing tools and SVG and Figma techniques. `${CLAUDE_SKILL_DIR}/reference/playbooks.md` has notes per kind of illustration.

## 3. Style before pieces

For a set, or a product with no illustration style yet, write the style rules before drawing anything:
- grid and canvas size, stroke weight and caps, corner radius
- fill or line approach, and shading (none, flat tones or gradients)
- palette as tokens or hex values, perspective, level of detail, and how people and objects are drawn

Draw one hero piece in that style and get it approved before doing the rest. Every later piece is checked against the hero.

## 4. Make it

- Work at the real display size, then check it at 2x and at the smallest size it will appear.
- Keep the vectors clean:
  - use a `viewBox` with no fixed width or height
  - keep paths minimal, with no stray points, hidden layers or empty groups
  - name layers and groups meaningfully
  - use no embedded raster images
- Use system colors only, through `currentColor` or CSS variables where it must follow the theme.
- Render what you made (open the SVG in the browser, or screenshot the Figma frame) and look at it. Fix whatever doesn't read at size.

## 5. Check and deliver

- **Readability:** the silhouette reads at the smallest size, and nothing important is lost on dark backgrounds.
- **Consistency:** put the whole set side by side and check stroke, corners, palette, perspective and detail level against the hero.
- **Technical:**
  - SVGO-optimized, with the `viewBox` kept, and IDs kept if the art will be animated
  - accessible: `role="img"` with a `<title>` for informative art, `aria-hidden="true"` for decorative art
  - a sensible file size
- **Figma:** components named consistently, vectors flattened only where editing won't be needed, and export settings set.

## Report

For each piece, give the file path or Figma link, a screenshot path, its sizes and its theming approach. Then give the style rules used, any inconsistencies left in the set, the generations used if any, and the route taken.

**Needs input:** when essentials are missing, return only a numbered list of questions, each with two to four suggested answers and the one you recommend first.

**Needs a concept:** if a piece needs a raster concept you can't produce, return a short image brief (subject, composition, style, aspect ratio) for the image-generation route, and continue once the image is provided.
