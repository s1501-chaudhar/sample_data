# FastAPI Phase 3 Router Implementation Guide

This guide provides the Python implementation blueprints for the FastAPI backend matching the `app.api.phase3.*` package structure.

---

## 📁 Recommended Directory Layout
```text
app/
├── api/
│   └── phase3/
│       ├── __init__.py
│       ├── router.py            # Master Phase 3 Router
│       ├── auth.py              # POST /auth/login
│       ├── patients.py          # GET /patients, /patients/{id}/admissions
│       ├── vitals.py            # GET /patients/{id}/admissions/{adm}/vitals
│       ├── reports.py           # GET /patients/{id}/admissions/{adm}/lab-reports
│       ├── radiology.py         # GET /patients/{id}/admissions/{adm}/radiology/*
│       ├── sofa.py              # GET /patients/{id}/admissions/{adm}/sofa/*
│       └── summary.py           # GET /patients/{id}/admissions/{adm}/summary
├── main.py
```

---

## 1. Master Router (`app/api/phase3/router.py`)

```python
from fastapi import APIRouter
from app.api.phase3.auth import router as auth_router
from app.api.phase3.patients import router as patients_router
from app.api.phase3.sofa import router as sofa_router
from app.api.phase3.vitals import router as vitals_router
from app.api.phase3.reports import router as reports_router
from app.api.phase3.radiology import router as radiology_router
from app.api.phase3.summary import router as summary_router

phase3_router = APIRouter()

phase3_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
phase3_router.include_router(patients_router, prefix="/patients", tags=["Patients & Demographics"])
phase3_router.include_router(sofa_router, prefix="/patients", tags=["SOFA Scoring"])
phase3_router.include_router(vitals_router, prefix="/patients", tags=["Clinical Vitals"])
phase3_router.include_router(reports_router, prefix="/patients", tags=["Laboratory Reports"])
phase3_router.include_router(radiology_router, prefix="/patients", tags=["Radiology & Scans"])
phase3_router.include_router(summary_router, prefix="/patients", tags=["AI Clinical Summary"])
```

---

## 2. FastAPI Main Application Setup (`app/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.phase3.router import phase3_router

app = FastAPI(
    title="Progress Notes — Clinical Intelligence API",
    description="Backend API powering the Clinical Progress Notes Dashboard and EHR intelligence platform",
    version="3.0.0"
)

# Crucial for frontend Vite integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include master Phase 3 router
app.include_router(phase3_router)

@app.get("/health")
def health_check():
    return {"status": "online", "service": "Progress Notes Clinical API"}
```

---

## 3. Sub-Router Examples

### A. Patients Router (`app/api/phase3/patients.py`)
```python
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

@router.get("", response_model=List[str])
async def get_patients():
    """Returns list of unique patient IDs."""
    return ["P001", "P002", "P003", "P004", "P005"]

@router.get("/{patient_id}/admissions", response_model=List[str])
async def get_admissions(patient_id: str):
    """Returns admissions for the patient."""
    return ["ADM001", "ADM002"]

@router.get("/{patient_id}/admissions/{admission_id}/info", response_model=Dict[str, Any])
async def get_patient_info(patient_id: str, admission_id: str):
    """Returns patient demographics."""
    return {
        "patientId": patient_id,
        "admissionId": admission_id,
        "name": "Sarah Jenkins",
        "age": 64,
        "gender": "Female",
        "diagnosis": "Severe Sepsis secondary to Community-Acquired Pneumonia",
        "physician": "Dr. Sarah Chen, MD",
        "admissionDate": "2026-07-01T08:30:00Z"
    }
```

### B. SOFA Router (`app/api/phase3/sofa.py`)
```python
from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter()

@router.get("/{patient_id}/admissions/{admission_id}/sofa/current", response_model=Dict[str, Any])
async def get_sofa_current(patient_id: str, admission_id: str):
    return {
        "currentTotal": 0,
        "previousTotal": 4,
        "currentWindow": "2026-07-08T09:00",
        "organs": {
            "respiration": {"score": 0, "valueStr": "Pao2/Fio2 Ratio: 419 mmHg", "evidence": "PaO2/FiO2 = 419 mmHg"},
            "coagulation": {"score": 0, "valueStr": "Platelet Count: 223 ×10E3/uL", "evidence": "Platelets = 223 ×10³/µL"},
            "liver": {"score": 0, "valueStr": "Total Bilirubin: 0.8 mg/dL", "evidence": "Bilirubin = 0.8 mg/dL"},
            "cardio": {"score": 0, "valueStr": "MAP: 82 mmHg", "evidence": "MAP = 82 mmHg without pressors"},
            "cns": {"score": 0, "valueStr": "Glasgow Coma Scale: 15 score", "evidence": "GCS = 15/15"},
            "renal": {"score": 0, "valueStr": "Creatinine: 1.02 mg/dL", "evidence": "Creatinine = 1.02 mg/dL"}
        }
    }

@router.get("/{patient_id}/admissions/{admission_id}/sofa/history", response_model=List[Dict[str, Any]])
async def get_sofa_history(patient_id: str, admission_id: str):
    return [
        {"time": "2026-07-06 09:00", "shortTime": "07-06 09:00", "sofa": 3, "prevSofa": 2, "respiration": 1, "coagulation": 0, "liver": 0, "cardio": 1, "cns": 0, "renal": 1},
        {"time": "2026-07-06 21:00", "shortTime": "07-06 21:00", "sofa": 7, "prevSofa": 3, "respiration": 2, "coagulation": 1, "liver": 0, "cardio": 2, "cns": 0, "renal": 2},
        {"time": "2026-07-07 09:00", "shortTime": "07-07 09:00", "sofa": 6, "prevSofa": 7, "respiration": 1, "coagulation": 1, "liver": 1, "cardio": 1, "cns": 0, "renal": 1},
        {"time": "2026-07-07 21:00", "shortTime": "07-07 21:00", "sofa": 4, "prevSofa": 6, "respiration": 1, "coagulation": 0, "liver": 0, "cardio": 1, "cns": 0, "renal": 1},
        {"time": "2026-07-08 09:00", "shortTime": "07-08 09:00", "sofa": 0, "prevSofa": 4, "respiration": 0, "coagulation": 0, "liver": 0, "cardio": 0, "cns": 0, "renal": 0}
    ]
```

### C. AI Summary Router (`app/api/phase3/summary.py`)
```python
from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/{patient_id}/admissions/{admission_id}/summary", response_model=Dict[str, Any])
async def get_ai_summary(patient_id: str, admission_id: str):
    return {
        "sofaSummary": "Current SOFA score is 0, improved from 4 six hours earlier. All organ system components are 0.",
        "vitalsSummary": "SpO2 is 97.2%, slightly down from 96.9%. MAP is 82 mmHg (stable). Temperature normal at 36.9°C.",
        "labsSummary": "WBC count decreased from 11.5 to 9.8 x10E3/uL. Serum Potassium normalized to 3.52 mmol/L.",
        "generatedAt": "2026-07-08T09:05:00Z"
    }
```
