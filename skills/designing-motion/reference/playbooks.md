# Motion playbooks

Each section covers one kind of motion: its job, typical timing and the medium, plus what to check.

## Contents
- Micro-interactions (hover, press, toggle, focus)
- Feedback states (loading, success, error)
- Enter and exit (modals, sheets, menus, toasts)
- Page and route transitions
- Lists, grids and staggers
- Scroll-driven motion
- Data and chart animation
- Lottie animations
- Rive interactive animations
- Motion graphics in Remotion
- A motion system (tokens and guidelines)

## Micro-interactions (hover, press, toggle, focus)

- **Job:** confirm that the input registered.
- **Timing:** productive and fast, around 70 to 150 ms. A press responds on press, not on release.
- **Medium:** CSS transitions.
- **Check:** feedback is instant, there's no layout shift, and focus states are visible without hover.

## Feedback states (loading, success, error)

- **Job:** show progress and outcome.
- **Timing:** delay spinners by about 300 to 500 ms, so fast operations don't flash one. A success confirmation reads, then gets out of the way. Errors draw attention without alarming, for example a short shake or a color change, never a strobe.
- **Medium:** CSS. Lottie or Rive for illustrated states.
- **Check:** each state is reachable, the change between states is smooth, and the reduced-motion version still communicates the state.

## Enter and exit (modals, sheets, menus, toasts)

- **Job:** show where the element came from and where it went.
- **Timing:** entering decelerates and takes a little longer. Exiting accelerates and runs faster, roughly 20 to 30 percent shorter. Animate from the trigger's direction or position where possible.
- **Medium:** CSS or Motion (`AnimatePresence` for React exits).
- **Check:** interrupting midway (open, then close at once) behaves cleanly, focus moves correctly, and the backdrop fades with the panel.

## Page and route transitions

- **Job:** keep orientation between views.
- **Timing:** short, with shared elements morphing between views where it helps.
- **Medium:** the View Transitions API where supported, or the framework's router transitions.
- **Check:** back and forward navigation, slow networks (the transition shouldn't wait for data), and reduced motion (crossfade or none).

## Lists, grids and staggers

- **Job:** show structure and draw the eye in reading order.
- **Timing:** small per-item delays, with the total sequence capped. Long lists animate only the first visible items, or animate as a group.
- **Medium:** Motion variants, GSAP stagger, or CSS with custom-property delays.
- **Check:** reordering and filtering animate positions smoothly (FLIP or layout animation), and nothing jumps.

## Scroll-driven motion

- **Job:** reveal or explain content as the user advances.
- **Timing:** tie the animation to scroll position, not time, so the user controls the pace.
- **Medium:** CSS scroll-driven animations (`animation-timeline: scroll()` / `view()`), or GSAP ScrollTrigger.
- **Check:** the motion never hijacks scrolling, content is readable with the motion off, mobile performance is acceptable, and reduced motion is respected.

## Data and chart animation

- **Job:** show change, from old values to new ones.
- **Timing:** moderate, with values interpolated from the previous state. Don't replay the whole chart on every update.
- **Medium:** the charting library's transitions.
- **Check:** final values are exact, and tooltips and labels are correct during and after the transition.

## Lottie animations

- **Job:** designed, illustrative motion that plays: empty states, onboarding, success moments, animated icons.
- **Build:** from an illustration structured for motion (named, separated layers), animated in code-generated Lottie JSON or After Effects. Use the dotLottie format (`.lottie`) for smaller files. Text-to-Lottie skills exist, such as diffusionstudio's, if one is installed.
- **Rules:**
  - keep it small, with a few dozen KB for UI pieces
  - avoid features players don't support well, such as expressions, many effects and huge path counts
  - set the loop or play-once explicitly
  - give it a static reduced-motion fallback frame
- **Check:** play it in the target player (dotlottie-web, lottie-web or native), seek to key frames, and compare file size against the budget.

## Rive interactive animations

- **Job:** animations that respond to input or data: interactive icons, toggles, characters, game-like UI.
- **Build:** Rive files are authored in the Rive editor, which an agent can't operate. Deliver two things:
  - a state-machine spec for the designer: the states, the inputs (boolean, number, trigger) or data-binding view model, and the transitions with their conditions
  - the runtime integration in code, wiring the inputs to app state
- **Check:** every input and transition from the spec is wired, the fallback works when the runtime fails to load, and reduced motion is handled.

## Motion graphics in Remotion

- **Job:** animated typography, logo reveals, UI showcases and transitions inside a video.
- **Build:** frame-based, using `interpolate` and `spring` with the frame. Never use CSS transitions, which don't render deterministically. Use the `remotion-best-practices` skill if it's installed.
- **Check:** render stills at key frames, and keep text on screen long enough to read twice.

## A motion system (tokens and guidelines)

- **Job:** consistent motion across the product.
- **Build:**
  - duration tokens (from fast to slow) and easing tokens (standard, entrance, exit, and expressive variants)
  - rules for productive and expressive use
  - a reduced-motion policy
  - three or four signature patterns with code
  - put the tokens where the design tokens live, and document them in `DESIGN.md`
- **Check:** apply the tokens to two or three existing interactions as a proof, and get the user's sign-off on the feel.
