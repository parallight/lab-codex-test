# Canvas scene contract (scene protocol v1, guide 0.3.2)

A board scene is a `scene` item in a BoardSpec act. The board stores your source, runs it in a sandboxed iframe and hands it a `ctx`. Nothing else is available: no network, no imports, no other scripts.

```json
{ "kind": "scene", "id": "torque", "title": "Why the angle of the push changes the torque",
  "source": "export default async function play(ctx) { … }",
  "size": "wide", "aspect": "16:9", "autoplay": true }
```

- `title` (required): one sentence saying what the scene explains. Screen readers and agents reading the board see it; it is not drawn.
- `size`: `half` 720, `wide` 960 (default), `full` 1440 board units wide. `aspect`: `16:9` (default), `4:3`, `1:1`.
- `lib`: optional; today only `manim-web@0.40.1`. The board refuses anything not on its list.
- `source` ≤ 64 KB, must `export default` the entry function, must not contain `import` lines.

## ctx

| field | what it is |
| --- | --- |
| `ctx.M` | every manim-web export: `Line`, `Arrow`, `Circle`, `Arc`, `Rectangle`, `Dot`, `Text`, `MathTex`, `Axes`, `FunctionGraph`, `ValueTracker`, `MovablePoint`, `Slider`, `Create`, `FadeIn`, `Transform`, … |
| `ctx.scene` | a ready scene, transparent, sized to the block. World coordinates: height 8, width = 8 × aspect (14.2 for 16:9), origin at the centre. |
| `ctx.frame` | `{ width, height }` in world units |
| `ctx.palette` | the board's colors: `ink`, `muted`, `line`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `violet`, `pink`, and light fills `wash.{blue,green,orange,violet,red}` |
| `ctx.font.hand` | the board's handwriting font; use it for every `Text` so the scene reads as written on the board |
| `ctx.wait(ms)` | pause |
| `ctx.tween(ms, (t) => { … }, ease?)` | calls your function every frame with `t` from 0 to 1 (ease-in-out by default), then repaints |
| `ctx.render()` | repaint now (drag callbacks) |
| `ctx.say(text)` | the subtitle: the board writes it in its own handwriting (English Parallight - Whiteboard, Chinese Parallight - 行楷) in a band under the scene; `ctx.say("")` clears it. It is the script a voice-over will read later, so `await ctx.say(...)` (today it returns at once; with a voice it will wait for the line) |
| `ctx.report(obj)` | send the learner's current state to the board (≤ 16 KB JSON); the board's agent can read it |
| `ctx.interactive()` | call before returning if the learner should keep operating the scene; the board then lets the pointer into it |

`play` returning means the explanation is over; the lecture then writes the next step. Replay runs `play` again on a fresh scene, so build everything inside `play`.

## The pattern that works

1. **One state value, one `apply(state)`.** Keep the explanation's state in plain variables (an angle, a step index, a learning rate). `apply` removes the marks that depend on it and builds them again from the state, then the runtime repaints. Every number, arrow and plot comes from the same state, so they cannot disagree.
2. **Animate the state, not the marks.** `await ctx.tween(1500, (k) => { theta = from + (to - from) * k; apply(theta); })`.
3. **Static parts with `scene.play`.** `Create`, `FadeIn`, `Write`, `Transform` on objects that do not depend on the state work normally.
4. **Hand over.** After the intro, add a `MovablePoint` (constrain it to a line, segment or curve) or a `Slider`; in its `onChange`, update the state, `apply`, `ctx.render()`, `ctx.report({...})`. Then `ctx.interactive()`.

**Narration goes in `ctx.say`, labels stay in the picture.** A sentence about what is happening now or what to notice ("the bowl is nudged; the plan does not know yet") is a subtitle line: say it, do not draw it as `Text`. Names attached to things (axis names, "bowl", "k", a value next to its bar) stay as `Text` in the scene. One short line at a time (about 12 words), said when the change it describes starts; calling `say` with the same text again does nothing, so it is safe inside `apply`. The board leaves a band for subtitles under any scene whose source calls `say`; the scene's world coordinates are unchanged.

**Movable points are marked for you.** The board draws a breathing ring around every `MovablePoint` until the learner first drags it (a quiet ring stays afterwards) and shows a grab cursor on hover; in lecture mode and on `/app` boards the learner can drag without clicking the scene first. Do not draw your own hint rings or pulsing dots. Do keep the interaction meaningful: dragging should change the mechanism the scene explains (pick a parameter, scrub time, move the object that matters), and a short label nearby can say what dragging does.

**Time goes only through `ctx`.** The lecture's progress bar can stop the scene at any instant, › shows its end state, and pause / play pause and continue it. The board does this by replaying `play` on a fresh scene and fast-forwarding to that instant, so:

- wait with `ctx.wait` (or `scene.wait`), animate with `ctx.tween` or `scene.play`; do not time anything with `setTimeout`, `requestAnimationFrame` or `Date.now`;
- a `ctx.tween` callback computes the state from `t` alone (when fast-forwarding past it the board calls it once with `t = 1`), never adds to what the previous frame did;
- `Math.random` is seeded the same way on every run, so random layouts come out the same each time.

Before the lecture starts, the board runs your `play` once out of sight to measure its length; errors show up then too.

**Do not rely on `alwaysRedraw` or `addUpdater` to keep marks in sync.** In manim-web 0.40.x they rebuild internally but the picture does not change, and `scene.render()` does not run them at all. The rebuild-in-`apply` pattern above is the one verified on the board.

## Looking drawn on the board

- No background, frame, panel or title bar. The scene is transparent; the board's dot grid shows through.
- `ctx.font.hand` for text, `ctx.palette` for color. Draw for the light theme only; the board converts the whole scene for dark theme the same way it converts handwriting.
- Leave margins: keep content inside about 90 % of the frame, and room for labels at the extremes of motion.
- 10–40 seconds, one mechanism. Pause briefly at the state changes that matter.

## Example

[torque.scene.js](torque.scene.js): one angle drives the force arrow, its perpendicular part, the readout and the torque bar; the intro sweeps 30° → 90° → 0° → 60°; the learner then drags the force tip and the board receives `{ thetaDeg, torque }`.
