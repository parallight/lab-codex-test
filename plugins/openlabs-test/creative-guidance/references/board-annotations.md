# Annotating a board like a good teacher (tb_annotate)

You add marks on top of an existing OpenLabs Canvas board: circles, underlines, highlights, boxes, strike-throughs, arrows and short handwritten side notes. The board's text and pictures already exist; you never move or rewrite them.

## How it works

You write a module `export default function annotate(board) { … }`. The board runs it in a sandbox against the real layout of the landed board and turns what you draw into native board strokes. You never need coordinates: you point at content by its words, and the board supplies the boxes.

In the lecture, each mark is drawn right after the paragraph (or shape) it points at has been written, in the board's hand. Marks stay on the board afterwards.

## The interface

| call | what it does |
| --- | --- |
| `board.find(text, { nth?, in? })` | the first place this text appears (case-insensitive, punctuation around words ignored; the first and last word may be partial: `"predict"` matches `predicts`). `nth` = the n-th occurrence, `in` = an element id. Returns a **hit** `{ id, text, box, lines, screen }` or `null` (reported as a miss). |
| `board.findAll(text)` | every occurrence |
| `board.element(idOrLabel)` | a whole element: a shape by its label (`"Observe"`), a code block, the scene |
| `board.elements`, `board.screens` | read-only: every element with its text, box (scene units), screen and order |
| `board.circle(hit, { color, pad })` | hand-drawn loop around the hit |
| `board.underline(hit, { color, wavy, double })` | under each line of the hit |
| `board.box(hit, { color, pad })` | hand-drawn rectangle |
| `board.strike(hit, { color })` | line through it (something wrong or superseded) |
| `board.highlight(hit, { color })` | marker behind the words (`yellow` default, also `green`, `blue`, `orange`, `red`, `violet`) |
| `board.arrow(from, to, { color })` | from one hit (or `{x, y}`) to another, edge to edge |
| `board.note(text, { near: hit, side, color, size })` | a short handwritten note beside a hit (`side`: right, left, above, below) |
| `board.pen(points, { color, width })` | free stroke, scene coordinates `[[x, y], …]` |
| `await board.beat(text, () => { …marks… })` | one beat of the explanation. **It happens the moment the last thing it points at has been written** (for English text: right after that word appears; for a shape: once it is drawn): the lecture holds still, draws the beat's marks, writes `text` on a small sticky note in the page margin with a dashed arrow to the first mark (note and arrow stay on the board, like a careful reader's margin notes), pauses for the reading time, then continues writing. The same lines are the script a voice-over will read later. |

Colors are palette names: `ink red orange yellow green blue violet`. `opts.after = "<element id>"` draws a mark after a different element than the one it points at (for example an arrow that should appear after its target paragraph).

## Teaching with marks

- **Few and exact.** One emphasis per idea; a page where everything is circled has nothing circled. Mark the words that carry the mechanism (the cause, the changed variable, the result), not decorative adjectives.
- **Match the device to the job.** Circle or box = "this is the thing"; underline = the key phrase in a sentence; highlight = terms to remember; arrow = cause → effect or "this refers to that"; strike = a wrong intuition you are correcting; a note = the question a learner should ask here ("why only 2?") or the one-line takeaway.
- **Same color = same idea.** If the bowl and its stale plan are red in the picture, mark the text about them red too. Use at most three colors on a page.
- **Do not cover text.** Notes go in empty space next to the line; keep arrows short and off the words.
- **Marks are what remains for review.** A learner coming back should be able to read the page's argument from the marks alone.

## Explaining with beats

A beat is what a teacher says while pointing: the marks are the pointing, the line is the sentence, kept on a sticky note in the margin for review. Without beats the marks just appear; with beats the lecture walks the learner through them.

- **One idea per beat**, about 8–16 words. If it needs "and then", it is two beats.
- **Say where to look and why, not what the board already says.** "Only the large dots run; the rest is thrown away" adds the consequence; reading the sentence aloud adds nothing.
- **Order = the argument.** Setup → the surprising fact → the cause → what to try. The last beat on a screen is the takeaway.
- **Every mark belongs to a beat**, and each beat has one to three marks. A beat with no mark is not shown.
- **The lecture only moves forward. Mark what is being written now**: a beat's circles, underlines and highlights go on the words that have just appeared (or the shape just drawn). Once the lecture has moved past something, do not circle, underline or highlight it again. To connect new content to something earlier, put the beat on the new content and draw an **arrow from it back** to the earlier words; arrows are the only marks that may point back. The checker reports beats that break this.
- **Write beats in reading order** (top to bottom as the page is written). A beat that points earlier than the beat before it is moved before it.
- **Write it to be heard**: plain words, no parentheses or symbols, so the same line works as a voice-over.

## How to call it

- Build the board first (`tb_create_board` / `tb_add_act`). Annotations are computed against the board as it is laid out, so call `tb_annotate({ boardId, source })` once those steps have landed. If the result says some steps have not landed yet, give the learner the board link, ask them to open it, and call again.
- `source` is the whole module as a string (at most 32 KB). It runs in a sandbox without network for at most 5 seconds; at most 80 marks and 40 beats.
- Calling it again replaces the previous annotations **on the screens this call marks**; the other screens keep theirs. So you can annotate one screen (or act) per call, and re-send a screen's complete set to fix it. Do not split one screen across calls.
- The result lists what was drawn, which anchors were not found (`misses`), which commands were rejected and what breaks the forward-only rule, and returns one screenshot per screen with the marks drawn. Open every screenshot and check each mark: on the right words, not covering text or other marks, readable at a glance. Fix the module and call again until the report is clean.
