// Scene: why the angle of the push matters (torque = r·F·sin θ).
// Guide: manim-explanatory-craft 0.2.0 · lib: manim-web@0.40.1 · protocol: scene v1
// One state value (theta) drives every mark. apply(theta) rebuilds the marks that depend on it;
// ctx.tween animates theta; after the intro the learner drags the orange dot.
export default async function play(ctx) {
  const { M, scene, palette: P, font } = ctx;
  const { Line, Arrow, Circle, Arc, Text, Rectangle, Dot, MovablePoint, FadeIn, Create } = M;

  const R = 0.3, F = 100;                       // teaching numbers: metres, newtons
  const B = [-4.6, -0.9, 0], H = [0.4, -0.9, 0]; // bolt, hand
  const L = 2.4;                                 // drawn length of the force arrow
  const tip = (t) => [H[0] + L * Math.cos(t), H[1] + L * Math.sin(t), 0];
  const deg = (t) => Math.round((t * 180) / Math.PI);
  const torque = (t) => R * F * Math.sin(t);

  // Static frame: bolt, wrench, question.
  const title = new Text({ text: "Same 100 N push. Why does the angle matter?", fontSize: 30, color: P.ink, fontFamily: font.hand }).moveTo([0, 3.3, 0]);
  const bolt = new Circle({ radius: 0.34, color: P.ink, strokeWidth: 5, center: B });
  const wrench = new Line({ start: B, end: H, color: P.ink, strokeWidth: 10 });
  const barFrame = new Rectangle({ width: 5, height: 0.3, color: P.muted, strokeWidth: 2, fillOpacity: 0, center: [3.1, -3.2, 0] });
  const barLabel = new Text({ text: "torque", fontSize: 22, color: P.violet, fontFamily: font.hand }).moveTo([-0.1, -3.2, 0]);
  await scene.play(new FadeIn(title));
  await scene.play(new Create(bolt), new Create(wrench));
  scene.add(barFrame, barLabel);

  // Marks derived from theta. Rebuilt on every change, so geometry and numbers never disagree.
  let marks = [];
  const apply = (t) => {
    if (marks.length) scene.remove(...marks);
    const perpTip = [H[0], H[1] + L * Math.sin(t), 0];
    const w = Math.max(0.02, 5 * Math.abs(Math.sin(t)));
    marks = [
      new Line({ start: tip(t), end: perpTip, color: P.line, strokeWidth: 2 }),
      new Arc({ radius: 0.7, startAngle: 0, angle: Math.max(0.01, t), color: P.muted, strokeWidth: 3, center: H }),
      new Arrow({ start: H, end: perpTip, color: P.green, strokeWidth: 6 }),
      new Arrow({ start: H, end: tip(t), color: P.orange, strokeWidth: 6 }),
      new Text({ text: `θ = ${deg(t)}°    τ = r·F·sin θ = ${torque(t).toFixed(1)} N·m`, fontSize: 28, color: P.violet, fontFamily: font.hand }).moveTo([0, 2.4, 0]),
      new Rectangle({ width: w, height: 0.3, color: P.violet, strokeWidth: 0, fillOpacity: 0.85, center: [0.6 + w / 2, -3.2, 0] }),
    ];
    scene.add(...marks);
  };

  // Intro: perpendicular (max), then along the wrench (zero), then settle at 60°.
  let theta = Math.PI / 6;
  const to = async (target, ms) => { const from = theta; await ctx.tween(ms, (k) => { theta = from + (target - from) * k; apply(theta); }); };
  apply(theta);
  await ctx.wait(600);
  await to(Math.PI / 2, 2000);
  await ctx.wait(700);
  await to(0.02, 2000);
  await ctx.wait(700);
  await to(Math.PI / 3, 1400);

  // Hand over: the learner drags the force tip around the circle.
  const handle = new MovablePoint(scene, {
    point: tip(theta), color: P.orange, radius: 0.17,
    onChange: ([x, y]) => {
      theta = Math.min(Math.PI, Math.max(0, Math.atan2(y - H[1], x - H[0])));
      apply(theta);
      scene.add(handle); // keep the handle above the rebuilt arrows
      ctx.render();
      ctx.report({ thetaDeg: deg(theta), torque: +torque(theta).toFixed(1) });
    },
  });
  handle.constrainToParametric((t) => [H[0] + L * Math.cos(t), H[1] + L * Math.sin(t)], [0, Math.PI]);
  scene.add(handle);
  scene.add(new Dot({ point: H, radius: 0.06, color: P.ink }));
  ctx.render();
  ctx.interactive();
}
