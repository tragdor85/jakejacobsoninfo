# Anet A8: Modded to a Point

The Anet A8 is a cheap, boxy, entry-level FDM printer. Mine keeps the original frame — and almost nothing else. It's the printer where "mod" stops meaning a plate and starts meaning a project.

## What's actually on it

| Part | What it's running |
|---|---|
| Controller | Klipper, running on a BIGTREETECH SKR Mini E3 V3 |
| Stepper drivers | TMC2209 on all four axes, UART mode |
| Build plate | 220×220 mm PEI spring steel |
| Sensor | BLTouch — auto bed level, saved nozzle offset around 0.5 mm |
| Power | 350 W PSU (the stock one was a prayer) |
| Belts | Fiberglass, with upgraded tensioners |
| Camera | OpenSCAD-printed mount — the part that holds the camera is itself printed |

No enclosure, no resonance sensor, and no pretense that this is a fast machine. It's a 220×220×240 mm box that prints better than the box it shipped in.

## The config is the mod

Klipper turns a printer into a *configuration problem*, which is exactly the kind of problem I like. The interesting bits:

- **TMC2209 currents tuned per axis** — extruder runs hottest, X/Y in the middle, Z lightest — all in stealthChop. Quiet enough to run in the same room the kids sleep in.
- **Kinematics** — cartesian, 300 mm/s max velocity, 3500 mm/s² acceleration. Aggressive for this frame; the fiberglass belts are the reason it holds up.
- **BLTouch** — single sample, 5 mm/s touch-down, z-offset saved into the config. "First layer" stopped being a daily negotiation.

The whole thing lives on the Raspberry Pi — the same box that runs the [home lab](/lab) — reachable from anywhere in the house over `klipperpi.local` through Moonraker and Fluidd.

## The workflow

1. **Slice in Cura 5.11** with a profile I rebuilt by recovering the *original* printer's settings from its old G-code files. The printer predated my configs, but the G-code remembered what the stock profile was — `SETTING_3` and friends are an archaeology site.
2. **Print test cubes** and the elephant-foot test. The local model looks at the photos and the logs and tells me whether the first layer is actually good, which is the only first-layer judge I trust.
3. **Watch live** over the camera and Moonraker logs. The agent can babysit a print and report back — closer to what you'd want from a printer than the manual ever offered.
4. **Post-mortem on defects.** When a print comes out wrong, the model works from photos + G-code + live logs to find which variable moved. Elephant foot, adhesion, layer shift — each has a paper trail.

Next on the bench: a small print-quality stats app that scores completed prints, so "is it getting better?" stops being a vibe.

## Why bother

A few hundred dollars of printer, a few hundred more of parts, free firmware, and a few hundred hours of tinkering. The total still costs less than one good printer — and the knowledge is the actual product.
