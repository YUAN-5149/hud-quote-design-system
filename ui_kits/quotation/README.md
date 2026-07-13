# Quotation UI Kit — 水電報價系統

Interactive click-thru prototype demonstrating the HUD design system in context.

## Files
- `index.html` — App entry, mounts React, wires the routing
- `app.css` — App-shell + component styles (depends on root `colors_and_type.css`)
- `Chrome.jsx` — `Rail`, `TopBar`, `StatusBar`
- `Primitives.jsx` — `Panel`, `Metric`, `Chip`, `Button`, `Field`, `Input`, `Toggle`
- `Screens.jsx` — `Dashboard`, `CaseList`, `QuoteBuilder`, `ComingSoon` + mock `CASES`

## Flows covered
1. **Dashboard** — metrics, recent cases, telemetry, today's schedule
2. **Case list** — filterable table of all cases with progress bars
3. **Quote builder** — line items editor, running total, approval timeline
4. Click any row in Dashboard/Cases → opens Quote Builder
5. Coming-soon placeholders for Materials / Billing / Reports modules
