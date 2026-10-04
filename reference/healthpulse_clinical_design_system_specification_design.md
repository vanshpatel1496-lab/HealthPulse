# HealthPulse Clinical Design System — DESIGN.md Specification
**Document Version:** 2.0.0 • **Target Platforms:** React 19 + Tailwind CSS v3.4+ • **Ecosystem:** Google Antigravity & Web Standards  
**Source of Truth:** Approved HealthPulse Production Screens (Patient Vitals Dashboard, Medical Document Vault, Extraction Split-View, Symptoms & AI Triage, Completed Session & Emergency Studio)

---

## 1. Product Design Principles

HealthPulse is an AI-powered personal health companion engineered for everyday individuals, chronic care patients, and family caregivers. It bridges patient wearable telemetry, clinical laboratory records, and symptom guidance into a single, cohesive, reassuring workspace.

### Core Principles
1. **Calm:** Medical metrics and health events frequently cause cognitive overload and anxiety. Interfaces must exude serenity through generous breathing room, muted neutral surfaces, soft borders, and an absence of frantic UI noise.
2. **Trustworthy:** Rigorous adherence to HIPAA AES-256 data protection visual cues, clear audit trails, and transparent data origin (differentiating raw clinical scans from algorithmic parsing).
3. **Patient-Friendly:** Designed for humans of all digital literacy levels. Tabular laboratory numbers and complex triage trees are translated into plain-language summaries without sacrificing clinical precision.
4. **Clinically Professional:** Grounded in evidence-based healthcare conventions. Uses verified clinical ranges, standard SI and imperial biometric units (mmHg, bpm, mg/dL, %), and standard clinical terminology.
5. **Accessible (WCAG 2.1 AA / AAA):** High-contrast typography, focus rings, minimum 44×44px interactive tap targets, and multi-modal sensory cues.
6. **Privacy-Conscious:** Prominent indicators of local encryption, zero-knowledge storage, and patient ownership of data across every view.
7. **Clear Rather Than Visually Dense:** Prioritize progressive disclosure. Surface primary biometric values and actionable alerts immediately; tuck technical logs, raw HL7 code, and deep transcripts behind secondary accordions or detail drawers.
8. **Informational Rather Than Diagnostic:** HealthPulse is an organizational and guidance tool, **not** a physician. Interfaces must never deliver definitive clinical diagnoses or prescribe medication regimens.

### Anti-Patterns (Strictly Prohibited)
* **No Neon or Cyberpunk Aesthetics:** Do not use high-saturation glowing borders, electric cyans, or pitch-black gaming HUD motifs.
* **No Excessive Gradients or Glassmorphism:** Avoid blurry `backdrop-filter` frosted glass layers that degrade text contrast or reduce legibility on low-end devices.
* **No Gamification:** Never display "Health XP", gaming medals, streak flame animations, or superficial reward loops for biometric compliance.
* **No Dense Enterprise Data Grids:** Avoid horizontal scroll-heavy, compact spreadsheet tables. Use human-readable cards and clean rows with explicit labels.
* **No Gratuitous Medical Imagery:** Avoid generic 3D red blood cells, stylized cartoon stethoscopes, or stock photos of doctors with clipboards. Focus on clean SVG iconography and patient-specific records.

---

## 2. Brand Tokens

Grounded clinical teal conveying trust, serene precision, and human-centered modern medical authority without coldness or clinical sterility.

| Token Name | Tailwind Class / CSS Variable | Hex / Value | Description & Intended Usage | Foreground / Text Pairing | Accessibility & Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `brand-primary` | `bg-teal-700` / `text-teal-700` | `#0F766E` | Primary actions (CTA, active navigation pill, brand mark, key selection rings). | White (`#FFFFFF`) | 7.3:1 (Exceeds WCAG AAA) |
| `brand-primary-hover` | `hover:bg-teal-800` | `#115E59` | Hover state for primary buttons, active interactive links, and interactive cards. | White (`#FFFFFF`) | 8.8:1 (WCAG AAA) |
| `brand-primary-active` | `active:bg-teal-900` | `#134E4A` | Pressed / active click state for primary buttons. | White (`#FFFFFF`) | 10.4:1 (WCAG AAA) |
| `brand-primary-subtle` | `bg-teal-50` | `#F0FDFA` | Subtle background for active sidebar navigation, selected tags, and primary container fills. | Primary Teal (`#0F766E`) | 7.1:1 (WCAG AAA) |
| `brand-primary-border` | `border-teal-200` | `#99F6E4` | Hairline border for primary tinted cards, chips, and selected states. | N/A (Decorative border) | 3:1 against white |
| `brand-primary-foreground`| `text-white` | `#FFFFFF` | Text and icon glyphs rendered inside primary teal buttons and active badges. | On Teal-700 (`#0F766E`)| 7.3:1 (WCAG AAA) |

---

## 3. Neutral Surface & Text System

Engineered for sensitive patient medical data, prioritizing comfortable visual hierarchy, calm contrast, and eliminating glare or eye strain across long sessions.

| Semantic Token | Tailwind Class | Hex Value | Usage & Context |
| :--- | :--- | :--- | :--- |
| `surface-app` | `bg-slate-50` | `#F8FAFC` | Global page backdrop and canvas canvas underlay. |
| `surface-card` | `bg-white` | `#FFFFFF` | Primary elevated cards, data modules, dialogs, and split-screen viewers. |
| `surface-elevated` | `bg-white shadow-sm` | `#FFFFFF` | Dropdowns, popovers, sticky headers, and elevated bottom action docks. |
| `surface-subtle` | `bg-slate-100` | `#F1F5F9` | Inset metrics, nested stat blocks, table headers, and transcript callouts. |
| `text-primary` | `text-slate-900` | `#0F172A` | Primary headings, primary vital values, patient names, and dialog titles. |
| `text-secondary` | `text-slate-700` | `#334155` | Body copy, card descriptions, navigation labels, and clinical observations. |
| `text-muted` | `text-slate-500` | `#64748B` | Timestamps, clinical metadata, units (e.g., "bpm", "mmHg"), and helper copy. |
| `border-hairline` | `border-slate-200` | `#E2E8F0` | Default card borders, structural dividers, grid lines, and table separators. |
| `border-subtle` | `border-slate-100` | `#F8FAFC` | Inner separators between modular rows or nested list items. |
| `state-disabled-bg` | `bg-slate-100` | `#F1F5F9` | Inactive buttons, unsynced inputs, disabled pagination controls. |
| `state-disabled-text`| `text-slate-400` | `#94A3B8` | Muted unclickable labels and placeholder text. |

---

## 4. Healthcare Semantic Tokens (Dual-Coded & WCAG Compliant)

> **Clinical Safety Invariant:**  
> **Never communicate healthcare status using color alone.**  
> Every status indicator, notification badge, and warning card **must** couple an explicit text label (e.g., "Optimal", "Review Needed"), an associated semantic SVG icon glyph (checkmark, alert triangle, info circle, emergency star), and a high-contrast badge background.

| Semantic Status | Main Color | Subtle Background | Border Color | Foreground Text | Icon Glyph & Color | Intended Clinical Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NORMAL / SUCCESS** | `#059669`<br>`emerald-600` | `#ECFDF5`<br>`emerald-50` | `#A7F3D0`<br>`emerald-200` | `#065F46`<br>`emerald-800` | `check_circle`<br>`#10B981` | Biometrics inside clinical envelope (e.g., SpO2 99%, BP 118/78), verified healthy baseline, completed sync. |
| **ATTENTION / WARNING** | `#D97706`<br>`amber-600` | `#FFFBEB`<br>`amber-50` | `#FDE68A`<br>`amber-200` | `#92400E`<br>`amber-800` | `warning`<br>`#F59E0B` | Biometrics slightly out of range, upcoming prescription refills, mild low fasting glucose, review needed. |
| **HIGH PRIORITY** | `#EA580C`<br>`orange-600` | `#FFF7ED`<br>`orange-50` | `#FED7AA`<br>`orange-200` | `#9A3412`<br>`orange-800` | `priority_high`<br>`#F97316` | Significant vital deviations, high acute fever, escalating headache, prompt evaluation advised within 12–24h. |
| **EMERGENCY** | `#E11D48`<br>`rose-600` | `#FFF1F2`<br>`rose-50` | `#FECDD3`<br>`rose-200` | `#9F1239`<br>`rose-800` | `emergency`<br>`#F43F5E` | Critical red flags (chest pressure, severe dyspnea, stroke signs, thunderclap headache), 24/7 care / 911 line. |
| **INFORMATIONAL** | `#0284C7`<br>`sky-600` | `#F0F9FF`<br>`sky-50` | `#BAE6FD`<br>`sky-200` | `#075985`<br>`sky-800` | `info`<br>`#0EA5E9` | HIPAA compliance notice, telemetry sync timestamps, OCR extraction guidance, lab requisition orders. |

---

## 5. Triage Urgency Tokens

### Lifecycle Status vs. Medical Triage Urgency
A fundamental architecture requirement of HealthPulse is the strict ontological separation between **Session Status** (intake workflow progress) and **Clinical Triage Urgency** (health severity).

```
+-----------------------------------------------------------------------------------+
| CLINICAL SEPARATION RULE:                                                         |
| Session Status  -> In Progress | Completed | Incomplete (Draft)                   |
| Triage Urgency  -> Low | Medium | High | Emergency                                |
|                                                                                   |
| Example:                                                                          |
| "Session #HT-8821: Session: Completed  *  Urgency: Medium"                       |
| Never collapse these two concepts into a single badge or ambiguous status string. |
+-----------------------------------------------------------------------------------+
```

### Urgency Matrix

| Urgency Level | Token | Badge Treatment | Icon | Canonical Supporting Wording | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LOW** | `urgency-low` | `bg-emerald-50 text-emerald-800 border-emerald-200` | Shield Checkmark | *"Your reported symptoms do not currently indicate an urgent pattern based on the information provided."* | Continue monitoring; routine care if persistent. |
| **MEDIUM** | `urgency-medium` | `bg-amber-50 text-amber-800 border-amber-200` | Alert Triangle | *"Your symptoms may be appropriate to discuss with a healthcare professional within 24–48 hours."* | Find professional care; schedule routine consultation. |
| **HIGH** | `urgency-high` | `bg-orange-50 text-orange-800 border-orange-200` | Acute Warning | *"Your reported symptoms may warrant prompt medical evaluation within 12–24 hours."* | Prompt evaluation; review warning signs. |
| **EMERGENCY**| `urgency-emergency`| `bg-rose-50 text-rose-800 border-rose-200 ring-2 ring-rose-500/20` | Emergency Pulse Star | *"Your reported symptoms may require immediate medical attention. Seek emergency care immediately."* | Call 911 / 24/7 Emergency Care Line. |

---

## 6. Typography System (Plus Jakarta Sans)

Clean, human-centered geometric sans-serif with open apertures and optimized tabular numeral support for dense health telemetry.

* **Primary Font Family:** `'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Monospace Font (Code/Raw Lab Identifiers):** `'JetBrains Mono', 'Fira Code', monospace`

| Style / Role | Size | Weight | Tracking & Line Height | Color | Usage & Clinical Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title** | `text-3xl` (30px) | `font-bold` (700) | `tracking-tight leading-tight` | `text-slate-900` | Main view headers ("Elena's Health Overview", "Medical Documents"). |
| **Section Heading** | `text-lg` (18px) | `font-semibold` (600) | `tracking-tight leading-snug` | `text-slate-900` | Module titles ("Physiological Trajectory", "Diagnostic Vault Hub"). |
| **Card Title** | `text-base` (16px) | `font-semibold` (600) | `leading-normal` | `text-slate-900` | Vital card names ("Blood Pressure", "Resting Heart Rate"). |
| **Body (Default)** | `text-sm` (14px) | `font-normal` (400) | `leading-relaxed` | `text-slate-700` | General narrative copy, observations, message chat bubbles. |
| **Supporting Text**| `text-xs` (12px) | `font-normal` (400) | `leading-normal` | `text-slate-500` | Baseline reference text ("Circadian range 97–100%"), timestamps. |
| **Metric Value** | `text-3xl` to `text-4xl` (32px–36px) | `font-bold` (700) | `tabular-nums tracking-tight leading-none` | `text-slate-900` | Primary vital numbers ("118/78", "64", "99%"). High visual priority. |
| **Metric Unit** | `text-sm` (14px) | `font-medium` (500) | `leading-normal` | `text-slate-500` | Accompanying unit ("mmHg", "bpm", "mg/dL"). Placed baseline-aligned. |
| **Table / Header** | `text-xs` (12px) | `font-semibold` (600) | `tracking-wider uppercase` | `text-slate-500` | Laboratory column headers ("TEST NAME", "RESULT", "REFERENCE"). |
| **Button Label** | `text-sm` (14px) | `font-semibold` (600) | `tracking-normal` | Varies | Primary, secondary, and emergency button triggers. |
| **Status Badge** | `text-xs` (12px) | `font-semibold` (600) | `tracking-normal` | Semantic text | Dual-coded indicator tags ("Optimal", "In Progress", "Completed"). |
| **Caption / Legal**| `text-xs` (11px–12px)| `font-normal` (400) | `leading-relaxed` | `text-slate-400` | Disclaimers, encryption standards, HIPAA footer notices. |

---

## 7. Spacing & Grid System

Based on a strict 4px/8px incremental scale ensuring consistent vertical rhythm and component proportion.

| Spacing Token | Pixels | Tailwind Utility | Intended Usage |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | `p-1`, `gap-1`, `m-1` | Micro-spacing between icon and badge text. |
| `space-2` | 8px | `p-2`, `gap-2`, `m-2` | Badge internal padding, chip spacing, breadcrumb gaps. |
| `space-3` | 12px | `p-3`, `gap-3`, `space-y-3` | Compact card gaps, internal list item spacing. |
| `space-4` | 16px | `p-4`, `gap-4`, `space-y-4` | Default element margin, toolbar padding, dialog internal gaps. |
| `space-5` | 20px | `p-5`, `gap-5`, `space-y-5` | Compact card internal padding (vitals, alert callouts). |
| `space-6` | 24px | `p-6`, `gap-6`, `space-y-6` | Standard container padding, primary card internal padding. |
| `space-8` | 32px | `p-8`, `gap-8`, `space-y-8` | Major section vertical separation, main dashboard container margins. |
| `space-10` | 40px | `p-10`, `gap-10` | Page outer wrapper padding on wide desktop displays. |

---

## 8. Radius & Elevation System

Reflects soft, friendly, organic roundness that eliminates clinical austerity without feeling childish.

### Corner Radii
* `radius-pill`: `9999px` (`rounded-full`) — Status badges, avatar frames, pill buttons, filter chips.
* `radius-btn`: `12px` (`rounded-xl`) — Action buttons, inputs, dropdown menus, textareas.
* `radius-input`: `10px` (`rounded-lg`) — Search bars, form fields, quick-response chips.
* `radius-card`: `16px` (`rounded-2xl`) — Primary cards, vital containers, split-view panels.
* `radius-panel`: `24px` (`rounded-3xl`) — Large modal sheets, emergency floating alerts, drawer surfaces.

### Elevation (Subtle & Clinical)
Shadows must remain airy and desaturated to avoid visual heaviness.
* **Surface (Base):** `shadow-none border border-slate-200` — Standard dashboard cards resting on `surface-app`.
* **Card Elevation:** `shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] border border-slate-200` — Standard modular cards.
* **Elevated Surface (Hover/Dropdown):** `shadow-[0_4px_12px_0_rgba(15,23,42,0.06)] border border-slate-200` — Hovering cards, menus.
* **Emergency Alert:** `shadow-[0_8px_24px_-4px_rgba(225,29,72,0.12)] border border-rose-200` — Urgent triage callout.

---

## 9. Persistent Navigation & Application Shell

### Structure
* **Left Persistent Sidebar:** 260px fixed desktop width.
  * **Brand Header:** HealthPulse emblem (`Modern minimalist medical health pulse emblem with a clean geometric cross and gentle vital wave mark in teal and soft seafoam green, professional and calming vector symbol for HealthPulse.. Brand logo. - Primary color: #0f766e
- Font: plusJakartaSans
- Mode: light
- Roundness: rounded-md
`) + wordmark + "Personal Health & Records" subtitle.
  * **Patient Sync Bar:** Telemetry sync pulse dot + "Elena Rostova • Synced today at 08:30 AM".
  * **Primary Navigation List:**
    1. **Dashboard** (Icon: `dashboard` / `grid_view`)
    2. **Medical Documents** (Icon: `description` / `folder` + pill badge `12`)
    3. **Symptoms & Triage** (Icon: `chat_bubble` / `stethoscope`)
    4. **Insights & Trends** (Icon: `trending_up` / `show_chart`)
    5. **Settings** (Icon: `settings` / `tune`)
  * **Persistent Emergency Drawer:** Fixed callout card at sidebar bottom:  
    `Emergency Care: Instant connection to 24/7 triage medical hotline` + prominent red CTA button `"Call 24/7 Line"`.
* **Top Global Header:**
  * **HIPAA Status:** Shield icon + "Encrypted HIPAA Vault • AES-256".
  * **Care Hotline Action:** Red telephone icon + "24/7 Care Hotline".
  * **Notification Bell:** Unread notification dot indicator.
  * **User Profile Pill:** Elena Rostova avatar (`Professional, friendly headshot portrait of an adult patient in their 30s with gentle natural smile, wearing neutral casual clothing, soft studio lighting, clean bright background, realistic photography`) + "Patient Verified" status + dropdown chevron.

### States
* **Active Sidebar Item:** `bg-teal-700 text-white font-semibold shadow-sm rounded-xl` with high-contrast icon.
* **Inactive Sidebar Item:** `text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium rounded-xl transition-colors`.
* **Keyboard Focus State:** Visible outer teal ring `focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2`.

---

## 10. Button System

| Button Variant | Background | Foreground Text | Border | Hover State | Active State | Disabled State | Intended Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | `bg-teal-700` | `text-white` | None | `bg-teal-800` | `bg-teal-900` | `bg-slate-100 text-slate-400` | Key triggers ("Upload Document", "New Symptom Check", "Confirm Extracted Data"). |
| **Secondary** | `bg-white` | `text-slate-700` | `border-slate-200` | `bg-slate-50 text-slate-900` | `bg-slate-100` | `bg-slate-50 text-slate-300` | Supporting actions ("View Details", "Download Summary", "Edit Symptoms"). |
| **Tertiary / Ghost**| `bg-transparent` | `text-teal-700` | None | `bg-teal-50` | `bg-teal-100` | `text-slate-300` | Inline navigation links, "Review Reading", "Cancel". |
| **Destructive** | `bg-white` | `text-rose-600` | `border-rose-200` | `bg-rose-50 text-rose-700` | `bg-rose-100` | `text-slate-300` | "Delete Session", "Flag Error", "Remove Document". |
| **Emergency** | `bg-rose-600` | `text-white` | None | `bg-rose-700` | `bg-rose-800` | N/A | Strictly reserved for urgent health actions: "Call 24/7 Line", "Get Emergency Help". |

---

## 11. Form Controls & Interactive Inputs

* **Text Fields & Search Inputs:** `h-11 px-4 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all`.
* **Chat Message Composer:** Multiline expandable textarea with integrated voice dictation trigger (`mic` icon), HIPAA confidentiality reassurance footnote, and prominent `Send` button.
* **Severity Selection Chips:** Multi-option buttons for symptom assessment:
  * **Mild (1–3):** `border-slate-200 text-slate-700 hover:border-teal-500`
  * **Moderate (4–6):** `border-amber-300 bg-amber-50/50 text-amber-900`
  * **Severe (7–10):** `border-rose-300 bg-rose-50/50 text-rose-900`
* **File Upload Drop Zone:** Dashed border container (`border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 p-8 text-center hover:border-teal-500 hover:bg-teal-50/20 transition-all`). Includes explicit supported file formats (`PDF, DICOM, JPG up to 25MB`) and drag-and-drop affordance.
* **Validation & Error Standards:** Form validation errors must **never** rely solely on red border lines. Always render an explicit warning icon and human-readable explanation message beneath the input field.

---

## 12. Status Badge Taxonomy

Badges are divided into three non-overlapping clinical domains:

### A. Health & Biometric Status
* `status-optimal` / `status-normal`: Emerald badge + Checkmark (`Optimal`, `Stable`, `Normal`).
* `status-attention` / `status-warning`: Amber badge + Alert Triangle (`Mild Low`, `Review Needed`, `Borderline`).
* `status-critical` / `status-emergency`: Rose badge + Emergency Pulse Star (`Critical`, `Immediate Action`).

### B. Document Processing Lifecycle
* `doc-processing`: Sky-blue badge + Spinner / Refresh glyph (`Processing OCR...`).
* `doc-extracted`: Emerald badge + Document text glyph (`Extracted & Structured`).
* `doc-needs-review`: Amber badge + Search glyph (`Review Required`).
* `doc-failed`: Rose badge + Cancel glyph (`Extraction Error`).

### C. Session & Triage Flow Lifecycle
* `session-in-progress`: Sky badge + Live sync dot (`In Progress`).
* `session-completed`: Emerald badge + Shield checkmark (`Completed`).
* `session-incomplete`: Slate badge + Clock glyph (`Draft / Paused`).

---

## 13. Modular Card System

Every card in HealthPulse follows a strict internal visual hierarchy:

```
+-------------------------------------------------------------------------+
| [Header] Semantic Icon / Subtitle Label -------- [Top-Right Status Badge]|
|                                                                         |
| [Primary Value] Large Tabular Number (32-36px) [Unit / Delta Indicator] |
|                                                                         |
| [Context / Sparkline] Baseline Range Envelope or Micro-Trend Visual     |
|                                                                         |
| [Footer Action / Timestamp] Secondary text link or sync status          |
+-------------------------------------------------------------------------+
```

### Card Types
1. **Vital Card:** 16px radius, `p-5`, featuring metric number, target circadian envelope, and 5-bar sparkline.
2. **Health Summary Card:** Hero banner summarizing baseline telemetry consistency ("All baseline telemetry readings are consistent with previous 30-day medians").
3. **Health Trend Card:** Features continuous multi-curve trajectory chart (Systolic vs Pulse) with accessible legend and time filters.
4. **Diagnostic Vault Hub Card:** Rapid access list of pending records with chevron links.
5. **Document Card:** Grid or table row showing document title, issuer (Quest Diagnostics, St. Jude), date, category tag, and extraction status.
6. **Split-Screen Extractor Card:** Dual-panel container displaying source scan document side-by-side with structured clinical values.
7. **Triage Summary Card:** Structured guidance card containing observations, severity, urgency pill, and next steps.
8. **Emergency Card:** Rose-tinted callout container with 24/7 hotline direct dial trigger.

---

## 14. Patient Vitals Dashboard Rules

1. **Hierarchy:** Metric values (`118/78`, `64`, `99%`, `92`) are always primary. Sparklines and mini bar graphs are secondary visual reinforcement.
2. **Envelope Guidance:** Never present an isolated number without clinical context. Always display the patient's individual baseline target range (e.g., `Resting range 60–72 bpm`, `HbA1c target < 5.7%`).
3. **Trajectory Chart Standards:**
   - Multi-metric curves must use distinct line treatments (e.g., solid teal stroke for Systolic, dashed blue stroke for Pulse). Never differentiate metrics by color alone.
   - Fill areas under curves must be soft semi-transparent washes (`teal-500/10`) to maintain background readability.
4. **Action Placement:** Primary actions ("Log Vitals", "Ask Clinical Triage") sit in the top-right header actions group.

---

## 15. Medical Document Vault Rules

1. **Split-Screen OCR Architecture:**
   - Left Column: Authentic source document viewer with page zoom, pan, and page selector controls.
   - Right Column: AI Extraction preview presenting tabular fields grouped by clinical category.
2. **Extraction Action Bar:**
   - Extracted values must support four standard actions:
     - `Confirm Extracted Data` (Primary Teal CTA)
     - `Edit Values` (Secondary outline button)
     - `Flag OCR Error` (Secondary destructive button)
     - `View in Original` (Highlight coordinates on source document)
3. **Document Categories:**
   - Lab Reports (Hematology, Metabolic, Lipid panels)
   - Prescriptions & Medication Orders
   - Clinical Discharge Summaries & Visit Notes
   - Imaging & Radiology Reports

---

## 16. Medical Extraction Rules

### A. Laboratory Panels (e.g., CBC Blood Panel)
Must render tabular rows containing:
* **Test Name:** (e.g., White Blood Cell count, Hemoglobin, Platelets)
* **Result & Unit:** Rendered in bold tabular figures (e.g., `14.2 g/dL`)
* **Reference Range:** Plain-language envelope (e.g., `12.0 – 16.0 g/dL`)
* **Status Badge:** Explicit `Normal`, `Low`, or `High` badge with semantic color and icon.

### B. Prescription Orders
Must render structured cards containing:
* **Medication Name & Generic:** (e.g., Amoxicillin 500mg)
* **Dosage & Route:** (e.g., 1 capsule by mouth)
* **Frequency & Timing:** (e.g., Every 8 hours with meals)
* **Duration & Refills:** (e.g., 10 days • 0 refills remaining)
* **Prescribing Physician & NPI:** (e.g., Dr. Aris Mehta, MD)

### C. Clinical Discharge Summaries
Must render grouped accordions containing:
* **Hospital Stay Dates & Facility:** (e.g., St. Jude Medical Group)
* **Explicit Source Diagnoses:** Verbatim quotes from physician discharge notes.
* **Procedures Performed & Follow-Up Schedule:** Explicit timeline instructions.

---

## 17. Symptoms & Triage Rules

1. **Separation of Voice:**
   - **Patient Messages:** Displayed on right side with dark teal background (`bg-teal-700 text-white rounded-2xl rounded-br-sm`).
   - **HealthPulse Assistant:** Displayed on left side with clean white background (`bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm`) accompanied by the bot emblem avatar.
2. **Structured Intake Stream:** Real-time intake summaries update dynamically as the user answers questions (e.g., symptom, onset, severity, body region, triggers).
3. **Non-Diagnostic Constraint:** The assistant engine must explicitly state: *"I can help you organize your symptoms and identify how urgently you may need care. Please remember that I do not provide a medical diagnosis."*

---

## 18. Triage Summary Rules

Every generated Triage Summary **must** include the following 9 sections in exact hierarchy:

1. **Urgency Banner:** Dual-coded urgency badge (`Low`, `Medium`, `High`, or `Emergency`).
2. **Intake Status:** Verification chip (`Session: Completed` or `Draft Saved`).
3. **Structured Reported Symptoms:** Tabular chips showing Main Symptom, Started, Severity Tier, Associated Symptoms, Progression, and Context.
4. **Key Clinical Observations:** Purely observational statements summarizing the patient's reported narrative (e.g., *"You reported a moderate frontal headache beginning this morning (~4 hours ago)"*).
5. **Suggested Next Step:** Clear, non-prescriptive guidance (e.g., *"Consider contacting a healthcare professional, especially if symptoms continue or worsen over the next 24 to 48 hours."*).
6. **Collapsible Warning Signs ("Seek urgent emergency help if..."):** Highlighting red-flag physiological symptoms requiring immediate intervention.
7. **Assessment Limitations:** Explicit reminder that guidance is preliminary and based only on user-reported answers.
8. **Summary Actions:** Clean action bar with `Download PDF Summary`, `Save to Health Vault`, `Review Symptoms`, and `Start New Symptom Check`.
9. **Legal & Medical Safety Disclaimer.**

### Wording Constraints
* **Approved Wording:** *"You reported..."*, *"Based on the symptoms provided..."*, *"Consider discussing with a healthcare professional..."*, *"Preliminary guidance suggests..."*
* **Forbidden Wording:** *"You have migraine"*, *"You are suffering from hypertension"*, *"This confirms infection"*, *"You need to take ibuprofen"*.

---

## 19. Emergency UI Rules

When emergency symptoms or red flags are detected:
1. **Localization Rule:** **Do not turn the entire screen or viewport red.** Turning the page red induces patient panic and degrades visual accessibility.
2. **Component Treatment:** Render a high-priority, rose-tinted banner (`bg-rose-50 border border-rose-200`) with emergency star icon.
3. **Action Priority:** Provide a prominent, high-contrast Emergency button (`bg-rose-600 hover:bg-rose-700 text-white`) that initiates a call to the 24/7 Care Hotline or 911.
4. **Context Preservation:** Keep the patient's reported symptoms and transcript accessible so the patient or first responder can quickly review the timeline.

---

## 20. Healthcare Safety Messaging Standards

All disclaimers must be legible (`text-xs text-slate-500`) and styled with a secondary security or legal icon.

* **Document Vault Disclaimer:**  
  *"Extracted information helps organize your health records and may contain errors. Refer to the original medical document and consult a qualified healthcare professional for medical interpretation."*
* **AI Clinical Triage Disclaimer:**  
  *"HealthPulse provides preliminary health guidance and does not provide a medical diagnosis or replace a qualified healthcare professional. If you are experiencing a life-threatening medical emergency, call 911 immediately."*
* **Security & HIPAA Safeguard:**  
  *"All biometric telemetry and uploaded records are encrypted client-side using AES-256 standard and stored in compliance with HIPAA privacy regulations."*

---

## 21. Accessibility Rules (WCAG 2.1 AA/AAA)

1. **Color Contrast:**
   - Normal text: Minimum 4.5:1 contrast against surface.
   - Large headings and metric values: Minimum 7:1 contrast.
   - Status badge text against badge background: Minimum 7:1 contrast (WCAG AAA).
2. **Touch Targets:** All interactive triggers (buttons, chips, table row actions, navigation items) must meet or exceed `min-h-[44px]` and `min-w-[44px]`.
3. **Keyboard Focus:** Unbroken focus order with high-visibility focus indicators (`focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2`).
4. **Screen Reader Support:** All charts, sparklines, and status badges must contain explicit `aria-label` descriptions (e.g., `aria-label="Blood pressure: 118 over 78 mmHg, optimal baseline"`).

---

## 22. Responsive Breakpoints & Adaptive Layouts

| Breakpoint | Window Width | Dashboard Behavior | Document Vault Behavior | Symptoms & Triage Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Desktop** | `≥ 1024px` (`lg:`) | Persistent 260px sidebar; 4-column metric cards; side-by-side trajectory chart and vault hub. | Split-screen viewer (50% source document scan, 50% extracted data table). | Left column symptom history (320px); right column active chat stream and triage summary. |
| **Tablet** | `768px – 1023px` (`md:`) | Collapsible icon sidebar; 2×2 metric card grid; stacked chart and vault cards. | Adaptive split-view or full-width document with toggleable extraction drawer. | Collapsible symptom history sheet; full-width conversational intake. |
| **Mobile** | `< 768px` (`sm:`) | Top mobile app bar with hamburger menu; 1-column vertically stacked metric cards. | Tabbed segmented control: Tab 1 *"Original Document"*, Tab 2 *"Extracted Values"*. | Triage summary stacks vertically beneath chat; urgent emergency action pinned to sticky bottom. |

---

## 23. React + Tailwind Component Implementation Contract

```
src/components/
├── shell/
│   ├── AppShell.tsx               // Global layout frame with sidebar, header & emergency dock
│   ├── PersistentSidebar.tsx      // Navigation links, patient sync pill, care hotline
│   └── GlobalHeader.tsx           // HIPAA status, hotline action, notifications, user avatar
├── dashboard/
│   ├── VitalCard.tsx              // Metric card with value, unit, status badge, sparkline
│   ├── HealthSummaryBanner.tsx    // Patient overview hero banner
│   ├── PhysiologicalChart.tsx     // Multi-curve SVG/Canvas trajectory chart
│   └── DiagnosticVaultHub.tsx     // Quick-access list of pending lab records
├── documents/
│   ├── DocumentVaultPage.tsx      // Main repository view with search, filter chips & grid
│   ├── DocumentUploadZone.tsx     // Drag-and-drop OCR intake zone
│   ├── DocumentSplitViewer.tsx    // Split-view OCR original vs extracted data
│   ├── LabResultTable.tsx         // Tabular test, result, unit, reference range rows
│   └── ExtractionActionBar.tsx    // Confirm, Edit, Flag Error, View in Original
└── triage/
    ├── SymptomTriagePage.tsx      // Intake workflow container
    ├── SymptomHistoryList.tsx     // Saved session history cards with status pills
    ├── TriageConversation.tsx     // Chat stream, bot/patient bubbles, quick chips
    ├── TriageSummaryCard.tsx      // Structured guidance, observations, next steps
    └── UrgencyBadge.tsx           // Dual-coded Low / Medium / High / Emergency badge
```

### Tailwind CSS Configuration Mapping (`tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        health: {
          primary: {
            DEFAULT: '#0F766E', // teal-700
            hover: '#115E59',   // teal-800
            active: '#134E4A',  // teal-900
            subtle: '#F0FDFA',  // teal-50
            border: '#99F6E4',  // teal-200
          },
          status: {
            normal:    { DEFAULT: '#059669', bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
            attention: { DEFAULT: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
            high:      { DEFAULT: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
            emergency: { DEFAULT: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
            info:      { DEFAULT: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', text: '#075985' },
          },
          urgency: {
            low:       { DEFAULT: '#059669', bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
            medium:    { DEFAULT: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
            high:      { DEFAULT: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
            emergency: { DEFAULT: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
          }
        }
      },
      borderRadius: {
        'card': '1rem',       // 16px
        'action': '0.75rem',   // 12px
        'input': '0.625rem',  // 10px
        'panel': '1.5rem',     // 24px
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'clinical-card': '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        'clinical-elevated': '0 4px 12px 0 rgba(15, 23, 42, 0.06)',
        'clinical-emergency': '0 8px 24px -4px rgba(225, 29, 72, 0.12)',
      }
    }
  }
}
```

---

## 24. Final Design Invariants (Non-Negotiable Rules)

1. **Do not introduce arbitrary colors:** Stick strictly to the validated palette (Clinical Teal `#0F766E`, Neutral Slate surfaces, and the 5 semantic status colors).
2. **Do not change semantic healthcare colors between screens:** Emerald is always Normal/Success, Amber is always Attention/Medium, Orange is always High, Rose is always Emergency.
3. **Do not use color alone for status:** Always pair color with an explicit text label and a semantic SVG glyph.
4. **Do not present AI extraction as guaranteed truth:** Always surface confidence indicators and explicit actions to Confirm, Edit, or Flag Errors against the source scan.
5. **Do not visually present triage as diagnosis:** Use observational and supportive language; strictly omit diagnostic pronouncements.
6. **Do not make emergency states decorative:** Never use pulsing neon lights or animations; prioritize direct 24/7 hotline actions.
7. **Do not reduce important medical text to tiny sizes:** All biometric values, reference ranges, and dosages must remain at or above standard body size with high contrast.
8. **Preserve one consistent HealthPulse navigation system:** The 5-item persistent sidebar with Elena Rostova sync status and lower emergency callout remains constant across the entire application.
9. **Prefer reusable components over screen-specific styles:** Extract common card, badge, and table primitives into reusable React components.
10. **Keep the interface calm, accessible, and patient-friendly:** Treat the patient with empathy, clarity, and uncompromising clinical craft.
