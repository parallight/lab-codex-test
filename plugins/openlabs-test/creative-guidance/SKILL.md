---
name: manim-explanatory-craft
description: Create explanations where motion reveals a mechanism or relationship — as an interactive scene on an OpenLabs Canvas board (manim-web, the default) or as a standalone Manim video. Use before writing any storyboard, scene or animation code; preserve freedom of visual form.
---

Guide version: 0.3.2.

## Where the animation lives

Pick the surface from what the learner asked for, not from habit:

- **On a board (default).** When the explanation belongs on an OpenLabs Canvas board, write a `scene` item: your own manim-web code, running in a sandbox, borderless and transparent so it reads as drawn on the board. The lecture plays it when it is reached and waits for it to finish; the progress bar, pause and › control it like the rest of the page, so all its timing goes through `ctx`; afterwards the learner can keep operating it. Read [the canvas scene contract](references/canvas-scene-contract.md) and the [worked example](references/torque.scene.js) before writing one.
- **A standalone video file.** Only when the learner asks for a file to play or share locally. Use the host's own file and command tools with Manim Community; check that a renderer exists first; if none can run, deliver the source and say plainly that it was not rendered.
- **An existing lesson card.** Follow the Card Film workflow and its own guide for format, preview and finalize; this guide still decides how to explain.

Record the guide version and the renderer (`manim-web@<version>` or `Manim Community <version>`) in a comment at the top of the source.

## How to explain

Use animation to make the learner able to predict a change, not merely recognize vocabulary. Choose visual devices suited to the mechanism; these are principles, not a mandatory layout or fixed storyboard.

Before coding, identify one causal question and the minimum visible evidence that answers it. Distinguish the physical or computational state from its annotation. A label changing from "before" to "after" is not a substitute for showing what moved, transformed, accumulated, or was replaced.

Keep important objects identifiable across time. Transform or move the same object when it represents the same entity. Introduce visual identity using both a stable color and a label or shape; reuse it in diagrams, quantities and traces. Reserve emphasis for the currently relevant change.

Let viewers see a concrete event before concluding with a rule. When helpful, let them anticipate an outcome, show the consequence, then summarize the reason. A brief counterfactual with one changed variable can establish causality better than a longer list of statements. Do not force this structure onto a task that benefits from another explanation.

When showing two representations of one process, derive both from the same state variable or computed event trace. For algorithms, compute state transitions first, then animate those transitions. Do not independently hardcode a plot, a number and a diagram that can silently contradict each other. Interpolation for readability is not a new simulated measurement. (In manim-web on the board: one `apply(state)` rebuilds every dependent mark; see the contract.)

Connect the concrete scene to the abstraction: a geometric measurement, a numerical value, an execution trace or an equation should visibly refer to the object it describes. Draw an arrow only when direction, force, transfer or dependency is meaningful. Avoid decorating slides with arbitrary pulses and moving dots.

Manage attention and reading time. Establish a stable spatial frame; leave room for dynamic labels and extremes of motion. Prefer short local annotations and a concise concluding claim over paragraphs inside the animation. On a board, a sentence that narrates (what is happening, what to notice) is a subtitle line through `ctx.say`, not text drawn in the picture; it is also the script a later voice-over reads. Use pauses at consequential state changes. Parallel motion is useful for controlled comparisons, but unrelated movement competes for attention. Keep fonts legible at the embedded size.

Check the semantic boundary: distinguish real physical laws, simplified teaching models, measured results and hypothetical disturbances. Illustrations of neural networks or robots must not imply an actual model or hardware execution. Show uncertainty or limits where they affect the claim.

## Text, scene and experiment on one screen

On a board, one act reads like one page. Use `layout:"paper"` (a single centered column, like a conference paper) when the page has a few paragraphs; use `layout:"screen"` (text left, visual right) for a short guide next to one visual. Both have a fixed width and any height: in lecture mode the camera keeps the line being written near the middle of the screen and moves down with it. The text guides (what to watch, what to predict first, what follows from it), the scene shows the mechanism, and a code block (its run output appears on its right in `paper`) or an interactive control lets the learner verify it. Keep the text short and necessary so the page works without narration; do not repeat in text what the scene already shows.

## Before delivery

Inspect the rendered beginning, transitions and ending. Check object persistence, label collisions, clipping, numerical consistency and whether the conclusion follows from the visible evidence. A render that completes is not proof of an explanation that works. For a board scene, also try the hand-over: drag the control to its extremes and confirm every mark and number follows.

Reference analysis in references/source-notes.md documents the inspected code and provenance. No dependency on those repositories or external assets is required. Do not copy their implementations; create a scene appropriate to the user's task.
