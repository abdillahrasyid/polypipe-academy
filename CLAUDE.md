# Polypipe Academy — Claude Code Configuration (UIUX)

## Tech Stack
- **Markup**: HTML5 semantic (`header`/`nav`/`main`/`section`/`article`/`footer`/`aside`)
- **UI Library**: DaisyUI v5 via CDN (`daisyui@5.5/daisyui.css` + `daisyui@5.5/themes.css`)
- **Styling**: TailwindCSS v4 via CDN (`@tailwindcss/browser@4.1`) — semantic color (`bg-primary`, `text-base-content`, `bg-base-100/200/300`), responsive mobile-first (`md:`/`lg:`). Plain CSS hanya untuk `@keyframes` + custom theme `[data-theme]`.
- **JavaScript**: NATIVE / vanilla ES6+ (`addEventListener`, `querySelector`, `fetch`, `classList`) — tanpa framework, tanpa bundler, tanpa build step.
- **Build**: tidak ada (CDN langsung di `<head>`).
- **Font**: Inter via Google Fonts (`wght@400;500;600`)

> **Catatan CDN**: `index.html` saat ini belum menggunakan CDN Tailwind v4 + DaisyUI v5. Styling menggunakan plain CSS inline dengan CSS variables kustom. Tambahkan CDN di `<head>` saat mengerjakan halaman/komponen baru.

## Design System & Tokens
- **Single source token**: Belum ada file token terpisah — CSS variables didefinisikan inline di `<style>` dalam `index.html` `:root`.
- **Format**: CSS variables plain (BUKAN `@theme`/`@plugin` yang butuh build)
- **Warna primitive saat ini**:
  - Primary: `--prime-500: #0d4495`, `--prime-600: #0c3e88`, `--prime-700: #09306a`, `--prime-400: #3d69aa`
  - Success: `--done-500: #12b76a`
  - Gray scale: `--gray-25` hingga `--gray-800`
  - Accent: `--blue-500: #429bf4`
  - Error: `--error-500: #f04438`
  - Warning: `--warning-500: #f79009`
- **Warna semantic DaisyUI**: Belum dipakai — warna masih hardcode hex. Saat migrasi ke DaisyUI, mapping ke `primary`/`success`/`error`/`warning`/`base-*`.
- **Dark mode**: Background gelap (`#1a1a2e`, `#04152f`) pada splash/welcome/home — belum via `[data-theme]` DaisyUI.

Untuk membuat token terstruktur: jalankan `/imp.tokens init`.

## Struktur Direktori
```
.
├── index.html              # SPA prototype tunggal — semua screen dalam satu file
├── calculator.html         # Kalkulator butt fusion — input parameter
├── calculator-result.html  # Hasil kalkulasi — parameter lengkap welding
├── calculator-step1.html   # BEAD UP — target tekanan & ukuran bead
├── calculator-step2.html   # HEAT SOAK Fase 1 — instruksi kurangi tekanan
├── calculator-step3.html   # HEAT SOAK Fase 2 — countdown timer heat soak
├── js/
│   ├── calculator-params.js   # Shared: calcWeldingParams, buildCycleSVGWithHighlight, formatCountdown, initProtoBanner
│   ├── api/                   # API wrappers (fetch intercept untuk mock toggle)
│   ├── contracts/             # Contract objects + validators
│   ├── mocks/                 # Mock data + business rule enforcement
│   ├── config/page-status.js  # Mapping pathname → status dev per halaman
│   └── prototype-banner.js    # Status indicator segitiga (In Progress / Ready / Done)
└── .claude/
    ├── agents/         # a11y-auditor, design-reviewer, html-prototype-engineer
    ├── commands/       # imp.* commands
    └── skills/         # a11y-wcag, daisyui-*, design-tokens, dll
```

> Project ini adalah **single-file SPA prototype** — semua screen dirender dalam satu `index.html` (912 baris). Screen switching via vanilla JS (show/hide `.screen.active`).

## Shared UI Components
Belum ada shared components terpisah. Komponen reusable saat ini inline dalam `index.html`:
- **Status bar** — diinjeksi via JS reusable snippet (komentar `<!-- Reusable status bar HTML snippet via JS -->`)
- **Phone mockup frame** — wrapper `393px` lebar (simulasi layar mobile)
- **Screen navigator** — breadcrumb navigasi antar screen (`.nav-bar`)

## Pages / Routes
Semua screen dalam `index.html` — navigasi via `showScreen(id)` vanilla JS:

| Screen ID | Tujuan UX |
|---|---|
| `screen-splash` | Splash screen — landing pertama saat app dibuka |
| `screen-welcome` | Onboarding/welcome — pilihan login atau daftar |
| `screen-login` | Form login (email + password) |
| `screen-register` | Form registrasi akun baru |
| `screen-lupa` | Lupa password — input email untuk reset |
| `screen-password` | Reset password — input password baru |
| `screen-home` | Dashboard utama — konten kursus, navigasi bottom tab |
| `screen-setting1` | Pengaturan akun — profil user |
| `screen-setting2` | Pengaturan notifikasi |
| `screen-setting3` | Pengaturan privasi / keamanan |
| `screen-setting4` | Pengaturan tampilan / preferensi |
| `screen-setting4d` | Sub-setting (detail dari setting4) |
| `screen-setting5` | Tentang aplikasi / info versi |

## Layouts & Template
- **Base layout**: `index.html` — phone mockup wrapper 393px, status bar injected via JS
- **Screen pattern**: `<div id="screen-*" class="screen [active]">` — `.screen` `display:none`, `.screen.active` `display:flex`
- **Background variants**: gradient gelap (splash/welcome/home), putih (auth/setting)

## Pola UI & Konvensi
- **Naming screen**: `screen-<nama>` (kebab-case) sebagai `id` HTML
- **State aktif**: class `.active` di-toggle via `showScreen(id)` vanilla JS
- **Lokasi komponen baru**: inline di `index.html` atau ekstrak ke file partial HTML jika > 50 baris
- **Pola state**: Loading/empty/error belum konsisten — perlu distandarkan saat pengembangan lanjut
- **Pola form**: HTML5 native attribute (`required`, `type=email`, `minlength`) + vanilla JS validator
- **Mobile-first**: Lebar tetap `393px` (simulasi iPhone 14) — prototype tidak responsive desktop
- **Screen navigator**: Breadcrumb prototype di atas phone mockup untuk navigasi antar screen saat development

## Catatan Accessibility
- **`outline-none` terdeteksi** di `index.html` — perlu review apakah focus indicator diganti atau dihilangkan
- **img tanpa alt**: Bersih (tidak terdeteksi)
- **Target compliance**: WCAG 2.1 / 2.2 Level AA
- Jalankan `/imp.a11y` untuk audit penuh

## Workflow UIUX
- `/imp.prototype <fitur>` — prototype interaktif + kontrak API
- `/imp.design-review` — review usability + konsistensi
- `/imp.a11y` — audit accessibility
- `/imp.tokens` — kelola design token
- `/imp.handoff <fitur>` — dokumen handoff ke engineer

## Aturan Umum (WAJIB)

### Sinkronisasi Sebelum Mulai (WAJIB)
- **Sebelum memulai session / mengerjakan task apa pun, WAJIB `git pull` dulu** di branch `uiux` agar working copy selaras dengan remote terbaru.
- Jalankan: `git checkout uiux && git pull --ff-only origin uiux` (atau `git pull` jika upstream sudah ter-set).
- Kalau `git pull` gagal (konflik / divergen) → selesaikan dulu sebelum lanjut.

### Reuse First
- Cek **Shared UI Components** + design token di atas sebelum bikin komponen/nilai baru.
- DILARANG bikin komponen UI baru jika sudah ada yang serupa — reuse / extend.
- DILARANG hardcode nilai visual (warna hex, px) — pakai design token / CSS variables.

### Plan Before Code (untuk command yang mengubah kode)
- Perubahan kode (prototype, tokens extract, handoff) lewat plan + approval dulu.
- Read file existing sebelum Edit; targeted edit, bukan rewrite.

### Accessibility & UX dari Awal
- Semua state (loading/empty/error/success) WAJIB ada — bukan hanya happy path.
- A11y (label, focus, kontras, keyboard) dibawa sejak desain, bukan retrofit.

### Development Log & Commit
- Prompt yang mengubah kode → update `docs/devlogs/<YYYYMMDD>-<branch>.md` (skill `sop-devlog`).
- Conventional commits, 1 task = 1 commit. **DILARANG** `Co-Authored-By`.
- Bahasa Indonesia untuk komunikasi, English untuk kode.

## Agent & Skill yang Tersedia

### Agents
- `a11y-auditor` — Audit accessibility WCAG 2.1/2.2 Level AA (aktif via `/imp.a11y`)
- `design-reviewer` — Review UI/UX holistik + konsistensi visual (aktif via `/imp.design-review`)
- `html-prototype-engineer` — Prototype static frontend HTML5 + Tailwind v4 + DaisyUI v5 (aktif via `/imp.prototype`)

### Skills
- `a11y-wcag` — Checklist WCAG 2.1/2.2, pola ARIA, severity mapping
- `branch-setup` — Aturan branch `uiux` wajib
- `coding-standards` — Clean Code standar perusahaan
- `daisyui-actions-input` — Contoh komponen DaisyUI: button, form, modal, input
- `daisyui-display-feedback` — Contoh komponen DaisyUI: card, table, alert, loading
- `daisyui-nav-layout` — Contoh komponen DaisyUI: navbar, menu, layout
- `daisyui-patterns` — Aturan DaisyUI-first + referensi class
- `design-tokens` — Taksonomi token, naming convention, mapping Figma → kode
- `figma-handoff` — Format dokumen handoff desain → engineer
- `html-standards` — Semantic HTML, a11y, data-testid, form semantics
- `javascript-guideline` — Konvensi JS: formatting, naming, JSDoc, modules
- `render-chain-verification` — Verifikasi render chain static site (CDN, link asset)
- `sop-devlog` — Format development log di `docs/devlogs/`
- `sop-plan-prototype` — Template plan untuk `/imp.prototype`
- `sop-plan-prototype-lengkap` — Template plan lengkap + wireframe + contoh
- `tailwindcss-patterns` — Pola Tailwind v4: layout, responsive, spacing
- `ux-heuristics` — 10 heuristik Nielsen, checklist UI state, pola mobile

### Commands
`/imp.a11y` `/imp.design-review` `/imp.handoff` `/imp.help` `/imp.prototype` `/imp.prototype-status` `/imp.push` `/imp.refactor` `/imp.setup` `/imp.tokens` `/imp.update`
