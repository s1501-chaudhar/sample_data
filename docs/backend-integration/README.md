# Progress Notes — Complete UI Walkthrough & Backend Integration Package

Welcome to the **Progress Notes — Clinical Intelligence & Hospital EHR** complete walkthrough and backend integration package. This document contains all UI views, component screenshots, API endpoint specifications, and FastAPI integration blueprints for connecting the frontend to the backend.

---

## 📁 Backend Integration Folder & Structure
All documentation and integration guides are organized in:
- `docs/backend-integration/`
  - [`API_SPECIFICATION.md`](./API_SPECIFICATION.md): Complete OpenAPI REST contracts, JSON request/response schemas.
  - [`FASTAPI_ROUTER_GUIDE.md`](./FASTAPI_ROUTER_GUIDE.md): FastAPI Phase 3 router blueprints (`app/api/phase3/router.py`).
  - [`FRONTEND_INTEGRATION_GUIDE.md`](./FRONTEND_INTEGRATION_GUIDE.md): Step-by-step connection, CORS, and runtime testing guide.
- `src/api/`
  - [`client.js`](../../src/api/client.js): Central HTTP client with `Authorization: Bearer <token>` injection.
  - [`authService.js`](../../src/api/authService.js): `POST /auth/login`
  - [`patientService.js`](../../src/api/patientService.js): `GET /patients`, `/patients/{id}/admissions`, `/patients/{id}/admissions/{adm}/info`
  - [`vitalsService.js`](../../src/api/vitalsService.js): `GET /patients/{id}/admissions/{adm}/vitals`
  - [`labService.js`](../../src/api/labService.js): `GET /patients/{id}/admissions/{adm}/lab-reports`, `POST /upload/report`
  - [`radiologyService.js`](../../src/api/radiologyService.js): `GET /patients/{id}/admissions/{adm}/radiology/images`, `/radiology/reports`
  - [`sofaService.js`](../../src/api/sofaService.js): `GET /patients/{id}/admissions/{adm}/sofa/current`, `/sofa/history`
  - [`summaryService.js`](../../src/api/summaryService.js): `GET /patients/{id}/admissions/{adm}/summary`

---

## 📸 Complete UI View & Window Showcase

### 1. Role-Based Authentication & Login Flow
* **Backend Endpoint**: `POST /auth/login`
* **Features**: Clinical role selection (`Doctor`, `Nurse`, `Lab Technician`), password validation, and session token generation.

---

### 2. Integrated Dashboard & Patient Selection
* **Backend Endpoints**:
  * `GET /patients` -> Populates Patient ID dropdown (`P001`, `P002`, `P003`, `P004`).
  * `GET /patients/{patient_id}/admissions` -> Populates Admission ID dropdown (`ADM001`, `ADM002`).
  * `GET /patients/{patient_id}/admissions/{admission_id}/info` -> Populates patient details in dashboard.
  * `GET /patients/{patient_id}/admissions/{admission_id}/summary` -> Populates AI Progress Summary box.

---

### 3. SOFA Score Tab (KPIs, 3×2 Organ Grid, Synchronized Trend)
* **Backend Endpoints**:
  * `GET /patients/{patient_id}/admissions/{admission_id}/sofa/current` -> Current SOFA, Previous comparison, and 6 organ sub-scores.
  * `GET /patients/{patient_id}/admissions/{admission_id}/sofa/history` -> Continuous 4-hour window score telemetry.
* **Layout**: 6 Organ System cards in a clean 3×2 grid (`Respiration`, `Coagulation`, `Liver`, `Cardio`, `CNS`, `Renal`).
* **Interactive Hover**: Hovering over points in the SOFA Trend chart dynamically updates the top KPI score, previous comparison, and date window chip in real time!

---

### 4. Clinical Vitals Tab (Cards & 2-Column Responsive Telemetry)
* **Backend Endpoint**: `GET /patients/{patient_id}/admissions/{admission_id}/vitals?window=24h`
* **Features**: Summary cards (`Heart Rate`, `Blood Pressure`, `SpO2`, `Resp Rate`, `Temperature`, `Urine Output`) and continuous telemetry area charts.

---

### 5. Laboratory Reports Tab (Separated Panels & Hover Popovers)
* **Backend Endpoint**: `GET /patients/{patient_id}/admissions/{admission_id}/lab-reports?window=24h`
* **Panels**: `CBC (Complete Blood Count)`, `BMP (Basic Metabolic Panel)`, `CMP & Hepatic Function`, `ABG (Arterial Blood Gas)`, `Hemodynamics`, `Inflammatory Panels`.
* **Columns**: `TEST NAME`, `CURRENT`, `PREVIOUS`, `Δ`, `UNIT`, `REF RANGE`, `FLAG`, `TREND`.
* **Hover / Click Trend Popover**: Hovering on any test name opens a solid white interactive popover card displaying Current/Previous/Delta metrics and a 5-point telemetry trend curve.

---

### 6. Lab Technician Upload Workstation (Role-Based Access)
* **Backend Endpoint**: `POST /upload/report`
* **Security & RBAC**: Lab personnel only have access to the upload workstation and cannot access patient medical records.

---

## 🔗 How Backend Engineer Connects FastAPI
1. Put all Phase 3 endpoints in `app/api/phase3/` as detailed in [`FASTAPI_ROUTER_GUIDE.md`](./FASTAPI_ROUTER_GUIDE.md).
2. Start FastAPI with Uvicorn:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
3. Start the React frontend:
   ```bash
   npm run dev
   ```
4. The frontend will automatically detect the backend and switch the top status pill to `● API Online`.
