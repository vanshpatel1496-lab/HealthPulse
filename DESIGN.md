---
name: Clinical Calm
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4947'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#005e40'
  on-tertiary: '#ffffff'
  tertiary-container: '#007954'
  on-tertiary-container: '#99ffce'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  metric-num:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an environment of restorative clarity, quiet authority, and compassionate clinical precision. Designed for everyday individuals managing their health, reviewing critical vitals, and navigating medical records, the interface avoids anxiety-inducing tropes: no alarmist fluorescent alerts, cold bureaucratic table sprawl, or playful gimmicks.

The design movement combines **Minimalism** with **Modern Clinical Utility**:
- **Tone**: Reassuring, composed, scientifically grounded, and profoundly respectful of user cognitive load during stressful moments.
- **Visual Tenets**: Generous breathing room, structural rhythm, subtle tactile boundaries via crisp hairline strokes, and pure functional color coding.
- **Exclusions**: Strictly no glassmorphism, no artificial neomorphism, no neon highlights, and no dense legacy EHR-style data grids. Surfaces remain clean, deliberate, and restful.

## Colors

The palette is engineered to communicate medical rigor while keeping the emotional temperature low and soothing. Color is never purely decorative; it serves immediate triage comprehension and visual relief.

### Primary & Brand Accents
- **Primary Teal (`#0F766E`)**: Anchors primary interactions, navigation signifiers, and validated medical summaries.
- **Teal Hover / Interactive (`#0D9488`)**: Lifted states for buttons and interactive controls.
- **Teal Deep Pressed (`#115E59`)**: Active pressed states and deep clinical accents.

### Neutral & Surface Hierarchy
- **Canvas Base (`#F8FAFC`)**: Soft, cooling off-white eliminating stark glare.
- **Card Surface (`#FFFFFF`)**: Pure clinical white, creating crisp physical separation for modules.
- **Sub-surface / Wells (`#F1F5F9`)**: Neutral background for input fields, triage steps, and badge containers.
- **Border Default (`#E2E8F0`)**: Hairline boundary defining visual containment across cards and inputs.
- **Text Primary (`#0F172A`)**: High-contrast, fatigue-free deep slate for optimal legibility.
- **Text Secondary (`#475569`)**: Supporting context, metric units, and operational descriptions.
- **Text Muted (`#64748B`)**: Timestamps, table captions, and metadata labels.

### Semantic Triage System
Every semantic status is structured as a 3-part micro-system (Content / Tint / Border):
- **Normal / Healthy**: Text/Icon `#059669` | Background `#ECFDF5` | Border `#A7F3D0`
- **Warning / Attention**: Text/Icon `#D97706` | Background `#FFFBEB` | Border `#FDE68A`
- **Critical / Emergency**: Text/Icon `#DC2626` | Background `#FEF2F2` | Border `#FECACA`
- **Informational / Neutral**: Text/Icon `#0284C7` | Background `#F0F9FF` | Border `#BAE6FD`

## Typography

Typography relies on **Plus Jakarta Sans** across all levels. Its balanced geometric proportions, humanist letterforms, and generous apertures deliver rapid visual clarity, crucial for patients checking critical values under duress.

- **Numerics & Vitals**: Vital stats leverage `metric-num` with tabular figure settings (`tnum`) to keep rapidly updating biosensor feeds aligned.
- **Clinical Labels**: `label-sm` utilizes subtle tracking (`0.04em`) and uppercase transformation for physiological categorizations (e.g., `SPO2`, `BPM`, `SYSTOLIC`), preventing visual confusion with diagnostic prose.
- **Hierarchy Rules**: Primary titles must maintain strong weight balance (`600` or `700`) against relaxed body prose (`400`) with generous line height to prevent reader fatigue.

## Layout & Spacing

The layout model utilizes a fluid 12-column grid anchored by responsive outer bounds, establishing clear visual modules for vitals telemetry, medical timelines, and symptom intake flows.

- **Breakpoints**:
  - `Mobile` (< 640px): 4-column structure, `margin-sm` (16px), single-column triage progression.
  - `Tablet` (640px – 1024px): 8-column layout, `gutter-sm` (16px), dual-column vitals card pairing.
  - `Desktop` (> 1024px): 12-column layout capped at `1280px` max-width container, `gutter` (24px), `margin` (32px), persistent contextual sidebar.
- **Rhythm Philosophy**: Dense layouts are prohibited. Modules rely on internal component padding (`space-lg`) to give clinical observations room to be read calmly. Groupings of related vitals maintain tight inner coupling (`space-xs` and `space-sm`) surrounded by calm macro negative space (`space-xl`).

## Elevation & Depth

Visual hierarchy is maintained through **tonal separation** and **ambient diffusion**, avoiding heavy structural shadows that create digital noise.

- **Layer 0 (Canvas)**: Background color `#F8FAFC`. Zero elevation.
- **Layer 1 (Card & Module Foundation)**: Background `#FFFFFF`, bordered with 1px solid `#E2E8F0`. Paired with an ultra-soft ambient shadow: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Layer 2 (Interactive Floating / Active Cards)**: Background `#FFFFFF`, 1px solid `#CBD5E1`. Shadow: `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`. Used when dragging reports, toggling symptom flows, or focusing on anomalous vitals.
- **Layer 3 (Modals, Triage Sheets, Drawers)**: Background `#FFFFFF`, crisp hairline border `#E2E8F0`. Shadow: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)`. Backdropped by an accessible solid scrim: `rgba(15, 23, 42, 0.45)`.
- **Depth Contrast**: Depth relies primarily on contrast between the `#F8FAFC` canvas and `#FFFFFF` cards, framed with 1px border geometry rather than heavy dark drop shadows.

## Shapes

The design system adopts a **Rounded (`roundedness: 2`)** geometry profile to soften clinical clinical severity while projecting modern precision.

- **Base Radius (`0.5rem` / 8px)**: Inputs, segmented tabs, dropdown menus, and list items.
- **Medium Radius (`0.75rem` / 12px)**: Action buttons, notification banners, and triage choice tiles.
- **Large Radius (`1rem` / 16px)**: Standard dashboard widget cards, vital monitors, and telemetry modules.
- **Extra-Large Radius (`1.5rem` / 24px)**: High-level overview containers, document vault drop-zones, and modal dialog envelopes.
- **Full Radius (`9999px`)**: Status chips, metric pill badges, avatar containers, and floating urgent assistance buttons.

## Components

### Buttons
- **Primary**: Solid Teal (`#0F766E`), text `#FFFFFF`, rounded 12px, font `label-md`. Hover shifts to `#0D9488`. Active/pressed states drop to `#115E59`.
- **Secondary / Ghost**: Background `#FFFFFF`, 1px border `#E2E8F0`, text `#0F172A`. Hover to `#F8FAFC` and border `#CBD5E1`.
- **Destructive / Emergency Callout**: Background `#DC2626`, text `#FFFFFF`. Hover to `#B91C1C`. Strictly reserved for urgent triage and crisis triggers.
- **Sizing**: Default height 44px (touch-safe standard), with 20px horizontal padding.

### Chips & Status Badges
- **Micro Badges**: Full pill (`rounded-full`), height 24px, horizontal padding 10px. Always composed with an 8px circular status indicator or semantic glyph alongside `label-sm` text.
- **Semantic Pairing**:
  - *Stable*: `#ECFDF5` background, `#059669` text, `#A7F3D0` border.
  - *Review*: `#FFFBEB` background, `#D97706` text, `#FDE68A` border.
  - *Urgent*: `#FEF2F2` background, `#DC2626` text, `#FECACA` border.

### Input Fields & Search
- **Structure**: Surface `#FFFFFF`, border 1px `#E2E8F0`, height 46px, radius 8px, typography `body-md`.
- **States**: Focus state triggers a clean 2px outline of `#0F766E` with an inner 1px border `#0F766E`, no blurred outer glow. Error state uses border `#DC2626` with matching inline helper text.
- **Vault Search / Symptoms Search**: Integrated leading medical search icon in `#64748B`, trailing clear button, and subtle placeholder in `#94A3B8`.

### Checkboxes, Radios, & Toggles
- **Toggles**: Used for real-time sensor sync and notification rules. Width 44px, height 24px, pill-shaped. Inactive background `#E2E8F0`; active background `#0F766E`. Sliding thumb in pure white with soft 1px shadow.
- **Triage Radio Cards**: Multi-choice symptom checklists styled as clickable cards with 1px `#E2E8F0` borders, transitioning to `#0F766E` border and `#F0FDFA` background when selected.

### Vital Cards & Dashboard Widgets
- **Structure**: 16px corner radius, pure white surface, 1px `#E2E8F0` border, `space-lg` internal padding.
- **Header**: Top row anchors the clinical metric title (`label-md` in `#475569`), accompanied by a semantic status pill badge on the top right.
- **Metric Reading**: Large high-contrast value (`metric-num` in `#0F172A`), immediate trailing unit label (`body-md` in `#64748B`), and sparkline or contextual baseline range beneath.

### Document Vault Records
- **Row & Card Variants**: Displays document type icon (PDF/Lab/Prescription), document name in `headline-sm`, provider tag, and date metadata. Includes an inline action row with secure preview and export affordances.