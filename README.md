# HealthPulse

**AI-Powered Personal Health Dashboard, Medical Document Analyzer & Preliminary Symptom Triage**

HealthPulse is a patient-centered health companion designed for everyday individuals, chronic care patients, and family caregivers. It integrates real-time wearable telemetry, optical medical record extraction (laboratory panels, prescriptions, discharge summaries), and preliminary non-diagnostic symptom triage into an interface engineered around restorative clarity and clinical calm.

---

## Architecture Overview

```
HealthPulse/
├── AI_STUDIO/                        # Canonical AI Studio engine contracts & system prompts
│   ├── medical_extractor_system_prompt.md
│   ├── medical_extractor_schema.json
│   ├── triage_system_prompt.md
│   └── triage_schema.json
├── docs/                             # Clinical and UI design specifications
│   ├── DESIGN.md                     # Clinical Calm tokens & styling principles
│   └── HEALTH_DESIGN.md              # 24-section UI/UX system specification
├── shared/                           # Shared TypeScript types & Zod validation schemas
│   ├── src/
│   │   ├── schemas/                  # documentExtraction.schema.ts, triage.schema.ts
│   │   ├── types/                    # vitals.ts, common.ts
│   │   └── index.ts
│   └── package.json
├── server/                           # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/                   # Validated env (Zod), Gemini API client (@google/genai)
│   │   ├── controllers/              # vitals, documents, triage controllers
│   │   ├── middleware/               # upload (multer), validation, error handler
│   │   ├── routes/                   # api.routes.ts, vitals, documents, triage routes
│   │   ├── services/                 # geminiExtractor, geminiTriage, storage, vitals
│   │   └── index.ts
│   ├── uploads/                      # Local storage for sanitized uploaded records
│   ├── package.json
│   └── tsconfig.json
├── client/                           # React 19 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Button, StatusBadge, UrgencyBadge, DisclaimerBanner
│   │   │   ├── shell/                # AppShell, PersistentSidebar, GlobalHeader, EmergencyModal
│   │   │   ├── dashboard/            # PatientVitalsDashboard (Area 1)
│   │   │   ├── documents/            # MedicalDocumentVaultPage (Areas 2 & 3)
│   │   │   ├── triage/               # SymptomsTriagePage (Areas 4 & 5)
│   │   │   └── insights/             # HealthInsightsPage (Review Hub / Trends)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── tailwind.config.js             # Theme tokens mapped directly from HEALTH_DESIGN.md
│   └── package.json
├── .env.example                      # Root placeholder environment config
├── .gitignore
├── package.json                      # Workspace orchestrator scripts
└── README.md
```

---

## Agent Responsibilities & Workstreams

### Agent A — Frontend
* **Core Responsibilities:**
  * Persistent application shell and navigation (260px sidebar with Elena Rostova sync status and emergency drawer).
  * Area 1: Patient Vitals Dashboard (4-card metric grid, baseline envelopes, sparklines, trajectory curve, and Review Hub).
  * Area 2: Medical Document Vault (drag-and-drop intake, category filtering, document cards).
  * Area 3: Medical Document Detail & Split-Screen OCR Review (source scan viewer + extracted data tables + confirmation action bar).
  * Area 4: Symptoms & Triage Intake (conversational stream with voice separation, severity chips, structured intake tracker).
  * Area 5: Completed Triage Session (9 canonical sections in exact sequence, urgency badge, non-alarmist emergency banner).
  * Accessibility (WCAG 2.1 AA/AAA, dual-coded visual indicators, 44px tap targets).
  * Adherence to `HEALTH_DESIGN.md` as the visual source of truth without redesigning approved screens.

### Agent B — Backend & Safety
* **Core Responsibilities:**
  * Node.js + Express API server with strict TypeScript typing.
  * Server-side Gemini API integration via `@google/genai` using model `gemini-3.8-flash`.
  * Medical Document Extractor endpoint (`POST /api/documents/upload`).
  * Triage & Insight Engine endpoint (`POST /api/triage/sessions/:id/evaluate`).
  * Multer upload middleware with magic-byte / MIME verification, file size limits (<= 25MB), and sanitization.
  * Strict JSON Schema & Zod validation against canonical AI Studio contracts.
  * Server-side environment variable security (`GEMINI_API_KEY` never exposed to client).
  * Centralized error handling with safe, non-panic healthcare messaging.
  * Healthcare safety invariants: observational non-diagnostic phrasing, session status vs. urgency separation, and generic "Get Emergency Help" workflows.

---

## Healthcare Safety Invariants

1. **Non-Diagnostic Constraint:** HealthPulse is strictly an informational guidance and document organization assistant. It never issues definitive medical diagnoses (*"You have..."*) and adheres strictly to observational language (*"You reported..."*).
2. **Dual-Coded Visual Language:** Status and urgency indicators never rely on color alone. Every badge pairs a semantic color tint, high-contrast label text, and an explicit SVG glyph.
3. **Ontological Separation:** Session lifecycle state (`In Progress` | `Completed` | `Draft`) is strictly separated from clinical urgency (`Low` | `Medium` | `High` | `Emergency`).
4. **Emergency UI Standards:** No viewport-wide red flashing. Emergency cases present a calm rose-tinted banner and a generic "Get Emergency Help" action rather than hard-coded phone numbers or automated dialers.
5. **Traceability & Verification:** Extracted laboratory and prescription data is never presented as unchallengeable truth; users can inspect, edit, confirm, or flag OCR findings directly against source scans.
6. **No Silent Mocking in Production:** Development mock fallbacks are allowed solely in local development/test mode. In production, API failures return an explicit, safe error response.

---

## Quickstart & Local Development

### Prerequisites
* Node.js v20+ or v24 LTS
* npm v10+

### Setup
1. Clone the repository and install root dependencies:
   ```bash
   cd Healthplus
   cp .env.example .env
   ```
2. Build shared contracts:
   ```bash
   npm run build:shared
   ```
3. Run backend service:
   ```bash
   npm run dev:server
   # Runs on http://localhost:3001
   ```
4. In a separate terminal, run frontend client:
   ```bash
   npm run dev:client
   # Runs on http://localhost:5173
   ```
