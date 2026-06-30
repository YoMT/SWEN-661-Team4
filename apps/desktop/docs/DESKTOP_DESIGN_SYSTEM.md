# CareConnect Desktop Design System (Electron)

**Version 1.0 · Large-screen (≥1440px) · Keyboard-first · Tremor-tolerant · WCAG 2.1 AA**

Derived from the CareConnect React Native app (`apps/mobile`) and the master spec
(`Documentation/careconnect-design-system-spec.docx`). This document is the source of truth
for the Electron desktop client at `apps/desktop`. It scales the mobile tokens up for desktop,
defines desktop-native components (window chrome, menu bar, toolbars, sidebars, context menus,
dialogs, status bar), and documents the desktop-specific design decisions.

> **The four pillars still apply.** CareConnect's primary users are caregivers living with
> Parkinson's tremor. Desktop increases density for mouse/keyboard precision, but the four
> accessibility pillars — **Large Buttons, Confirm Important Actions, Ignore Double-Taps,
> Reduce Motion** — are non-negotiable on every platform. Density is a default, not a license
> to break them: care-critical actions never drop below a 44px hit target, and an
> **Accessible (Tremor) density mode** restores full mobile-scale sizing.

---

## Table of contents

1. [Overview — how desktop relates to mobile](#1-overview--how-desktop-relates-to-mobile)
2. [Foundation tokens](#2-foundation-tokens)
3. [Desktop-optimized components](#3-desktop-optimized-components)
4. [Keyboard-first interaction model](#4-keyboard-first-interaction-model)
5. [Motion](#5-motion)
6. [Desktop-specific design decisions](#6-desktop-specific-design-decisions)
7. [Token reference appendix](#7-token-reference-appendix)

---

## 1. Overview — how desktop relates to mobile

CareConnect is a caregiver-centered medication, appointment and symptom tracker. The mobile
app (Expo / React Native) is the canonical implementation of the brand and the four pillars.
The desktop app is **the same product on a larger canvas** — the same colors, the same
semantic roles, the same confirmation behavior — re-laid-out for a windowed, pointer-driven,
keyboard-rich environment.

**What stays the same**
- The verified `CC` color palette (hex values are reused verbatim).
- The semantic type scale (Inter), the 4px spacing rhythm, and the status-never-by-color rule.
- The four pillars and the WCAG 2.1 AA commitments.

**What changes on desktop**
- **Layout** moves from a single scrolling column to a persistent **multi-pane shell**
  (title bar → menu bar → toolbar → sidebar + content + optional assistant panel → status bar).
- **Navigation** moves from a bottom tab bar + floating FAB to a **left sidebar + menu bar +
  contextual toolbar**.
- **Density** increases by default because a mouse is far more precise than a fingertip — but
  see the density floor rules in §2.
- **New affordances** appear that touch can't offer: hover states, tooltips, right-click
  context menus, keyboard accelerators, and resizable/multiple windows.

### Breakpoints & layout grid

| Token | Min width | Use |
|---|---|---|
| `bp-sm` | 1024px | Smallest supported desktop; sidebar may auto-collapse |
| `bp-md` | **1440px** | **Primary design target** |
| `bp-lg` | 1920px | Large desktop; wider content gutters, optional 3rd pane |

- **Max content width:** `1200px` for dashboards/tables (centered with gutters beyond `bp-lg`).
- **Reading column:** `800px` retained from mobile (`MaxContentWidth`) for forms, reports and
  long text, to preserve line-length legibility for low-vision users.
- **Base grid:** 4px. **App shell columns:** sidebar (`256`) · content (fluid) · panel (`360`).

---

## 2. Foundation tokens

All tokens are given as CSS custom properties (consumed in the `@renderer` React app) and
mirrored as a TypeScript object in the [appendix](#7-token-reference-appendix). Light is the
default theme; dark is applied via `[data-theme="dark"]`; the Accessible/Tremor density mode is
applied via `[data-density="accessible"]` (orthogonal to theme).

### 2.1 Color

Brand and semantic colors are reused **unchanged** from `apps/mobile/src/constants/theme.ts`
(the `CC` object) so the desktop client is pixel-identical in hue to mobile and inherits its
verified contrast ratios. Desktop adds **chrome roles** (title bar, menu bar, toolbar, sidebar,
status bar, hover, selection, focus ring) and a **dark theme**.

#### Brand & semantic — Light (verbatim from mobile, contrast verified in the master spec)

| Role | Token | Hex | On-color | Notes |
|---|---|---|---|---|
| Background | `--color-bg` | `#F8F9FA` | `--color-text` | App canvas (16.5:1) |
| Surface | `--color-surface` | `#FFFFFF` | `--color-text` | Cards, sheets, panels (17.4:1) |
| Surface alt | `--color-surface-alt` | `#EBF0F6` | `--color-text` | Selected/hovered surfaces, zebra rows |
| Primary | `--color-primary` | `#2E5C8A` | `#FFFFFF` | Buttons, nav, focus (6.97:1 on fill) |
| On primary | `--color-on-primary` | `#FFFFFF` | — | Text/icon on primary |
| Text | `--color-text` | `#1A1A1A` | — | Main text |
| Text muted | `--color-text-muted` | `#595959` | — | Secondary text (≥5.3:1) |
| Border subtle | `--color-border-subtle` | `#E0E0E0` | — | **Decorative dividers only** |
| Border strong | `--color-border-strong` | `#6B6B6B` | — | Interactive boundaries (≥3:1) |
| Success | `--color-success` | `#4A7C59` | `#FFFFFF` | Given / confirmed (4.86:1) |
| Warning | `--color-warning` | `#9E6E00` | `#1A1A1A` | Pending / due (use dark on-text) |
| Error | `--color-error` | `#B34040` | `#FFFFFF` | Errors / destructive |
| Info | `--color-info` | `#2E5C8A` | `#FFFFFF` | Informational (= primary) |

> **Status is never communicated by color alone** (WCAG 1.4.1). Every state also carries an
> icon **and** a text label — on desktop this applies to table status cells, toolbar toggles
> and status-bar indicators.

#### Desktop chrome roles — Light

| Role | Token | Hex | Notes |
|---|---|---|---|
| Title bar | `--chrome-titlebar` | `#2E5C8A` | Frameless bar; primary brand fill |
| Title bar text | `--chrome-titlebar-text` | `#FFFFFF` | App title + window controls |
| Menu bar | `--chrome-menubar` | `#FFFFFF` | Sits under title bar |
| Toolbar | `--chrome-toolbar` | `#F8F9FA` | Contextual action strip |
| Sidebar | `--chrome-sidebar` | `#FFFFFF` | Primary navigation panel |
| Sidebar active | `--chrome-sidebar-active` | `#EBF0F6` | Selected nav item bg |
| Status bar | `--chrome-statusbar` | `#EBF0F6` | Bottom info strip |
| Hover overlay | `--state-hover` | `rgba(46,92,138,0.08)` | Menu/list/toolbar hover |
| Active overlay | `--state-active` | `rgba(46,92,138,0.16)` | Pressed/checked |
| Selection | `--state-selection` | `rgba(46,92,138,0.16)` | Text/row selection |
| Focus ring | `--focus-ring` | `#2E5C8A` | 2px ring + 2px offset |
| Divider | `--chrome-divider` | `#E0E0E0` | Toolbar/menu separators |
| Scrim | `--scrim` | `rgba(0,0,0,0.45)` | Dialog backdrop |

#### Marketing / landing roles — Light

These brand-extension roles appear **only on the pre-auth surfaces** (landing/welcome window,
the split-screen auth panels) — not in the authenticated app shell. Values are reused verbatim
from mobile `theme.ts` (`LANDING_BG`, `HEADLINE_BROWN`) and the landing/auth components.

| Role | Token | Hex | Notes |
|---|---|---|---|
| Landing canvas | `--landing-bg` | `#F5EFE6` | Warm off-white landing background (`LANDING_BG`) |
| Headline accent | `--headline-accent` | `#6B4522` | Brown emphasis word in the hero headline (`HEADLINE_BROWN`) |
| Live dot | `--live-dot` | `#4ADE80` | Green "AI online" indicator on the Ask-CareConnect pill |
| Error surface | `--error-surface` | `#FEF2F2` | Tinted background behind inline auth error messages |

#### Dark theme (`[data-theme="dark"]`)

Desktop apps are frequently run in dark mode, so a dark theme ships here (the mobile spec left
dark mode as future work; these values are derived to meet ≥4.5:1 body / ≥3:1 UI on the dark
canvas, reusing mobile `Colors.dark` base values where they exist).

| Role | Token | Hex |
|---|---|---|
| Background | `--color-bg` | `#1A1B1E` |
| Surface | `--color-surface` | `#212225` |
| Surface alt | `--color-surface-alt` | `#2E3135` |
| Primary | `--color-primary` | `#5B8FC0` |
| On primary | `--color-on-primary` | `#0B1722` |
| Text | `--color-text` | `#F2F3F5` |
| Text muted | `--color-text-muted` | `#B0B4BA` |
| Border subtle | `--color-border-subtle` | `#34373B` |
| Border strong | `--color-border-strong` | `#7C8089` |
| Success | `--color-success` | `#5FA776` |
| Warning | `--color-warning` | `#E0B341` |
| Error | `--color-error` | `#E0736F` |
| Title bar | `--chrome-titlebar` | `#16171A` |
| Menu bar | `--chrome-menubar` | `#212225` |
| Toolbar | `--chrome-toolbar` | `#1A1B1E` |
| Sidebar | `--chrome-sidebar` | `#212225` |
| Status bar | `--chrome-statusbar` | `#16171A` |
| Hover overlay | `--state-hover` | `rgba(91,143,192,0.14)` |
| Focus ring | `--focus-ring` | `#7FB0E0` |
| Landing canvas | `--landing-bg` | `#1E1B16` |
| Headline accent | `--headline-accent` | `#C9A27A` |
| Live dot | `--live-dot` | `#4ADE80` |
| Error surface | `--error-surface` | `rgba(224,115,111,0.16)` |

> In dark mode, semantic on-text pairings flip where needed (e.g. warning uses dark text on
> the lighter amber). Always verify any new pairing against the live theme before shipping.

### 2.2 Spacing

The mobile 4px scale (`2 / 4 / 8 / 16 / 24 / 32 / 64`) is **extended with the intermediate
desktop steps** (`6 / 12 / 20 / 40 / 48`) the spec's §3.3 already calls for, because dense
desktop chrome needs finer control than mobile.

| Token | px | Typical use |
|---|---|---|
| `--space-0_5` | 2 | Hairline gaps, icon nudges |
| `--space-1` | 4 | Tight inline gaps |
| `--space-1_5` | 6 | Menu item vertical padding |
| `--space-2` | 8 | Toolbar button gap, chip padding |
| `--space-3` | 12 | **Default control padding** |
| `--space-4` | 16 | Card inner padding, form field gap |
| `--space-5` | 20 | Group spacing |
| `--space-6` | 24 | **Default section gap** |
| `--space-8` | 32 | Pane padding |
| `--space-10` | 40 | Large block separation |
| `--space-12` | 48 | Page gutters |
| `--space-16` | 64 | Hero / empty-state spacing |

### 2.3 Typography

Font: **Inter** (per spec, with Inter character-disambiguation features `cv05`, `cv08`,
slashed zero enabled) → platform system fallback. The mobile semantic roles are kept and a
small set of **desktop UI-chrome roles** is added for menu/toolbar/status text, which is denser
than content text.

**Font stack**
```
--font-sans: "Inter", "Segoe UI", "SF Pro Text", system-ui, Roboto, sans-serif;
--font-mono: ui-monospace, "SF Mono", "Cascadia Code", "Consolas", monospace;
```

**Content roles (from mobile `Typography`)**

| Role | Token | Size / Line / Weight |
|---|---|---|
| Heading 1 | `--type-h1` | 24 / 31 / 700 |
| Heading 2 | `--type-h2` | 20 / 26 / 600 |
| Title L | `--type-title-lg` | 18 / 25 / 600 |
| Title M | `--type-title-md` | 16 / 24 / 600 |
| Body L (default) | `--type-body-lg` | 16 / 24 / 400 |
| Body M | `--type-body-md` | 15 / 22 / 400 |
| Body S / caption | `--type-body-sm` | 13 / 20 / 400 |
| Label L | `--type-label-lg` | 16 / 24 / 600 |
| Label M | `--type-label-md` | 14 / 21 / 600 |
| Label S | `--type-label-sm` | 12 / 18 / 500 |

**Desktop UI-chrome roles (new)**

| Role | Token | Size / Line / Weight | Use |
|---|---|---|---|
| Menu | `--type-menu` | 13 / 18 / 500 | Menu bar items, context menu, dropdowns |
| Toolbar label | `--type-toolbar` | 12 / 16 / 500 | Icon-button captions |
| Table cell | `--type-cell` | 13 / 18 / 400 | Data table rows |
| Status bar | `--type-status` | 12 / 16 / 400 | Status strip text |

> **Text scaling** (Pillar 1, satisfies resize-to-200%): the body roles step up by user
> setting — Standard ×1.0 → Large ×1.25 → Largest ×1.5 — matching mobile `textScale()`. On
> desktop this also honors the OS text-scaling setting (Windows 125/150/200%).

### 2.4 Radius

Desktop reduces corner radii relative to mobile chrome for a crisper, more information-dense
look, while keeping the friendly 12px card radius.

| Token | px | Use |
|---|---|---|
| `--radius-xs` | 2 | Menu items, list rows |
| `--radius-sm` | 4 | Inputs, toolbar buttons, chrome |
| `--radius-md` | 6 | Dropdowns, popovers |
| `--radius-lg` | 8 | Buttons, small cards |
| `--radius-xl` | 12 | Cards, dialogs |
| `--radius-pill` | 999 | Badges, avatar, assistant bubbles |

### 2.5 Elevation / shadow

Desktop needs real elevation for floating surfaces (menus, popovers, dialogs). Values extend
the mobile FAB/toast shadows.

| Token | Shadow | Use |
|---|---|---|
| `--elevation-0` | none | Flush chrome (toolbar, status bar) |
| `--elevation-1` | `0 1px 2px rgba(0,0,0,0.10)` | Cards, raised toolbar |
| `--elevation-2` | `0 4px 8px rgba(0,0,0,0.14)` | Dropdown menus, context menus, popovers |
| `--elevation-3` | `0 8px 16px rgba(0,0,0,0.18)` | Dialogs, modals |
| `--elevation-4` | `0 16px 32px rgba(0,0,0,0.22)` | Full-screen reminders, command palette |

### 2.6 Density tokens — the dense/accessible duality

This is the heart of the desktop adaptation. **Dense is the default** (precise pointer);
**Accessible mode** (`[data-density="accessible"]`) restores mobile-scale sizing for tremor
users and honors Pillar 1.

| Token | Dense (default) | Accessible (Tremor) | Notes |
|---|---|---|---|
| `--control-sm` | 28 | 40 | Compact buttons, dropdowns |
| `--control-md` | **32** | **44** | Default control height |
| `--control-lg` | 40 | 56 | Prominent actions |
| `--control-critical` | **44 (floor)** | **64** | Care actions: Mark as Taken, Confirm, Delete |
| `--row-height` | 32 | 48 | Table / list rows |
| `--titlebar-h` | 32 | 40 | Frameless window bar |
| `--menubar-h` | 28 | 36 | File/Edit/View/Help bar |
| `--toolbar-h` | 44 | 56 | Contextual action strip |
| `--statusbar-h` | 26 | 32 | Bottom info strip |
| `--sidebar-w` | 256 | 288 | Expanded navigation |
| `--sidebar-w-collapsed` | 56 | 64 | Icon-only rail |
| `--tap-min` | 24 | 60 | Absolute minimum hit area for non-critical chrome |

> **Hard rule (Pillar 1):** any control that writes or destroys care data — *Mark as Taken,
> Log Symptom, Save, Confirm, Delete* — uses `--control-critical` and is **never** smaller than
> **44px** even in dense mode, with no adjacent interactive element within `--space-2`. Menu
> items and chrome may be smaller because they are reversible and non-destructive.

---

## 3. Desktop-optimized components

Each component lists anatomy, variants, states and the tokens it binds. Bind every size and
color to a token — never hardcode. The desktop **app shell** stacks these top-to-bottom:

```
┌─────────────────────────────────────────────────────────────┐
│ Title bar        CareConnect — Today                  – ▢ ✕ │  ← window chrome
├─────────────────────────────────────────────────────────────┤
│ File  Edit  View  Help                                       │  ← menu bar
├─────────────────────────────────────────────────────────────┤
│ [+ Medication] [+ Appointment] | [Export ▾]  …      🔍 ⌘K    │  ← contextual toolbar
├──────────┬──────────────────────────────────────┬───────────┤
│ ▸ Home   │                                       │  Peggy    │
│ ▸ Meds   │            content area               │ assistant │  ← sidebar | content | panel
│ ▸ Appts  │                                       │  (dock)   │
│ ▸ Sympt. │                                       │           │
│ ▸ Profile│                                       │           │
├──────────┴──────────────────────────────────────┴───────────┤
│ ● Synced 2m ago        All systems normal        3 due today │  ← status bar
└─────────────────────────────────────────────────────────────┘
```

### 3.1 Window chrome / title bar (custom frameless)

A **custom frameless** title bar (Electron `titleBarStyle: 'hidden'` + `BrowserWindow` drag
region) so the brand bar is consistent across OSes and the menu bar can integrate beneath it.

- **Anatomy:** app icon (16px) · window title (`--type-menu`, centered or left) · drag region
  · window controls.
- **Window controls placement (platform-aware):**
  - **Windows / Linux:** minimize / maximize / close, **top-right**, 46×`--titlebar-h`.
  - **macOS:** traffic-light close/min/zoom, **top-left**, with `--space-5` left inset so app
    content does not collide; honor `app.dock` and full-screen behavior.
- **Height:** `--titlebar-h` (32 dense / 40 accessible). **Fill:** `--chrome-titlebar`.
- **Interactions:** drag to move (`-webkit-app-region: drag`); window controls are
  `no-drag`; double-click title bar maximizes/restores; respects OS snap.
- **States:** focused vs blurred window (blurred dims title text to `--color-text-muted`).

### 3.2 Menu bar — File / Edit / View / Help

A persistent application menu bar under the title bar (in-window on Windows/Linux; on macOS it
maps to the **native global menu** — see §6).

- **Top-level items:** `--type-menu`, padding `--space-3` horizontal, height `--menubar-h`,
  hover `--state-hover`, **Alt-mnemonic** underlined letter (e.g. <u>F</u>ile).
- **Dropdown menu** (`--elevation-2`, `--radius-md`): each item = `[icon] Label  …  ⌘Shortcut [›]`
  with `--row-height` rows, left icon column (16px), right shortcut column (`--color-text-muted`),
  submenu chevron. Supports separators, **checkable** items (✓), radio groups, and disabled
  (dimmed, non-focusable) items.

**CareConnect menu map**

| Menu | Items |
|---|---|
| **File** | New Medication `⌘N` · New Appointment `⌘⇧N` · Log Symptom · — · Export Report… `⌘E` · — · **Sign Out** · Exit `⌘Q` |
| **Edit** | Undo `⌘Z` · Redo `⌘⇧Z` · — · Edit Profile · Emergency Contacts · Caretaker Notes |
| **View** | Dashboard `⌘1` · Medications `⌘2` · Appointments `⌘3` · Symptoms `⌘4` · Profile `⌘5` · — · ✓ Show Sidebar `⌘B` · ✓ Show Assistant `⌘J` · — · Text Size ▸ (Standard / Large / Largest) · ✓ Tremor (Accessible) Mode · ✓ Reduce Motion · Theme ▸ (Light / Dark / System) |
| **Help** | User Guide · Keyboard Shortcuts `⌘/` · — · About CareConnect |

> **Account / avatar menu.** Alongside the menu bar, the signed-in user's avatar (sidebar
> footer, or title-bar right) opens an account menu: **Profile · Settings · — · Sign Out**.
> Sign Out is therefore reachable two ways (account menu + File ▸ Sign Out). See §3.11.

> Destructive items (none belong in menus directly) and care-writes still route through the
> two-step confirm dialog (§3.6).

### 3.3 Toolbar with icon buttons (contextual per screen)

A contextual action strip below the menu bar; its contents **change per active screen**. Icon
buttons are 28–32px (`--control-md` minus inset) with mandatory **tooltips** and `aria-label`.
Tooltips appear on **hover *and* keyboard focus** (not hover-only) so icon-only buttons are
discoverable without a mouse, and each tooltip shows the action's shortcut where one exists.

- **Variants:** icon-only · icon + label · **toggle** (checked = `--state-active`) ·
  **segmented group** (e.g. day/week/month) · split button (`Export ▾`) · overflow `⋯` menu.
- **States:** default · hover (`--state-hover`) · active · focus (`--focus-ring`) · disabled.
- **Layout:** left-aligned primary actions, right-aligned search/`⌘K` and view options;
  separators via `--chrome-divider`. Height `--toolbar-h`.
- **Keyboard:** the toolbar is **one tab stop** (roving tabindex); `←/→` moves between buttons,
  `Home/End` jump to first/last, `Space`/`Enter` activate, toggle buttons flip with `Space`
  (state exposed via `aria-pressed`), a **split button** activates its default with `Enter` and
  opens its menu with `↓`/`Alt+↓`, and the overflow `⋯` opens a menu navigable with `↑/↓`. The
  toolbar is reachable via `F6` region cycling and from `⌘K` actions.

**Contextual toolbar per core screen**

| Screen | Toolbar actions |
|---|---|
| **Dashboard** | Date range (segmented: Today / Week) · Refresh · Export Report ▾ · Print |
| **Medications** | + Medication · Mark all taken · Filter (Due / Missed / Given) · Sort ▾ · View (List / Grid) |
| **Appointments** | + Appointment · Today · Calendar / List toggle · Filter (In-person / Video) · Reschedule |
| **Symptoms** | + Log Symptom · Date range · Type filter ▾ · Severity sort · Export |
| **Profile** | Edit · Accessibility Settings · Emergency Contacts · Caretaker Notes · Generate Report |

> Care-write toolbar buttons (*+ Medication*, *Mark all taken*, *+ Log Symptom*) are sized at
> `--control-critical` (≥44px) and get the 600ms debounce (Pillar 3).

### 3.4 Sidebar / navigation panel

Replaces the mobile bottom tab bar. Vertical list, expanded (`--sidebar-w`) or collapsed to an
icon rail (`--sidebar-w-collapsed`); toggle with `⌘B`.

- **Primary nav (from mobile tabs):** Home/Dashboard · Medications · Appointments · Symptoms ·
  Profile. **Secondary:** Emergency · Caretaker Notes · Settings (Accessibility).
- **Nav item anatomy:** icon (20px) + label (`--type-body-md`) + optional count badge; height
  `--row-height` (≥`--control-critical` in accessible mode), `--radius-xs`.
- **States:** active (`--chrome-sidebar-active` fill + `--color-primary` left bar 3px) · hover ·
  focus ring · collapsed (icon-only, tooltip on hover).
- **Keyboard:** ↑/↓ moves selection (roving tabindex), Enter activates, `⌘1…⌘5` jump directly.

### 3.5 Context menu (right-click)

Right-click affordance on rows, cards and content — a touch screen can't offer this.

- Same item anatomy as the menu-bar dropdown (`--elevation-2`, `--radius-md`, `--row-height`).
- **Positioning:** anchored at cursor; **flips** at viewport edges; closes on outside-click,
  Esc, or selection.
- **Examples:** on a MedCard row → *Mark as Taken · Edit · Skip dose · Delete…*; on an
  appointment → *Reschedule · Join video · Cancel…*. Destructive entries (Delete, Cancel) open
  the two-step confirm.
- **Keyboard:** opens via `Shift+F10` / context-menu key on the focused row; arrow-navigable.

### 3.6 Dialogs & modals

| Type | Use | Key behavior |
|---|---|---|
| **Standard dialog** | Settings, pickers | `--radius-xl`, `--elevation-3`, scrim, focus trap |
| **Two-step confirm** (Pillar 2) | Delete, mark-dose, cancel appt | Cancel + Confirm **≥80px apart**, each ≥`--control-critical`, **never auto-closes** (WCAG 2.2.1) |
| **Form modal** | New medication / appointment | Inline validation, primary action bottom-right |
| **Alert** | Errors, blocking notices | Icon + label + single dismiss; static (no flashing) |
| **Medication reminder** | Dose due | Full-screen, static, `--elevation-4`, audio + haptic, two-tap acknowledge, 30s undo |

- **Layout:** title (`--type-h2`), body (`--type-body-lg`), action row bottom-right (primary)
  / bottom-left (cancel + undo). Deletions move to a 30-day recoverable bin (Pillar 2).
- **Keyboard:** focus trapped within; `Esc` cancels (never the destructive default); `Enter`
  triggers the **safe** default (Cancel for destructive dialogs); Tab cycles; restore focus to
  the invoker on close.

### 3.7 Status bar

A bottom strip (`--statusbar-h`, `--chrome-statusbar`, `--type-status`).

- **Left:** sync status (`● Synced 2m ago` — icon **and** text, never color alone).
- **Center:** contextual message / connection state.
- **Right:** counts (`3 due today`), text-size indicator, theme indicator.
- **Keyboard / a11y:** the strip is a `status`/`contentinfo` landmark; display text is
  **non-interactive and not in the tab order**, but any *actionable* item (e.g. a clickable
  "3 due today" that jumps to the medications list, or a "Retry sync" affordance) **must be
  Tab-reachable** with a visible focus ring and an `aria-label`. Sync and save state changes
  are mirrored to an `aria-live="polite"` region (see §4.6) so keyboard/screen-reader users are
  notified without needing to look at the strip.

### 3.8 Adapted CareConnect components

| Mobile component | Desktop adaptation |
|---|---|
| `AppButton` (primary/outline/danger/text) | Content-width (not full-width), adds **hover** + **focus-ring**; primary = `--control-critical` for care actions, `--control-md` for secondary; keeps 600ms debounce |
| `AppTextField` | 2px `--color-border-strong` boundary, `--radius-sm`, focus ring; label always explicit; voice-input affordance retained |
| `MedCard` | **Data table / dense list row** (`--row-height`) with columns Name · Dose · Time · Status (icon+label+color) · row actions; right-click context menu; "Mark as Taken" stays ≥44px. **Keyboard:** full grid model (§4.2) — `↑/↓` between rows, `Enter` opens detail, **`Space`/`T` marks the focused dose as Taken** (≥44px, 600ms debounce), `Delete` opens the two-step confirm, `Shift+F10` opens the row context menu; the primary row action is also a real focusable button reachable by `Tab`/`→` so it never depends on hover. |
| `StatTile` | Dashboard **card grid** (2–4 columns at `bp-md`+), `--radius-xl`, `--elevation-1`, colored left bar |
| `LinkRow` | **Settings list** rows (icon + label + chevron); used in Profile/Settings panes |
| Severity stepper | Horizontal 1–10 control with keyboard (←/→, rate-capped 1/400ms, `aria-live` announce) |
| `PeggyFab` (floating FAB + modal) | **Dockable assistant side panel** (`--panel-w` 360, toggle `⌘J`); no floating FAB on desktop — docked or detachable window. **Keyboard:** `⌘/Ctrl J` toggles the panel **and moves focus into the message input**; `Enter` sends, `Shift+Enter` newlines; `↑/↓` from the input navigates message history; `F6` cycles into the conversation transcript (a focusable `log` region); `Esc` closes the panel and **returns focus to the invoking control**. |
| `AppTabs` (bottom tabs) | Removed; replaced by sidebar + `View` menu |

---

### 3.9 Pre-auth: Landing / welcome window

The **unauthenticated entry window** — shown before sign-in (no app shell, no sidebar). It
adapts the mobile landing (`apps/mobile/src/app/(auth)/index.tsx`) to a full marketing landing
for ≥1440px. Background is `--landing-bg` (warm off-white), not the app `--color-bg`.

```
┌─────────────────────────────────────────────────────────────┐
│ ❤ CareConnect                                       Sign in  │  ← primary top bar (--chrome-titlebar)
├─────────────────────────────────────────────────────────────┤
│   ┌───────────────────────────┐   ┌───────────────────────┐  │
│   │ ❤ Made for caregivers      │   │                       │  │
│   │ A gentle helping hand       │   │     hero photo        │  │
│   │ through every day.          │   │   (radius 12–16,      │  │
│   │ Keep track of medicines…    │   │    max ~520px wide)   │  │
│   │ [ Get started — it's free → ]│  │                       │  │
│   │ [ I already have an account ]│  │   + Ask CareConnect ● │  │
│   └───────────────────────────┘   └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

- **Top bar:** `--chrome-titlebar` fill; ❤ logo box (36px, `--radius-md`, 1.5px white-40%
  border) + "CareConnect" (`--type-title-md`, white); right-aligned **Sign in** link (white-90%).
- **Hero band:** centered, **content max-width 1200**, two columns with `--space-12` gutter
  (single column below `bp-sm`):
  - **Left:** "Made for caregivers" **badge** (surface pill, `--radius-pill`, 1px
    `--color-border-subtle`, `--color-primary` text) → **headline** (`--type-h1`-scale, 700;
    the emphasis phrase uses `--headline-accent` brown) → **subtext** (`--color-text-muted`,
    `--type-body-lg`) → **CTAs**: primary "Get started — it's free →" + outline "I already have
    an account" (content-width, ≥`--control-critical`, stacked `--space-3` apart).
  - **Right:** the **hero image** (§3.9.1) + a primary **"+ Ask CareConnect"** pill
    (`--radius-pill`) with a `--live-dot` "AI online" indicator → routes to login.
- **Keyboard:** logical order Sign in → Get started → I already have an account → Ask
  CareConnect; visible focus rings; no mouse-only path (WCAG 2.1.1).

#### 3.9.1 Hero image (`hero_photo.jpg`)

- **Asset:** `apps/mobile/assets/images/hero_photo.jpg` (also `apps/web/src/assets/hero.png`,
  `apps/flutter-app/assets/images/hero_photo.jpg`). Source is landscape (~3:2): a caregiver and
  an older woman holding hands, smiling together on a couch — warm, calm, non-clinical.
- **Treatment:** `--radius-xl` corners; object-fit cover. Landing uses a portrait-ish crop
  (mobile aspect ≈0.9); the **split-screen auth** (§3.10) uses it full-bleed in the right pane.
- **Accessibility:** meaningful image — provide alt text "A caregiver and an elderly woman
  sharing a warm moment" (do **not** mark decorative). Never place text directly over the busy
  center of the photo without a scrim (see §3.10).
- **Theming:** in dark mode, apply a subtle `--scrim` overlay so the warm photo doesn't glare;
  keep the same asset.

### 3.10 Pre-auth: Login & Sign-up (split-screen)

A two-pane unauthenticated frame (collapses to a single centered column below `bp-sm`):

```
┌───────────────────────────┬─────────────────────────────────┐
│  ❤ CareConnect             │                                 │
│  Sign in                   │                                 │
│  ┌─────────────────────┐   │          hero photo             │
│  │ ⚠ error (live region)│   │       (full-bleed, with         │
│  └─────────────────────┘   │        primary scrim +          │
│  Email   [____________]    │        tagline overlay)         │
│  Password[__________ 👁]   │                                 │
│  [        Sign In        ] │   "Care management built for     │
│  [ 🔒 Sign in w/ Biometrics]│    caregivers with tremors"     │
│  Forgot password?          │                                 │
│  Don't have an account? …  │                                 │
└───────────────────────────┴─────────────────────────────────┘
```

- **Left form panel (~480px, `--color-surface`):** brand lockup (❤ + "CareConnect" +
  tagline) → title **"Sign in"** / **"Create account"** (`--type-h2`) → **error live region**
  (`role="alert"`, `--error-surface` bg, `--color-error` text, hidden until set) →
  `AppTextField`s (Sign-up adds **Full name**; Login/Sign-up share Email + Password with the
  obscure toggle) → primary submit (`Sign In` / `Create Account`, ≥`--control-critical`, shows
  busy spinner) → **"🔒 Sign in with Biometrics"** (outline) → **"Forgot password?"** link →
  footer switch ("Don't have an account? Create account" / "Already have an account? Sign in").
- **Right hero panel:** the §3.9.1 image full-bleed with a `--scrim`/primary gradient and the
  tagline overlaid (white). Hidden below `bp-sm` (form centers, max ~440px).
- **Keyboard:** focus starts in **Email**; `Tab` walks the form top-down; **`Enter` submits**
  the primary action from any field; the biometric button and links are all Tab-reachable;
  validation/auth errors are announced via the live region (mirrors RN
  `accessibilityLiveRegion="assertive"`). Honor OS password-manager autofill.

### 3.11 Logout & session management

- **Placement (two paths, per §3.2):** the **account/avatar menu** (Profile · Settings · —
  · **Sign Out**) and **File ▸ Sign Out**. The Profile screen also keeps a "Sign out"
  affordance (mirrors mobile), styled with `--color-error` text.
- **Confirmation:** Sign Out routes through the **two-step confirm dialog** (§3.6, Pillar 2)
  **only when there is unsaved care data**; otherwise it signs out directly. It is reversible
  (you can sign back in), so it is not treated as destructive by default.
- **On sign-out:** clear in-memory state, drop the auth token, and return to the §3.10 login
  (or §3.9 landing). Mirrors `auth-context.tsx` `logout()`.
- **Session token:** stored via Electron **`safeStorage`** (not `localStorage`); restored on
  cold start (`/auth/me`), cleared on failure.
- **Auto sign-out on 401:** any API `401` triggers an automatic sign-out (mirrors RN
  `registerUnauthorizedHandler`). Surface a **non-destructive** "Session expired — please sign
  in again" notice via an `aria-live="polite"` region (or `role="alertdialog"` with focus moved
  to its sign-in button), then return to the split-screen login — never lose unsaved input
  silently.

### 3.12 Edit Profile (form modal)

Editing the caregiver profile is a **centered form modal** (§3.6 "Form modal" type), launched
from any of three entry points: **Edit ▸ Edit Profile** (§3.2), the **Profile screen toolbar
"Edit"** (§3.3), or the account/avatar menu **Profile** → Edit. (Mirrors the mobile
`apps/mobile/src/app/(tabs)/profile/edit.tsx` screen, promoted to a desktop dialog.)

```
┌──────────────── Edit Profile ───────────────── ✕ ┐
│  ( BW )  Change photo                              │
│                                                    │
│  Full name      [ Bobby Washington            ]    │
│  Email          [ bobby.w@email.com           ]    │
│  Phone          [ (555) 248-1190              ]    │
│  Caree name     [ Margaret Washington         ]    │
│  Blood type     [ O+                          ]    │
│                                                    │
│                          [ Cancel ] [ Save Changes ]│
└────────────────────────────────────────────────────┘
```

- **Anatomy:** title "Edit Profile" + close (✕); **avatar row** (current avatar + "Change
  photo" button); a vertical stack of `AppTextField`s (§3.8) — **Full name · Email · Phone ·
  Caree name · Blood type** (the five editable fields from the RN screen); action row
  bottom-right with **Cancel** (outline) + **Save Changes** (primary, ≥`--control-critical`).
  Surface `--color-surface`, `--radius-xl`, `--elevation-3`, scrim, width ~520px.
- **Fields:** Full name & Email required (inline validation, error text below the field on
  `--error-surface`); Phone/Caree/Blood type optional. Email uses email input semantics; Blood
  type may be a combobox (A±, B±, AB±, O±) rather than free text on desktop.
- **Editable vs read-only:** the Profile screen **info tiles are display-only**; all edits
  happen in this modal. Avatar change opens the native file picker (IPC, §3 main-process).
- **Dirty-state & confirm (Pillar 2):** **Save Changes** persists then closes (mirrors
  `profile-context` `update()`); **Cancel**/`Esc` with **unsaved changes** triggers a "Discard
  changes?" two-step confirm so a tremor mis-tap can't lose edits. A "Saved" `aria-live` notice
  confirms success (§4.6).
- **Keyboard (no mouse required):** modal **traps focus**, opens with focus on **Full name**;
  `Tab` walks fields → Cancel → Save; **`Enter` submits Save Changes** from any field; `Esc`
  cancels (→ discard-confirm if dirty); focus returns to the invoking control on close.

---

## 4. Keyboard-first interaction model

> **Keyboard-only guarantee.** Every task in CareConnect desktop is completable using the
> keyboard alone — the mouse is an *accelerator, never a requirement*. This is a hard
> requirement, not an aspiration: because the primary users live with Parkinson's tremor, a
> pointing device can be unreliable, so any flow that can only be completed with a mouse is a
> defect (WCAG 2.1.1). The audit and checklist in §4.7 hold the implementation to this bar.

### 4.0 Foundations

- **Focus ring:** `--focus-ring` 2px + 2px offset, shown on `:focus-visible` only (so mouse
  users don't see rings, keyboard users always do). Visible on **every** interactive element,
  and **never obscured** by sticky chrome (the toolbar/header scroll-pads the focused element
  into view — WCAG 2.4.11).
- **Tab order:** logical DOM order — title bar controls → menu bar → toolbar → sidebar →
  content → assistant panel → status bar. **Roving tabindex** within toolbars, menus, the
  sidebar and data tables (one tab stop per group; arrows move inside).
- **Skip / landmarks:** ARIA landmarks (`banner`, `navigation`, `main`, `complementary`,
  `contentinfo`) and a "skip to content" link that is the first focusable element.
- **No keyboard trap (WCAG 2.1.2):** focus can always move *out* of any widget with `Tab`/`Esc`;
  only modal dialogs trap focus, and they always offer `Esc`.

### 4.1 Region navigation (between panes)

The desktop shell has up to six regions (menu bar, toolbar, sidebar, content, assistant panel,
status bar). `Tab` walks *within* the current region; to jump *between* regions:

- **`F6`** → next region, **`Shift+F6`** → previous region (wraps). Landing focus is the
  region's last-focused element, or its first item if none.
- **`Ctrl+F6` / `Ctrl+Shift+F6`** → cycle sub-regions of a complex pane (e.g. table toolbar vs
  table body).
- **`F10`** (or **`Alt`**) → focus the menu bar; **`⌘K`** → command palette; **`⌘B`/`⌘J`** →
  toggle + focus the sidebar / assistant panel.

### 4.2 Lists, tables & grids (the core daily surface)

Medication, appointment and symptom lists render as a **keyboard grid** (`role="grid"`/`row`/
`gridcell`) so every row action is reachable without a mouse:

| Key | Action |
|---|---|
| `↑` / `↓` | Move between rows (roving focus; one tab stop for the whole grid) |
| `←` / `→` | Move between cells / expand-collapse a group row |
| `Home` / `End` | First / last row; `Ctrl+Home`/`Ctrl+End` top/bottom of list |
| `PageUp` / `PageDown` | Scroll a page of rows, keeping focus visible |
| type-ahead | Jump to the next row whose name starts with the typed letters |
| `Enter` | Open the focused row's detail |
| `Space` | Select / toggle the focused row (multi-select with `Shift`/`Ctrl`) |
| **`Space` or `T`** | **Mark the focused medication dose as Taken** (≥44px target, 600ms debounce) |
| `Delete` | Open the two-step confirm to delete the focused item |
| `Shift+F10` / menu key | Open the row context menu at the focused row |

> **Focus after mutation:** after a row is deleted or completed, focus moves to the **next**
> row (or the previous row if it was last; or the table's empty-state if none remain) — focus
> is never dropped to `<body>`.

### 4.3 Form controls

Every control is operable and labelled (explicit `<label>`; placeholder is never the only
label). Per-control keys:

| Control | Keys |
|---|---|
| Text / search field | Type; `Esc` clears search; `Enter` submits the default action |
| Combobox / dropdown | `↓` or `Alt+↓` opens; `↑/↓` move; type-ahead; `Enter` selects; `Esc` closes without changing |
| Checkbox / large toggle | `Space` toggles (`aria-checked`) |
| Radio group | `↑/↓` or `←/→` moves *and selects*; group is one tab stop |
| Segmented control | Arrows move between segments (`role="radiogroup"`) |
| Stepper (severity 1–10) | `←/→` ±1, `Home/End` min/max; **rate-capped 1 per 400ms** (Pillar 3); value announced via `aria-live` |
| Date / time picker | Opens with `Enter`/`Alt+↓`; arrows change day, `PageUp/PageDown` change month; `Esc` cancels, `Enter` commits; a typable text field is always offered as an alternative |
| Split button | `Enter` runs the default; `↓`/`Alt+↓` opens the menu |

### 4.4 Menus & overlays

- **Menu bar / dropdowns:** `Alt`/`F10` focuses the bar; `←/→` across menus, `↑/↓` within,
  `Enter` selects, `Esc` closes one level and restores focus; type-ahead matches item labels;
  shortcuts are shown right-aligned in every item.
- **Context menus:** open with `Shift+F10`/menu key on the focused element; arrow-navigable;
  `Esc` closes and restores focus to the originating row.
- **Modal dialogs:** focus is trapped and set to the first field (or the *safe* default for
  confirms); `Esc` cancels (never the destructive action); `Enter` triggers the safe default;
  closing restores focus to the invoker.
- **Non-modal popovers/menus:** do **not** trap focus — they close on `Esc` **or** when focus
  leaves via `Tab`.
- **`Esc` precedence:** innermost overlay first (tooltip → popover → menu → dialog → panel),
  one layer per press.

### 4.5 Discoverability

- **Focus-triggered help:** tooltips and helper text appear on **keyboard focus**, not just
  hover, and are dismissable with `Esc` and persistent while focused (WCAG 1.4.13) — so the
  meaning of an icon-only button is always available to keyboard users.
- **Shortcut hints** are shown in menus and tooltips; **`⌘/Ctrl /`** opens the full **Keyboard
  Shortcuts** reference (also under Help). Accelerators are remappable.
- **Printable reference.** The complete, platform-mapped shortcut list — with a one-page
  printable reference card — lives in
  [`DESKTOP_KEYBOARD_SHORTCUTS.md`](DESKTOP_KEYBOARD_SHORTCUTS.md); it is the user-facing view of
  this model and is kept in lock-step with §4.7 and the conflict policy in §4.10.

### 4.6 Live regions (feedback without looking)

State changes that a mouse user would *see* are announced for keyboard/screen-reader users via
ARIA live regions:

- `aria-live="polite"`: sync status, "Saved" / "Marked as taken" confirmations, list counts.
- `aria-live="assertive"` (or `role="alert"`): validation errors and blocking notices.
- The medication reminder uses `role="alertdialog"` with focus moved to its acknowledge button.

### 4.7 Global shortcuts

| Action | Shortcut | Action | Shortcut |
|---|---|---|---|
| New Medication | `⌘/Ctrl N` | Toggle Sidebar | `⌘/Ctrl B` |
| New Appointment | `⌘/Ctrl ⇧ N` | Toggle Assistant (Peggy) | `⌘/Ctrl J` |
| **Save** (current record / form) | **`⌘/Ctrl S`** | Settings | `⌘/Ctrl ,` |
| Search / Command palette | `⌘/Ctrl K` | Keyboard Shortcuts | `⌘/Ctrl /` |
| Export Report | `⌘/Ctrl E` | Quit application | `⌘/Ctrl Q` |
| Dashboard…Profile | `⌘/Ctrl 1…5` | Help | `F1` |
| Undo / Redo | `⌘/Ctrl Z` / `⇧Z` | Close window | `⌘/Ctrl W` |
| **Cycle panes** | **`F6` / `⇧F6`** | **Focus menu bar** | **`F10` / `Alt`** |
| **Mark dose Taken** (focused row) | **`Space` / `T`** | **Delete** (focused item) | **`Delete`** |
| **Toggle / select** (focused control) | **`Space`** | **Edit / rename** (focused item) | **`F2`** |
| **Close overlay** | **`Esc`** | **Row context menu** | **`⇧F10`** |

> Single-character shortcuts (`T`, type-ahead) are **active only when a grid row has focus**,
> never while typing in a text field (WCAG 2.1.4), and all accelerators are remappable.

### 4.8 Keyboard conformance checklist (WCAG 2.1 AA)

| Criterion | Requirement in this system |
|---|---|
| **2.1.1 Keyboard** | Every action — incl. *Mark as Taken*, add/edit/delete, reschedule, log symptom, export, assistant — has a documented key path (§4.2–4.4, §4.9). No mouse-only paths. |
| **2.1.2 No Keyboard Trap** | Focus leaves every widget via `Tab`/`Esc`; only modals trap, and they offer `Esc`. |
| **2.1.4 Character Key Shortcuts** | Single-key shortcuts are scoped to a focused grid row, disabled in text entry, and remappable. |
| **2.4.3 Focus Order** | Tab order follows the visual/DOM order; focus is managed on mutation, navigation and overlay open/close. |
| **2.4.7 Focus Visible** | `--focus-ring` (2px + 2px offset) on `:focus-visible` for all interactive elements. |
| **2.4.11 Focus Not Obscured** | Sticky title bar/menu/toolbar never cover the focused element; it is scrolled into the safe area. |
| **1.4.13 Content on Hover/Focus** | Tooltips/help trigger on focus as well as hover, are dismissable (`Esc`) and persistent while focused. |

### 4.9 "Completable without a mouse" — per-screen key paths

| Screen | Task | Keyboard path |
|---|---|---|
| **Dashboard** | Jump to a section | `⌘1` → `Tab`/`F6` to the card grid → `Enter` opens |
| **Medications** | Mark a dose taken | `⌘2` → `↓` to the row → `Space`/`T` (confirm with `Enter` if confirm-actions on) |
| **Medications** | Add a medication | `⌘N` → fill fields (`Tab`) → `Enter`/Save |
| **Medications** | Delete a medication | focus row → `Delete` → `Tab` to **Confirm** → `Enter` |
| **Appointments** | Add / reschedule / cancel | `⌘⇧N` to add; focus row → `Enter` detail or `⇧F10` → *Reschedule/Cancel* → confirm |
| **Symptoms** | Log a symptom + severity | `⌘4` → choose type (arrows) → stepper `←/→` → notes (`Tab`) → Save (`Enter`) |
| **Profile / Settings** | Toggle Tremor/Accessible mode, text size, theme | `F10` → **View** menu (`↓`) → toggle with `Enter`, or `⌘,` → settings list (`↑/↓`, `Space`) |
| **Profile** | Edit profile details | `F10` → **Edit** → **Edit Profile** (or Profile toolbar **Edit**) → focus lands in Full name → `Tab` fields → `Enter`/**Save Changes**; `Esc` cancels (discard-confirm if changed) |
| **Assistant (Peggy)** | Ask a question | `⌘J` (focus lands in input) → type → `Enter`; `Esc` returns focus |
| **Login** | Sign in | focus starts in Email → `Tab` to Password → `Enter` submits (or `Tab` to **Sign In**); Biometrics/Forgot are Tab-reachable |
| **Sign-up** | Create account | `Tab` through Name → Email → Password → `Enter`/**Create Account** |
| **Account** | Sign out | `F10` → **File** → `↓` to **Sign Out** `Enter` (or open the avatar menu → Sign Out); confirm only if unsaved data |

> **Interaction-state separation:** **hover** (pointer only — tooltips, overlays) is distinct
> from **focus** (keyboard — visible ring + the *same* tooltip/help) and **active/pressed**
> (instant color change, no scale, per Pillar 4). A control must be fully usable with
> focus + `Enter`/`Space` even when hover is unavailable.

### 4.10 OS shortcut-conflict policy

App accelerators are chosen so they never collide with reserved operating-system, browser or
Electron shortcuts, and **all accelerators are remappable**. Because accelerators are defined
once with Electron's **`CmdOrCtrl`**, a single definition is conflict-safe on Windows, Linux and
macOS; platform-reserved keys (e.g. `⌘M`, `⌘H`, Alt mnemonics) are simply never assigned to app
actions.

| Reserved shortcut | Owner / meaning | Policy |
|---|---|---|
| `⌘/Ctrl R`, `F5` | Reload (Chromium/Electron) | Not used — Provider Report is `⌘/Ctrl E` |
| `⌘/Ctrl W` | Close window | Standard meaning only |
| `⌘/Ctrl Q` | Quit application | Standard meaning only |
| `⌘M` (macOS) | Minimize window | Never bound to an app action |
| `⌘H` (macOS) | Hide application | Never bound to an app action |
| `Alt`+letter (Win/Linux) | Menu mnemonics | Reserved for menu activation, not standalone actions |
| Screen-reader keys (NVDA / VoiceOver / Orca) | Assistive tech | Never intercepted |

> **Retired draft bindings.** Earlier Week-7 draft keys that conflicted have been dropped:
> `Ctrl+R` (→ `⌘/Ctrl E`), `Ctrl+M` (the medication reminder is a **system-triggered**
> `alertdialog`, not a user command, so it has no invocation key), and `Alt+H` (→ `⌘/Ctrl 1`
> for Dashboard). New Appointment is `⌘/Ctrl ⇧ N` so it never clashes with New Medication
> (`⌘/Ctrl N`). See `DESKTOP_KEYBOARD_SHORTCUTS.md` §6 for the full analysis.

---

## 5. Motion

Pillar 4 — animation raises anxiety, which worsens tremor. Values are ceilings, all wrapped in
`prefers-reduced-motion` and an in-app **Reduce Motion** toggle (default on).

| Effect | Spec |
|---|---|
| View / pane transition | Fade only, ≤150ms |
| Menu / popover / dropdown open | Fade ≤120ms, no slide bounce |
| Dialog entry | Fade + ≤8px rise, ≤150ms, ease-out |
| Button press | Instant color change, **no** scale/spring |
| Loading spinner | ≤1 rev/sec, no pulsing ring |
| Bounce / spring / parallax / flashing | **Banned** |

---

## 6. Desktop-specific design decisions

### How does desktop design differ from mobile?

- **Input precision → density.** A mouse cursor is far more precise than a fingertip, so the
  default control height drops from mobile's 48–64px to **32–44px**, rows from ~56px to 32px,
  and spacing tightens. This lets a clinician/caregiver see far more medications, appointments
  and symptom history at once. *But* care-critical writes keep a 44px floor and Accessible mode
  restores mobile sizing — density never overrides Pillar 1.
- **Persistent multi-pane layout vs single column.** Mobile stacks one screen at a time; desktop
  shows a **title bar → menu bar → toolbar → sidebar + content + assistant panel → status bar**
  shell simultaneously, exploiting ≥1440px width instead of scrolling.
- **Navigation model.** Bottom tab bar + floating FAB (thumb-reach patterns) are replaced by a
  **left sidebar + application menu bar + contextual toolbar** — the conventional desktop
  information architecture, with direct `⌘1…5` jumps.
- **New affordances.** Hover tooltips, right-click context menus, keyboard accelerators,
  resizable and multiple windows — none of which exist on touch — become primary interactions.
- **The FAB disappears.** Peggy becomes a dockable/detachable side panel rather than a floating
  button, because there is room to keep the assistant persistently visible.

### What desktop patterns did you use, and why?

- **Custom frameless title bar** — consistent brand chrome and an integrated menu bar across
  OSes (§3.1).
- **Application menu bar (File/Edit/View/Help)** — the universally-learned home for commands,
  with mnemonics and accelerators; maps every CareConnect task to a discoverable menu item.
- **Contextual toolbar** — surfaces the 3–6 most frequent actions for the *current* screen so
  they're one click away without hunting through menus.
- **Sidebar navigation** — leverages vertical space, supports many destinations and a collapsed
  icon rail, and stays visible (unlike a bottom tab bar that competes with content).
- **Right-click context menus** — put row-specific actions (Mark Taken, Reschedule, Delete) at
  the cursor, reducing travel.
- **Status bar** — ambient, non-modal feedback (sync state, due counts) that mobile has no room
  for.
- **Command palette (`⌘K`)** — keyboard-driven access to any action for power users.
- **Modal dialogs incl. two-step confirm** — desktop-standard, and they carry Pillar 2 intact.

### How did you optimize for mouse/keyboard vs. touch?

- **Mouse:** hover states and tooltips on every icon button; right-click context menus; precise
  smaller targets; segmented controls and split buttons; resizable panes.
- **Keyboard (first-class):** complete operability without a mouse — visible `:focus-visible`
  rings, logical tab order with roving tabindex, Alt mnemonics, a full accelerator table (§4),
  focus-trapped dialogs that restore focus, and arrow-navigable menus/lists.
- **Preserved from touch/accessibility:** the 600ms debounce (Pillar 3), two-step confirms
  (Pillar 2), the 44px care-critical floor and Accessible (Tremor) density mode (Pillar 1), and
  fade-only ≤150ms motion (Pillar 4) — so a tremor user on a desktop is as safe as on mobile.

### Platform-specific considerations (Windows vs macOS vs Linux)

| Concern | Windows | macOS | Linux |
|---|---|---|---|
| Window controls | min/max/close **top-right** | traffic-lights **top-left** | min/max/close top-right (varies by DE) |
| Menu bar | In-window under title bar | **Native global menu bar** (top of screen) — map the §3.2 model to Electron's `Menu.setApplicationMenu` | In-window (or DE global menu) |
| Accelerator key | `Ctrl` | `⌘ Cmd` | `Ctrl` |
| Menu activation (keyboard) | `Alt` / `F10` focuses menu bar; mnemonics underlined | **No `Alt` mnemonics**; `Ctrl+F2` focuses the native menu bar | `Alt` / `F10` (DE-dependent) |
| System font | Segoe UI | SF Pro Text | system-ui (Cantarell/Noto/etc.) |
| Screen reader | **NVDA** + Chromium (primary target) | VoiceOver | Orca |
| High contrast | **Windows forced-colors** — respect `forced-colors: active`, don't suppress system colors | Increase-contrast setting | High-contrast themes |
| Text scaling | Honor OS 125/150/200% | Honor Display scaling | Honor DE scaling |
| Native dialogs | Use OS file/print dialogs for Export/Print | idem | idem |

- Use Electron's `process.platform` to pick title-bar control placement and accelerator labels
  (`CmdOrCtrl` in `Menu` accelerators handles the modifier automatically).
- Under `forced-colors: active`, fall back to system color keywords for borders/focus and never
  rely on the custom palette alone.
- All care-data writes show the **same two-step confirmation** on every platform.

---

## 7. Token reference appendix

### 7.1 CSS — light (`:root`)

```css
:root {
  /* color — brand & semantic (verbatim from mobile CC) */
  --color-bg: #F8F9FA;
  --color-surface: #FFFFFF;
  --color-surface-alt: #EBF0F6;
  --color-primary: #2E5C8A;
  --color-on-primary: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-muted: #595959;
  --color-border-subtle: #E0E0E0;
  --color-border-strong: #6B6B6B;
  --color-success: #4A7C59;
  --color-warning: #9E6E00;
  --color-error: #B34040;
  --color-info: #2E5C8A;

  /* color — desktop chrome */
  --chrome-titlebar: #2E5C8A;
  --chrome-titlebar-text: #FFFFFF;
  --chrome-menubar: #FFFFFF;
  --chrome-toolbar: #F8F9FA;
  --chrome-sidebar: #FFFFFF;
  --chrome-sidebar-active: #EBF0F6;
  --chrome-statusbar: #EBF0F6;
  --chrome-divider: #E0E0E0;
  --state-hover: rgba(46,92,138,0.08);
  --state-active: rgba(46,92,138,0.16);
  --state-selection: rgba(46,92,138,0.16);
  --focus-ring: #2E5C8A;
  --scrim: rgba(0,0,0,0.45);

  /* color — marketing / landing (pre-auth surfaces only) */
  --landing-bg: #F5EFE6;
  --headline-accent: #6B4522;
  --live-dot: #4ADE80;
  --error-surface: #FEF2F2;

  /* spacing */
  --space-0_5: 2px;  --space-1: 4px;  --space-1_5: 6px; --space-2: 8px;
  --space-3: 12px;   --space-4: 16px; --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;   --space-10: 40px;--space-12: 48px; --space-16: 64px;

  /* typography */
  --font-sans: "Inter","Segoe UI","SF Pro Text",system-ui,Roboto,sans-serif;
  --font-mono: ui-monospace,"SF Mono","Cascadia Code","Consolas",monospace;
  --type-h1: 700 24px/31px var(--font-sans);
  --type-h2: 600 20px/26px var(--font-sans);
  --type-title-lg: 600 18px/25px var(--font-sans);
  --type-title-md: 600 16px/24px var(--font-sans);
  --type-body-lg: 400 16px/24px var(--font-sans);
  --type-body-md: 400 15px/22px var(--font-sans);
  --type-body-sm: 400 13px/20px var(--font-sans);
  --type-label-lg: 600 16px/24px var(--font-sans);
  --type-label-md: 600 14px/21px var(--font-sans);
  --type-label-sm: 500 12px/18px var(--font-sans);
  --type-menu: 500 13px/18px var(--font-sans);
  --type-toolbar: 500 12px/16px var(--font-sans);
  --type-cell: 400 13px/18px var(--font-sans);
  --type-status: 400 12px/16px var(--font-sans);

  /* radius */
  --radius-xs: 2px; --radius-sm: 4px; --radius-md: 6px;
  --radius-lg: 8px; --radius-xl: 12px; --radius-pill: 999px;

  /* elevation */
  --elevation-0: none;
  --elevation-1: 0 1px 2px rgba(0,0,0,0.10);
  --elevation-2: 0 4px 8px rgba(0,0,0,0.14);
  --elevation-3: 0 8px 16px rgba(0,0,0,0.18);
  --elevation-4: 0 16px 32px rgba(0,0,0,0.22);

  /* density — dense default */
  --control-sm: 28px; --control-md: 32px; --control-lg: 40px;
  --control-critical: 44px;
  --row-height: 32px;
  --titlebar-h: 32px; --menubar-h: 28px; --toolbar-h: 44px; --statusbar-h: 26px;
  --sidebar-w: 256px; --sidebar-w-collapsed: 56px; --panel-w: 360px;
  --tap-min: 24px;

  /* motion */
  --motion-fast: 120ms; --motion-base: 150ms; --easing: cubic-bezier(0.2,0,0,1);
}
```

### 7.2 CSS — dark theme

```css
[data-theme="dark"] {
  --color-bg: #1A1B1E;
  --color-surface: #212225;
  --color-surface-alt: #2E3135;
  --color-primary: #5B8FC0;
  --color-on-primary: #0B1722;
  --color-text: #F2F3F5;
  --color-text-muted: #B0B4BA;
  --color-border-subtle: #34373B;
  --color-border-strong: #7C8089;
  --color-success: #5FA776;
  --color-warning: #E0B341;
  --color-error: #E0736F;
  --color-info: #5B8FC0;

  --chrome-titlebar: #16171A;
  --chrome-titlebar-text: #F2F3F5;
  --chrome-menubar: #212225;
  --chrome-toolbar: #1A1B1E;
  --chrome-sidebar: #212225;
  --chrome-sidebar-active: #2E3135;
  --chrome-statusbar: #16171A;
  --chrome-divider: #34373B;
  --state-hover: rgba(91,143,192,0.14);
  --state-active: rgba(91,143,192,0.24);
  --state-selection: rgba(91,143,192,0.24);
  --focus-ring: #7FB0E0;
  --scrim: rgba(0,0,0,0.6);

  --landing-bg: #1E1B16;
  --headline-accent: #C9A27A;
  --live-dot: #4ADE80;
  --error-surface: rgba(224,115,111,0.16);
}
```

### 7.3 CSS — Accessible (Tremor) density

```css
[data-density="accessible"] {
  --control-sm: 40px; --control-md: 44px; --control-lg: 56px;
  --control-critical: 64px;
  --row-height: 48px;
  --titlebar-h: 40px; --menubar-h: 36px; --toolbar-h: 56px; --statusbar-h: 32px;
  --sidebar-w: 288px; --sidebar-w-collapsed: 64px;
  --tap-min: 60px;
}
```

### 7.4 TypeScript tokens (for the `@renderer` app)

```ts
// apps/desktop/src/renderer/src/theme/tokens.ts  (suggested follow-up location)
export const tokens = {
  color: {
    bg: 'var(--color-bg)', surface: 'var(--color-surface)',
    surfaceAlt: 'var(--color-surface-alt)', primary: 'var(--color-primary)',
    onPrimary: 'var(--color-on-primary)', text: 'var(--color-text)',
    textMuted: 'var(--color-text-muted)', borderSubtle: 'var(--color-border-subtle)',
    borderStrong: 'var(--color-border-strong)', success: 'var(--color-success)',
    warning: 'var(--color-warning)', error: 'var(--color-error)', info: 'var(--color-info)',
  },
  landing: {
    bg: 'var(--landing-bg)', headlineAccent: 'var(--headline-accent)',
    liveDot: 'var(--live-dot)', errorSurface: 'var(--error-surface)',
  },
  space: { x0_5: 2, x1: 4, x1_5: 6, x2: 8, x3: 12, x4: 16, x5: 20, x6: 24, x8: 32, x10: 40, x12: 48, x16: 64 },
  radius: { xs: 2, sm: 4, md: 6, lg: 8, xl: 12, pill: 999 },
  control: { sm: 'var(--control-sm)', md: 'var(--control-md)', lg: 'var(--control-lg)', critical: 'var(--control-critical)' },
  chrome: { titlebarH: 'var(--titlebar-h)', menubarH: 'var(--menubar-h)', toolbarH: 'var(--toolbar-h)', statusbarH: 'var(--statusbar-h)', sidebarW: 'var(--sidebar-w)', panelW: 'var(--panel-w)' },
  motion: { fast: 120, base: 150 },
} as const;
```

### 7.5 Traceability

| Desktop token group | Mobile source | Pillar(s) |
|---|---|---|
| `--color-*` (brand/semantic) | `CC` in `apps/mobile/src/constants/theme.ts` | 1.4.1 contrast |
| `--type-*` content roles | `Typography` in `theme.ts` | Resize-to-200% |
| `--space-*` | `Spacing` in `theme.ts` (+ spec §3.3 steps) | — |
| `--control-critical` 44/64, Accessible mode | `primaryButtonHeight` / `minTouchTarget` in `accessibility.ts` | **1 Large Buttons** |
| Two-step confirm dialog | mobile confirm flow + spec §4.6 | **2 Confirm Actions** |
| 600ms debounce on care writes | `BUTTON_DEBOUNCE_MS` in `timings.ts` | **3 Ignore Double-Taps** |
| Fade-only ≤150ms, Reduce Motion default | spec §3.5 / §5 | **4 Reduce Motion** |
| Landing window + `--landing-bg`/`--headline-accent`/`--live-dot` (§3.9) | `(auth)/index.tsx`, `LANDING_BG`/`HEADLINE_BROWN` in `theme.ts` | — |
| Split-screen Login/Sign-up + `--error-surface` (§3.10) | `(auth)/login.tsx`, `(auth)/signup.tsx` | 2.1.1 keyboard, live-region errors |
| Hero image (§3.9.1) | `apps/mobile/assets/images/hero_photo.jpg` | 1.1.1 alt text |
| Logout + session, 401 auto sign-out (§3.11) | `features/auth/auth-context.tsx`, `(tabs)/profile/index.tsx` | **2 Confirm Actions** |
| Edit Profile form modal (§3.12) | `(tabs)/profile/edit.tsx`, `features/profile/profile-context.tsx` | **2 Confirm Actions** (discard guard) |

---

*Source of truth: `apps/mobile/src/constants/theme.ts`, `apps/mobile/src/features/accessibility/accessibility.ts`,
and `Documentation/careconnect-design-system-spec.docx`. Consume these tokens in the Electron
renderer at `apps/desktop` (`@renderer`). The four pillars are binding on desktop.*
