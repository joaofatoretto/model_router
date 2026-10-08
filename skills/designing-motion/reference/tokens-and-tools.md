# Motion tokens and tools

Last checked: 2026-10-08.

## Default tokens (when the project has none)

These are IBM Carbon's motion tokens. They're a well-documented, sensible default. Say in your report that you used them, and suggest adopting or adjusting them in `DESIGN.md`.

| Duration token | Value | Typical use |
| --- | --- | --- |
| fast-01 | 70 ms | Micro-interactions: button press, toggle |
| fast-02 | 110 ms | Small fades, hover |
| moderate-01 | 150 ms | Small element changes, tooltips |
| moderate-02 | 240 ms | Dropdowns, expanding panels |
| slow-01 | 400 ms | Large panels, modals, page-level change |
| slow-02 | 700 ms | Expressive moments, large background changes |

| Easing | Productive | Expressive |
| --- | --- | --- |
| Standard (moving within view) | `cubic-bezier(0.2, 0, 0.38, 0.9)` | `cubic-bezier(0.4, 0.14, 0.3, 1)` |
| Entrance (decelerate) | `cubic-bezier(0, 0, 0.38, 0.9)` | `cubic-bezier(0, 0, 0.3, 1)` |
| Exit (accelerate) | `cubic-bezier(0.2, 0, 1, 0.9)` | `cubic-bezier(0.4, 0.14, 1, 1)` |

Use productive motion for task flows: button states, dropdowns, tables. Keep expressive motion for significant moments, such as opening a page, a primary action or a system alert. Scale duration up with the distance travelled and the size of the change.

## Choosing a medium

| Medium | Use for | Avoid for |
| --- | --- | --- |
| CSS transitions and keyframes, WAAPI | State changes, hover and press, simple enter and exit, scroll-driven animation (`animation-timeline`) | Complex sequenced timelines, physics |
| Motion (formerly Framer Motion) | React: layout animations, gestures, exit animations (`AnimatePresence`), springs, shared layout | Non-React projects |
| GSAP | Long or complex timelines, ScrollTrigger sequences, SVG morphing, framework-agnostic work | Simple state changes that CSS handles |
| View Transitions API | Page and route transitions, shared-element morphs between views | Animation inside a component |
| Lottie (dotLottie) | Designed vector animations that play: illustrations, animated icons, success states | Interactive or state-driven animation |
| Rive | Interactive animations with state machines, inputs and data binding | One-off simple transitions. Also note that authoring needs the Rive editor |
| Remotion | Motion graphics and anything rendered to video | Live UI |

Prefer what the project already uses. Adding a library needs a reason the existing tools can't cover.

## Related skills (use when installed)

- LottieFiles `motion-design`: motion direction, timing, easing and choreography principles, independent of the medium.
- `remotion-best-practices`: Remotion animation, timing, audio and captions.
- diffusionstudio `lottie`: generating Lottie animations from text with an agent.

## Verifying motion

- **CSS and WAAPI:** in Playwright, run `document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; })`, then screenshot at several values of `t`.
- **GSAP:** pause the timeline and call `.progress(p)` or `.seek(time)`.
- **Lottie:** `goToAndStop(frame, true)`. **Rive:** set the inputs, then let it advance and screenshot.
- **Reduced motion:** Playwright media emulation with `reducedMotion: 'reduce'`. Confirm the fallback appears and nothing large moves.
- **Performance:** check that only `transform` and `opacity` (and similarly cheap properties) are animated, and that Lottie and Rive file sizes are within budget.
