---
name: designing-motion
description: Designs and builds purposeful motion (UI micro-interactions and transitions in CSS, Motion/Framer Motion or GSAP; Lottie and Rive animations; Remotion motion graphics; motion systems and tokens), with a motion spec first, timing and easing chosen by purpose, accessibility and reduced motion, and frame-by-frame verification. Use when an interface, illustration or video needs animation, or a product needs a motion language.
---

# Designing motion

Motion earns its place by doing a job: giving feedback, showing where something came from or went, directing attention, or expressing the brand at a key moment. Motion with no job is decoration that slows users down. Decide the job first, write the spec, then build it and check it frame by frame.

## 1. Intake

You need these before building. Take what the brief, `DESIGN.md` and the existing code (motion tokens, animation libraries already in use) answer, and ask only for the rest:

- **What moves and why:** the element, the trigger (load, hover, press, state change, scroll, route change, time), and the job it does.
- **Personality:** productive (quick, subtle, for task flows) or expressive (vivid, for key moments and brand), and any references.
- **Medium and runtime:** CSS or WAAPI, Motion (Framer Motion), GSAP, Lottie, Rive or Remotion. Use what the project already has unless there's a reason not to.
- **Platforms and budget:** devices to support, performance limits, and file-size limits for Lottie and Rive.
- **Accessibility:** what happens under reduced motion, and whether anything plays automatically.
- **Deliverable:** code in the project, a `.lottie` or JSON file, a Rive state-machine spec plus runtime integration, a Remotion composition, or a motion-token system.

If you're a subagent and an essential is missing, don't guess. Return the questions (see "Needs input" below). Essentials are what moves, its trigger and its job, plus the medium.

## 2. Choose the medium

Use `${CLAUDE_SKILL_DIR}/reference/tokens-and-tools.md`. In short:
- **CSS or WAAPI** for simple transitions.
- **Motion** for React layout, gesture and exit animations.
- **GSAP** for complex timelines and scroll-driven sequences.
- **Lottie** for designed vector animations that play.
- **Rive** for interactive animations with states and inputs.
- **Remotion** for video.

## 3. Write the motion spec first

For each animation, write down:
- the trigger and the job
- each element, with the properties that change, from-to values, duration, easing, delay and order
- what happens if it's interrupted (reversed midway, triggered again)
- the reduced-motion version

Use the project's motion tokens if they exist. If not, use the defaults in tokens-and-tools.md and say so. `${CLAUDE_SKILL_DIR}/reference/playbooks.md` has notes for each kind of motion.

These rules apply everywhere:
- **Duration scales with distance and size.** Small, productive changes take about 70 to 240 ms. Large or expressive moments take about 240 to 700 ms. Anything longer needs a reason.
- **Easing:** decelerate for things entering, accelerate for things leaving, and a standard curve for things moving within view. Springs suit gestures and interruptible motion.
- **Choreography:** related elements move together or with a short stagger. Keep the whole sequence brief, and lead with the most important element.
- **Animate `transform` and `opacity`.** Avoid animating layout properties (`width`, `height`, `top`, `left`) and expensive filters.
- **Keep it interruptible.** Animations reverse or retarget smoothly rather than finishing first.

## 4. Accessibility

- Respect `prefers-reduced-motion`. Replace movement, scaling, parallax and zoom with a fade or an instant change, and keep the information the motion carried.
- Anything that moves, blinks or scrolls automatically for more than 5 seconds needs a way to pause, stop or hide it (WCAG 2.2.2).
- Nothing flashes more than three times per second (WCAG 2.3.1).
- Motion must never be the only way information is conveyed.

## 5. Build and verify

- Build it in the chosen medium, following the project's existing patterns.
- Check timing, not just end states:
  - **Web:** use Playwright to pause and seek with `document.getAnimations()` (for CSS and WAAPI), or the library's own seek, such as a GSAP timeline or Lottie's `goToAndStop`. Screenshot the key moments: start, middle, end.
  - **Remotion:** render stills at key frames.
- Check reduced motion with Playwright's media emulation (`prefers-reduced-motion: reduce`).
- Check performance: no layout properties animated, smooth playback, and Lottie and Rive file sizes within budget.

## Report

Give the motion spec, the files changed or created, and how you verified it, with frame or screenshot paths. Then describe the reduced-motion behavior, add performance notes, and list anything you couldn't check. Some things, such as how motion feels at full speed, a person has to judge: say so, and give the URL or command to see it.

**Needs input:** when essentials are missing, return only a numbered list of questions, each with two to four suggested answers and the one you recommend first.
