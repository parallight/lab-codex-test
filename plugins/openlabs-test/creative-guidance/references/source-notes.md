# Source reading notes

These are candidate references inspected as source, not a quality ranking. API compatibility and artistic merit are separate. Principles below are our synthesis, not established learning-outcome evidence.

## ManimCommunity/manim

- Source: https://github.com/ManimCommunity/manim/blob/e80274a2586c3c2f8d72600fe873e5f7971c0c9c/example_scenes/basic.py
- Commit: e80274a2586c3c2f8d72600fe873e5f7971c0c9c
- Observation: Persistent object transforms and label updaters; a useful reference for linking state to its annotation. Manim Community API family.

## 3b1b/videos

- Source: https://github.com/3b1b/videos/blob/f493460dedb6afcbc20aa84a7bbb585f4e2468f1/_2016/eola/chapter5.py
- Commit: f493460dedb6afcbc20aa84a7bbb585f4e2468f1
- Observation: Determinant chapter connects area change with transformations of a persistent geometric region. Analysis reference only: video code CC BY-NC-SA 4.0; not included in our skill or generated samples. Uses a different Manim lineage.

## Matheart/manim-physics

- Source: https://github.com/Matheart/manim-physics/blob/d37580e07ac67d06c8dfbb78804b8a0256d1502b/manim_physics/rigid_mechanics/pendulum.py
- Commit: d37580e07ac67d06c8dfbb78804b8a0256d1502b
- Observation: A physics scene should derive geometry from evolving model state. Plugin example, not a dependency installed for the pilot.

## mfranzon/manimtronics

- Source: https://github.com/mfranzon/manimtronics/blob/0fc983f963473d0aec784e7a3e67ec5f999ad1d3/examples/rc_charging.py
- Commit: 0fc983f963473d0aec784e7a3e67ec5f999ad1d3
- Observation: RC scene ties circuit state, charge indication and plot to one time tracker; reserves layout zones. MIT. This is an implementation reference, not independent validation of its physical representations.

## SilentPhysicsAnimations/SilentPhysicsAnimations

- Source: https://github.com/SilentPhysicsAnimations/SilentPhysicsAnimations/blob/116e17c0480d1cfb7e4359b37825828469135916/07-SimpleHarmonicMotion.py
- Commit: 116e17c0480d1cfb7e4359b37825828469135916
- Observation: Spring and mass retain identity, analytic displacement drives motion, reference lines and displacement markings are introduced progressively. MIT.

## mikemag/CS-Videos

- Source: https://github.com/mikemag/CS-Videos/blob/ac3ac26ca657e17f123ca4fbc1fc87fc44fe8dbf/csanim/arrays.py
- Commit: ac3ac26ca657e17f123ca4fbc1fc87fc44fe8dbf
- Observation: Array index pointer, highlight and label derive from one index tracker. csanim/exposition.py provides timed execution annotations and pauses. csanim is MIT; full video sources have different licensing; uses old manimlib APIs.

## helblazer811/ManimML

- Source: https://github.com/helblazer811/ManimML/blob/5e8f7cb69f23919f9ec7e880fb22c1ca2f841c08/examples/readme_example/animating_the_forward_pass.py
- Commit: 5e8f7cb69f23919f9ec7e880fb22c1ca2f841c08
- Observation: Explicit network objects and forward-pass animation separate model structure from the process being explained. MIT; plugin API not required for pilot.
