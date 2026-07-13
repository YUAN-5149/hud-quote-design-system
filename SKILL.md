---
name: shuidian-hud-design
description: Use this skill to generate well-branded interfaces and assets for 水電報價 HUD (Taiwan plumbing & electrical engineering quotation system), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping in a dark HUD/cockpit aesthetic.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key files:
- `README.md` — full system overview, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — drop-in tokens file (colors, type, spacing, motion, radii, glow)
- `assets/hud/` — brand mark, wordmark, and custom HUD ornament SVGs (corner-bracket, crosshair, radar-sweep, chevron-stack)
- `ui_kits/quotation/` — interactive React UI kit recreating the quotation app (Dashboard, CaseList, QuoteBuilder)
- `preview/` — design-system specimen cards

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy `colors_and_type.css` + `assets/hud/*` out and create static HTML files for the user to view. If working on production code, read the rules here to become an expert in designing with this brand.

Signature moves:
- **Dark phosphor-cyan HUD** — black-blue field (#040810), cyan accent (#00E5FF), hairline borders, corner-notched panels (clip-path polygon).
- **Mono readouts** — JetBrains Mono + tabular numerals for all numeric / status data.
- **Traditional Chinese + English** — Noto Sans TC primary, Orbitron for display numerals, uppercase English mono labels.
- **No emoji, no bounces, no rounded cards** — radii stay 0–4px except status pills. Depth via glow, never drop shadows.
- **HUD chrome** — `·` and `//` as inline separators, `[ ]` for codes, `「 」` for quoted user input.

If the user invokes this skill without any other guidance, ask what they want to build, ask a few questions (variations, output format, specific screens), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
