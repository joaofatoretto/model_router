# Illustration playbooks

Each section covers one kind of illustration: the usual route, the style essentials and what to check.

## Contents
- Icons and icon sets
- Spot and empty-state illustrations
- Hero and marketing illustrations
- Characters and mascots
- Explanatory graphics (how-it-works, diagrams, infographics)
- Patterns and backgrounds
- Logos and marks
- Illustrations that will be animated
- From a sketch or raster to vector

## Icons and icon sets

- **Route:** draw directly. Generated icons rarely sit on a grid.
- **Style essentials:** a fixed canvas (usually 24px) with padding, and keylines for circles, squares and portrait or landscape rectangles, so shapes look the same size. Use one stroke weight (often 1.5 or 2px) with consistent caps and joins, and a consistent corner radius. Align to whole or half pixels for crisp rendering.
- **Variants:** if the system has outline and filled styles or several sizes, draw each size rather than scaling it.
- **Check:** view the full set in a grid at 1x. Optical weights should match, so no icon looks bolder or smaller than the rest. Check that each icon reads without its label.

## Spot and empty-state illustrations

- **Route:** draw directly, or generate vectors for richer styles.
- **Style essentials:** a simple composition with one idea and few elements. Leave room for the text that sits beside it, and keep the colors muted enough not to compete with the primary action.
- **Check:** at the real size in the UI, next to its copy, on both light and dark themes.

## Hero and marketing illustrations

- **Route:** generate vectors, or a raster concept and then a redraw, for complex scenes. Draw directly for geometric styles.
- **Style essentials:** composition built for the layout, with negative space for headlines and a defined crop at each breakpoint. More detail is fine at large sizes.
- **Check:** the crops at every breakpoint, and the file size. Split very complex scenes into layers, or deliver a simplified mobile version.

## Characters and mascots

- **Route:** design the character once, as a turnaround and an expression sheet, then reuse its parts.
- **Style essentials:** fixed proportions (head-to-body ratio), a limited palette, and signature features that survive small sizes. Build it as components or symbols, so poses reuse the same parts.
- **Check:** the character is recognizable at the smallest size, and consistent across poses and expressions.

## Explanatory graphics (how-it-works, diagrams, infographics)

- **Route:** draw directly. Accuracy matters more than style.
- **Style essentials:** a clear reading order, consistent arrows and connectors, and labels as real text rather than outlined text where the content must stay editable or translatable.
- **Check:** the content is correct, the labels are legible at size, and the meaning doesn't depend on color alone.

## Patterns and backgrounds

- **Route:** draw directly as a repeating tile, or generate vectors and then make them tile.
- **Style essentials:** a seamless tile with the scale set relative to the UI, and low contrast where text sits on top.
- **Check:** tile it 3x3 and look for seams. Check text contrast on top, and the rendering cost of very large patterns.

## Logos and marks

- **Route:** explore directions only. A final logo is the user's decision and usually needs a type designer's eye.
- **Rights:** never imitate existing logos or trademarks. Generated marks may resemble existing ones, so flag that risk.
- **Check:** the mark at 16px and at large sizes, in one color, reversed, and against busy backgrounds.

## Illustrations that will be animated

- **Route:** draw directly, structured for motion from the start.
- **Structure:** separate, named groups for every part that moves, with sensible pivot points. Shapes should be complete under overlapping parts, so nothing shows a hole when it moves. Keep IDs stable, and don't let the optimizer merge or rename them.
- **Handoff:** list each layer and the motion it's intended for, so the motion designer can animate it in CSS, Lottie or Rive.

## From a sketch or raster to vector

- **Route:** trace with a vectorizer (see vector-tools.md), then clean up. Simplify paths, snap them to the style's geometry, and recolor to the palette.
- **Expect to redraw:** traces of painterly or photographic sources produce thousands of shapes. Use the trace as a guide, and rebuild the main shapes by hand.
- **Check:** node count and file size against the original intent, and the style against the set.
