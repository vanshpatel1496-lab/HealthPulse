# HealthPulse Production Deployment Guide

This guide details the production deployment architecture and step-by-step procedures for deploying HealthPulse:
- **Backend API**: Render (Node.js, Express, TypeScript, Google Gemini API)
- **Frontend Client**: Vercel (React 18, Vite, Tailwind CSS)

---

## 1. Architecture & Security Invariants

1. **Server-Side Credentials Isolation**:
   - `GEMINI_API_KEY` exists exclusively on Render.
   - Never provide `GEMINI_API_KEY` to Vercel.
   - Never create `VITE_GEMINI_*` environment variables on the frontend.
2. **Frontend Configuration**:
   - The frontend communicates only with the public backend API via `VITE_API_BASE_URL`.
3. **CORS Restrictions**:
   - In production (`NODE_ENV=production`), the backend restricts incoming cross-origin requests strictly to the configured `CLIENT_URL` (the Vercel production domain).
4. **Safety & Medical Mocks Invariant**:
   - Simulated/mock extractions and triage results run **only in development mode**.
   - In production, if Gemini is disabled or unconfigured, the server returns an explicit, safe HTTP `503 Service Unavailable`. It never replaces a live failure with fake clinical data.

---

## 2. Render Backend Deployment (`server/`)

### Option A: Manual Setup via Render Dashboard

1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub/GitLab repository containing the HealthPulse project.
4. Configure the Web Service settings:
   - **Name**: `healthpulse-api` (or your preferred name)
   - **Region**: Choose the region closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free` or `Starter`
5. Configure the **Health Check Path**:
   - **Health Check Path**: `/api/health`

### Option B: Infrastructure-as-Code via Blueprint (`render.yaml`)

HealthPulse includes a root `render.yaml` specification. You can deploy directly by creating a Blueprint instance in Render connected to your repository.

### Required Server Environment Variables (Render)

Add the following environment variables in **Render > Web Service > Environment**:

| Variable Name | Required | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | **Yes** | `production` | Enables production safeguards and strict error masking. |
| `GEMINI_API_KEY` | **Yes** | `AIzaSy...` | Your Google Gemini API key (kept strictly server-side). |
| `GEMINI_LIVE_CALLS_ENABLED` | **Yes** | `true` | Enables live Gemini model calls (`gemini-3.8-flash`). |
| `CLIENT_URL` | **Yes** | `https://healthpulse.vercel.app` | Your Vercel frontend URL (enforces CORS origin security). |
| `PORT` | Auto | *(Injected by Render)* | Render automatically assigns and binds `PORT`. Defaults to `3001` locally. |
| `UPLOAD_MAX_FILE_SIZE_MB` | No | `25` | Max upload size limit (default: 25MB). |

> **Note on Initial Deployment**: If your Vercel URL is not known yet, you can temporarily set `CLIENT_URL` to `*` or a placeholder, deploy Vercel, and then update `CLIENT_URL` with your final Vercel domain.

---

## 3. Vercel Frontend Deployment (`client/`)

1. Sign in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your Git repository.
4. Configure the Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`client`**
   - **Build Command**: `npm run build` *(Prebuild hook automatically compiles `@healthpulse/shared`)*
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Configure **Environment Variables**:

| Variable Name | Required | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | **Yes** | `https://healthpulse-api.onrender.com` | Full HTTPS URL of your Render backend. Do NOT append trailing slashes. |

6. Click **Deploy**.

---

## 4. Local Development Commands

To run HealthPulse locally with development mock fallbacks:

```powershell
# 1. Install root dependencies and build shared package
npm run build --prefix shared

# 2. Start the Express API server (Terminal 1)
# Runs on http://localhost:3001
npm run dev --prefix server

# 3. Start the Vite React client (Terminal 2)
# Runs on http://localhost:5173
npm run dev --prefix client
```

---

## 5. Build Commands

To build all packages locally in topological order:

```powershell
# Build shared library (DTO contracts and Zod schemas)
npm run build --prefix shared

# Build server (TypeScript compilation to dist/)
npm run build --prefix server

# Build client (TypeScript check + Vite production bundle to client/dist/)
npm run build --prefix client
```

---

## 6. Automated Regression & Smoke Testing

Run the full 45-point end-to-end smoke test suite against the backend:

```powershell
npm run test:smoke --prefix server
```

The smoke tests automatically verify:
- System Healthcheck (`GET /api/health`)
- Vitals Dashboard API (`GET /api/vitals`)
- Manual vital readings logging (`POST /api/vitals/log`)
- Document vault queries (`GET /api/documents`)
- Document ingestion & extraction (`POST /api/documents/upload`)
- Patient verification confirmation (`PATCH /api/documents/:id/confirm`)
- Discrepancy flagging (`POST /api/documents/:id/flag`)
- Triage intake session creation (`POST /api/triage/sessions`)
- Triage conversation progression (`POST /api/triage/sessions/:id/messages`)
- Triage urgency evaluation (`POST /api/triage/sessions/:id/evaluate`)
- Decoupled session status vs. care urgency
- Production gating safety invariant (HTTP 503 on unconfigured Gemini calls)

---

## 7. Production Verification Checklist

After deploying both services, perform this live verification:

1. **Verify Backend Health**:
   Open `https://<YOUR-RENDER-BACKEND>.onrender.com/api/health` in your browser.
   - Expected response:
     ```json
     {
       "status": "healthy",
       "service": "HealthPulse API Service",
       "timestamp": "..."
     }
     ```
2. **Verify CORS Headers**:
   Make an `OPTIONS` preflight request or load the frontend application. Ensure the backend returns `Access-Control-Allow-Origin: https://<YOUR-VERCEL-FRONTEND>.vercel.app`.
3. **Verify Vitals Telemetry**:
   Ensure the Patient Vitals Dashboard renders baseline metrics (resting heart rate, blood pressure, sleep, SpO2) and longitudinal charts.
4. **Verify Document Vault**:
   Upload a test medical scan (PDF/PNG). Ensure structured extraction displays provider, date, and lab values in the split-view viewer.
5. **Verify Symptoms Triage**:
   Start a triage session, provide symptoms, and verify evaluation returns structured observations, recommended care timeline, and non-diagnostic disclaimers.
6. **Verify Emergency Actions**:
   Click "Get Emergency Help" in the header or urgent triage banner. Confirm the modal opens with high-priority warning signs, localized emergency guidance ("Seek immediate emergency medical care or contact your local emergency services"), and no unverified auto-dialing.

---

## 8. Gemini Quota & Error Behavior

- **Rate Limits & Quota Exhaustion (`429 RESOURCE_EXHAUSTED`)**:
  - If the Gemini API key exhausts its quota, the service catches the error via centralized error middleware.
  - The client receives an explicit, non-leaking error with `safeUserMessage`:
    > *"Medical document extraction is temporarily unavailable. Please try again later."* or *"Symptom triage guidance is temporarily unavailable..."*
- **Production Mocks Disabled**:
  - Synthetic medical or triage mocks are **strictly disabled** in production.
  - Under no circumstances will a failed or throttled Gemini API request silently produce fake clinical data in production.

---

## 9. Security & Compliance Reminder

> **IMPORTANT**: Health information is handled as sensitive data. Do not use this demonstration environment for real protected health information unless appropriate production security and compliance controls are configured.
