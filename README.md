# 水電報價 HUD Design System

> 台灣水電工程報價系統 — A futuristic HUD-style interface design system for plumbing & electrical engineering quotation software in Taiwan.

## 產品概述 (Product Overview)

This design system serves a B2B SaaS quotation system used by Taiwanese plumbing (水電) and electrical engineering contractors. The product helps small-to-medium工程行 (engineering firms) generate professional quotes (報價單), manage 工料 (labor & materials), track 工程進度 (project progress), and issue 估價單 / 請款單 (estimates / invoices).

The visual language is **HUD (Heads-Up Display)** — borrowing from cockpit instrumentation, military targeting overlays, and sci-fi command consoles (think Iron Man's J.A.R.V.I.S., EVE Online interfaces, Apollo-era flight displays). This treatment elevates an otherwise utilitarian工具 (tool) into a confidence-instilling command center: contractors feel like they're operating professional-grade equipment, not filling out spreadsheets.

### Sources

This system was created **without** an attached codebase, Figma file, or product screenshots. All visual decisions, copy, and components are original — derived from the brief: *台灣水電工程報價系統 / 採用HUD介面設計，具有高科技感*. If a real product exists, please re-attach materials so the kit can be aligned to actual production code.

---

## 索引 (Index)

| File / Folder | Purpose |
|---|---|
| `README.md` | This file — overview, content & visual fundamentals, iconography |
| `SKILL.md` | Agent-skill manifest for cross-tool use |
| `colors_and_type.css` | Core CSS variables: colors, typography, spacing, motion |
| `fonts/` | Webfont files (currently CDN-loaded; see Type section) |
| `assets/` | Logos, icon SVGs, brand marks, HUD ornament library |
| `preview/` | Design-system preview cards (rendered in Design System tab) |
| `ui_kits/quotation/` | UI Kit — quotation system screens & components (CDN prototype) |
| `app/` | **Production app** — Vite + React 版報價系統（含請款模組、報價單列印、手機版 RWD） |
| `index.html` | GitHub Pages 站點首頁（設計系統導覽 + App 入口） |

### 開發 (Development)

```bash
cd app
npm install
npm run dev     # http://localhost:5173
npm run build   # 打包到 app/dist
```

推送到 `master` 會自動觸發 GitHub Actions 部署 GitHub Pages（見 `.github/workflows/deploy.yml`）。

---

## 內容基本原則 (CONTENT FUNDAMENTALS)

### 語言 (Language)
- **Primary: 繁體中文 (Traditional Chinese)**, the standard for Taiwan business software.
- **Secondary: English**, used for technical labels, system codes (e.g. `STATUS: ACTIVE`), and HUD chrome that benefits from monospace alignment.
- **Numbers, currency, and units** are always Western numerals: `NT$ 128,400` / `42 KW` / `3.5 hr`.

### 語氣 (Tone)
- **Operational, precise, slightly military.** Copy reads like instrumentation labels, not marketing.
- Use **second person** sparingly — the system addresses the operator (contractor) directly only in confirmation dialogs and onboarding (e.g. *"確認送出此份報價單？"*).
- Most UI text is **declarative / nominal**: *目前案件* (Current Cases), *材料清單* (Materials List), *本月收款* (This Month's Receipts) — not full sentences.
- **No exclamation marks**, no soft language (no *請稍候哦*, *小提醒～* etc).
- **Casing for English: ALL CAPS** for status chips, system codes, section headers; `Title Case` for buttons and links inside Chinese-dominant flows.

### 範例 (Examples)
| ✅ Good | ❌ Avoid |
|---|---|
| `案件 #2025-0418 已鎖定` | `您的案件已經被鎖定囉！` |
| `STATUS · ACTIVE · LOCKED 03:42` | `案件狀態：使用中（已鎖定3分鐘）` |
| `材料估算 // 配電盤 ×1` | `估算的材料：配電盤一個 :)` |
| `送出報價` | `送出報價單囉～` |
| `SYSTEM ONLINE · 17 NODES` | `系統正常運作中（17個節點）` |

### 標點 (Punctuation)
- Use `·` (middle dot) and `//` as inline separators between metadata segments — they reinforce the HUD chrome.
- Use `／` (full-width slash) inside Chinese, `/` between English tokens.
- Brackets: `[ ]` for system codes, `「 」` for quoted user input or case names.
- No emoji. Ever. Status conveyed by colored dots, glyphs, and typography.

### 術語 (Terminology)
| Term | Meaning |
|---|---|
| 案件 | A project / case — the top-level unit |
| 報價單 | Quotation document |
| 估價單 | Estimate (less formal than 報價單) |
| 請款單 | Invoice / payment request |
| 工料 | Labor & materials |
| 工程行 | Engineering firm (the contractor business) |
| 業主 | Property owner / client |
| 工項 | A line item on a quote |

---

## 視覺基礎 (VISUAL FOUNDATIONS)

### 整體調性 (Overall Vibe)
**Dark cockpit / scan-line console.** Deep black-blue field, phosphor-cyan and amber-yellow accents, geometric chrome, hairline strokes. Think Apollo Mission Control × modern fintech terminal × Bloomberg.

### 色彩 (Color)
- **Background field**: pure-ish black with a faint blue cast — `#040810` base, `#0A111E` for cards.
- **Primary accent — phosphor cyan**: `#00E5FF`. Used for primary actions, active states, scanning lines, and key data values.
- **Warning amber**: `#FFB300`. Used for pending states, warnings, and "attention required" callouts.
- **Alert red**: `#FF3B47`. Reserved for destructive actions, overdue invoices, system errors.
- **Confirm green**: `#22E07A`. Reserved for completed states and successful payments only.
- **Text**: cool white (`#E6F1FF`) primary, cyan-grey (`#7A8DA6`) secondary, dim grey (`#3D4B63`) tertiary.
- **Color is restricted.** Most surfaces are monochrome black + white; color is reserved for state and accent. A typical screen uses cyan + grey + 1 status color — never all four accents at once.

### 字體 (Typography)
- **Display / Headings**: `Orbitron` (Google Fonts) — geometric, slightly futuristic, used sparingly for screen titles and big numerals. *Substitution flag: ideal would be `Eurostile Extended` or `Bank Gothic`; please provide if licensed.*
- **Body (Chinese)**: `Noto Sans TC` (Google Fonts) — clean, neutral, excellent CJK coverage. Weights 400 / 500 / 700.
- **Body (Latin)**: `Inter` paired with Noto Sans TC for mixed Chinese/English UI text.
- **Mono / Data**: `JetBrains Mono` — used heavily for numbers, codes, timestamps, status chips.
- Big numbers use **tabular figures** (`font-variant-numeric: tabular-nums`) so digits don't dance.

### 間距 (Spacing)
8-point base grid. Tokens: `--s-1: 4px` · `--s-2: 8px` · `--s-3: 12px` · `--s-4: 16px` · `--s-5: 24px` · `--s-6: 32px` · `--s-8: 48px` · `--s-10: 64px`. Cards prefer 16–24px internal padding. Screen gutters 24–32px.

### 邊框 (Borders)
- **Hairline borders everywhere**: `1px solid rgba(0, 229, 255, 0.18)` for chrome, stronger `0.32` opacity on focused panels.
- **Corner notches** instead of rounded corners on most panels — small clipped 8px diagonal cuts at corners using `clip-path`. Buttons and chips may use `border-radius: 2px` for a subtle softening; never more than 4px.
- **No drop shadows** in the conventional sense. Depth comes from glow + scanlines + opacity layering.

### 陰影 / 光暈 (Shadows / Glows)
- **Outer glow** on active elements: `box-shadow: 0 0 0 1px rgba(0,229,255,0.4), 0 0 24px -4px rgba(0,229,255,0.5)`.
- **Inner shadow** on inputs: subtle `inset 0 1px 0 rgba(0,229,255,0.08)` to suggest recessed surface.
- Used very sparingly — over-glowing kills the precision feel.

### 背景 (Backgrounds)
- **Base layer**: solid `#040810`.
- **Grid overlay**: 32px × 32px subtle cyan grid at 4% opacity, fixed-position background-image.
- **Vignette**: radial gradient darkening corners.
- **Scanline overlay**: optional 2px-repeating horizontal lines at 1.5% opacity for "CRT" feel — toggled per surface.
- **No photographic imagery**, no illustrations. The HUD itself is the imagery. If photos are needed (e.g. site documentation), they're shown inside framed monochrome containers with a cyan tint overlay.

### 動畫 (Animation)
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo) for most transitions — snappy starts, soft ends.
- **Durations**: 120ms (micro), 200ms (default), 360ms (panel transitions). Nothing slower.
- **No bounces**, no spring physics, no decorative wiggles.
- **Signature motion**: a horizontal "scan" line that sweeps left-to-right across data panels on load, and a typewriter/decode reveal for big numbers (digits scramble briefly then settle).
- **Loading states** use a radar-sweep arc or marching-ant dashed border, never spinners.

### 互動狀態 (Hover / Press / Focus)
- **Hover**: brighten cyan border to ~50% opacity, add faint glow, no movement.
- **Press / active**: invert — cyan fill (12% alpha) with brighter border. Slight 1px translateY down on buttons.
- **Focus**: 2px cyan outline at 80% opacity, offset by 2px (high-contrast accessibility).
- **Disabled**: 40% opacity, no glow, cursor not-allowed.

### 卡片 (Cards / Panels)
- Dark `#0A111E` fill, hairline cyan border, 8px corner notches via clip-path.
- Optional **header bar**: 32px tall strip with section title in mono uppercase, cyan underline.
- Optional **corner brackets** (`⌐ ⌐ ⌙ ⌙` shapes) at the four corners — pure decoration but defining of the look.
- No internal dividers — sections separate via spacing and label hierarchy.

### 透明度 / 模糊 (Transparency / Blur)
- Modal overlays use `backdrop-filter: blur(12px)` over a dark `rgba(4,8,16,0.72)` scrim.
- Floating popovers (menus, tooltips) use `rgba(10,17,30,0.92)` + 8px blur.
- Body content never uses blur — clarity is paramount for data.

### 佈局規則 (Layout Rules)
- **Persistent left rail** (64px collapsed / 220px expanded) with primary nav.
- **Persistent top bar** (56px) with system status, current operator, real-time clock.
- **Optional right inspector panel** (320px) for selected-item detail.
- **Main canvas** uses 12-column grid, 24px gutters.
- Bottom edge often carries a **status ticker** with system telemetry — adds chrome and reinforces the HUD metaphor.

### 圖像色調 (Imagery Tone)
N/A — system is illustration-free by design. If user-uploaded photos appear (job-site evidence, receipts), they render desaturated to ~60% saturation with a slight cyan duotone overlay so they integrate with the chrome.

---

## ICONOGRAPHY

This system uses **`Lucide`** (https://lucide.dev/) as the primary icon library, loaded from CDN. Lucide's clean 1.5px stroke style harmonizes with the hairline aesthetic of the HUD chrome.

- **Stroke width**: `1.5px` standard (Lucide default), `2px` for emphasis on primary actions.
- **Default size**: 16px (inline), 20px (buttons), 24px (panel headers), 32px (empty states).
- **Color**: inherits `currentColor` — typically cyan accent or grey secondary.
- **No filled icons.** Outline-only enforces the HUD line-art consistency.

In addition to Lucide, the system uses a small set of **custom HUD ornament SVGs** stored in `assets/hud/`:
- `corner-bracket.svg` — L-shaped corner used to frame data panels.
- `crosshair.svg` — center reticle for selection indicators.
- `radar-sweep.svg` — animated loading element.
- `chevron-stack.svg` — directional indicator for nav rails.
- `logo-mark.svg` — the brand mark (a stylized circuit + droplet glyph).
- `logo-wordmark.svg` — full lockup with 水電 wordmark.

**Emoji**: never used.
**Unicode glyphs**: used as inline ornaments only — `·` `//` `›` `⌐` `▮` `▯` — to reinforce the terminal/HUD chrome. These are typeset, not iconographic.

---

## 使用 (Use this system)

Import `colors_and_type.css` and the Google Fonts links into any HTML file:

```html
<link rel="stylesheet" href="colors_and_type.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Noto+Sans+TC:wght@400;500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

Then build with the CSS variables and reference the UI kit at `ui_kits/quotation/`.
