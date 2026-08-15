# 🏥 Progress Notes — Clinical Intelligence & Hospital EHR

Progress Notes is a hospital Electronic Health Record (EHR) intelligence dashboard engineered for Intensive Care Units (ICU) and Med-Surg departments. It aggregates multi-source clinical telemetry, laboratory results, radiology scans, and AI-generated progress notes with real-time SOFA scoring.

---

## 📁 Repository Contents

```text
progress-notes-app/
├── API_SPECIFICATION.md           # Full OpenAPI / FastAPI endpoint contracts & schemas
├── FASTAPI_ROUTER_GUIDE.md        # Python Phase 3 router implementation templates
├── FRONTEND_INTEGRATION_GUIDE.md  # Step-by-step connection, CORS, & runtime guide
├── walkthrough.md                 # Complete UI showcase & window documentation
├── README.md                      # Project overview (this file)
├── .env / .env.example            # Backend URL configuration (VITE_API_BASE_URL)
├── package.json                   # Dependencies and npm scripts
├── docs/                          # Backup copies of backend integration documentation
│   └── backend-integration/
│       ├── API_SPECIFICATION.md
│       ├── FASTAPI_ROUTER_GUIDE.md
│       ├── FRONTEND_INTEGRATION_GUIDE.md
│       └── README.md
├── public/                        # Static hospital assets and demo data
└── src/                           # React frontend source code
    ├── api/                       # Modular FastAPI service modules
    │   ├── client.js              # Central HTTP client (Fetch / Bearer Token)
    │   ├── authService.js         # POST /auth/login
    │   ├── patientService.js      # GET /patients, /admissions, /info
    │   ├── vitalsService.js       # GET /patients/.../vitals
    │   ├── labService.js          # GET /patients/.../lab-reports, POST /upload
    │   ├── radiologyService.js    # GET /patients/.../radiology/*
    │   ├── sofaService.js         # GET /patients/.../sofa/*
    │   ├── summaryService.js      # GET /patients/.../summary
    │   └── index.js               # Central export bundle
    ├── components/                # Reusable UI component modules
    │   ├── layout/AppLayout.jsx   # Sidebar & Header layout with Patient Selector
    │   └── patient/               # Tab components (SOFA, Vitals, Labs, Radiology, Timeline, Original)
    ├── context/AppContext.jsx     # Global state management & live backend hooks
    ├── pages/                     # LoginPage, Dashboard, UploadReport
    ├── utils/                     # SOFA calculation engine (sofaUtils.js), lab analysis (labUtils.js)
    └── theme.js                   # Clinical design system & MUI theme
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend URL
Ensure `.env` contains the FastAPI server address:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 3. Run Frontend Locally
```bash
npm run dev
```
Open `http://127.0.0.1:5173/` in your browser.

---

## 📑 Backend API Endpoints (Phase 3)

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/login` | Authenticates user & issues session token |
| **Patients** | `GET` | `/patients` | Returns list of unique Patient IDs |
| **Patients** | `GET` | `/patients/{patient_id}/admissions` | Returns hospital admissions for patient |
| **Patients** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/info` | Returns demographics & diagnosis |
| **Vitals** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/vitals` | Returns clinical vitals summary & time-series |
| **Labs** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/lab-reports` | Returns laboratory test results with deltas |
| **Labs** | `POST` | `/upload/report` | Lab technician upload for lab files/reports |
| **Radiology** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/radiology/images` | Returns image URLs fetched from Azure Blob |
| **Radiology** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/radiology/reports` | Returns radiologist written findings |
| **SOFA** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/sofa/history` | Computes 4-hour window SOFA score progression |
| **SOFA** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/sofa/current` | Returns active score, previous comparison, & 6 organs |
| **AI Summary**| `GET` | `/patients/{patient_id}/admissions/{admission_id}/summary` | GPT synthesized plain-English summary |

*For complete endpoint schemas and FastAPI code examples, refer to [API_SPECIFICATION.md](./API_SPECIFICATION.md) and [FASTAPI_ROUTER_GUIDE.md](./FASTAPI_ROUTER_GUIDE.md).*
