# Progress Notes — Backend API Specification (FastAPI / Phase 3)

This document specifies the complete REST API interface consumed by the **Progress Notes — Clinical Intelligence & Hospital EHR** frontend.

---

## 🌐 Base URL Configuration
- **Local Development**: `http://127.0.0.1:8000`
- **Frontend Environment Key**: `VITE_API_BASE_URL` in `.env`
- **Global Header**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <session_token>
  ```

---

## 📑 Endpoints Summary Table

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/login` | Authenticates user & issues stateless session token |
| **Patients** | `GET` | `/patients` | Returns list of all unique Patient IDs |
| **Patients** | `GET` | `/patients/{patient_id}/admissions` | Returns hospital admissions for a selected patient |
| **Patients** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/info` | Returns patient demographics & admission diagnosis |
| **Vitals** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/vitals` | Returns clinical vitals summary & time-series telemetry |
| **Labs** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/lab-reports` | Returns laboratory test results with previous comparison |
| **Labs** | `POST` | `/upload/report` | Lab technician upload for lab files/reports |
| **Radiology** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/radiology/images` | Returns image URLs / base64 fetched from Azure Blob |
| **Radiology** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/radiology/reports` | Returns radiologist written findings & impressions |
| **SOFA** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/sofa/history` | Computes 4-hour window SOFA score progression |
| **SOFA** | `GET` | `/patients/{patient_id}/admissions/{admission_id}/sofa/current` | Returns latest SOFA score, previous comparison, & 6 organ scores |
| **AI Summary**| `GET` | `/patients/{patient_id}/admissions/{admission_id}/summary` | GPT synthesized plain-English progress summary |

---

## 1. Authentication

### `POST /auth/login`
Authenticates clinical personnel (Doctor, Nurse, Lab Technician) and returns a stateless session token.

#### Request Body
```json
{
  "username": "dr.sarah",
  "password": "SecurePassword123"
}
```

#### Response (`200 OK`)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "role": "doctor",
  "name": "Dr. Sarah Chen",
  "department": "Intensive Care Unit (ICU)"
}
```

---

## 2. Patient Selection & Demographics

### `GET /patients`
Returns a list of all unique patient identifiers to populate the sidebar dropdown.

#### Response (`200 OK`)
```json
[
  "P001",
  "P002",
  "P003",
  "P004",
  "P005"
]
```

---

### `GET /patients/{patient_id}/admissions`
Returns all hospital admissions associated with the patient.

#### Response (`200 OK`)
```json
[
  "ADM001",
  "ADM002"
]
```

---

### `GET /patients/{patient_id}/admissions/{admission_id}/info`
Returns patient demographics, physician in charge, and initial diagnosis.

#### Response (`200 OK`)
```json
{
  "patientId": "P001",
  "admissionId": "ADM001",
  "name": "Sarah Jenkins",
  "age": 64,
  "gender": "Female",
  "diagnosis": "Severe Sepsis secondary to Community-Acquired Pneumonia",
  "physician": "Dr. Sarah Chen, MD",
  "admissionDate": "2026-07-01T08:30:00Z"
}
```

---

## 3. Clinical Data (Vitals & Labs)

### `GET /patients/{patient_id}/admissions/{admission_id}/vitals?window=24h`
Returns summary vitals cards (Current vs Previous) and continuous multi-point telemetry.

#### Query Parameters
- `window` (optional): `6h` | `12h` | `18h` | `24h` (default: `24h`)

#### Response (`200 OK`)
```json
{
  "summary": {
    "heartRate": { "current": 68, "previous": 81, "unit": "bpm", "delta": -13 },
    "systolicBP": { "current": 118, "previous": 126, "unit": "mmHg", "delta": -8 },
    "diastolicBP": { "current": 74, "previous": 80, "unit": "mmHg", "delta": -6 },
    "spO2": { "current": 97.2, "previous": 96.9, "unit": "%", "delta": 0.3 },
    "respRate": { "current": 16, "previous": 19, "unit": "bpm", "delta": -3 },
    "temp": { "current": 36.9, "previous": 37.4, "unit": "°C", "delta": -0.5 },
    "urineOutput": { "current": 1450, "previous": 1200, "unit": "mL/24h", "delta": 250 }
  },
  "history": [
    { "time": "06:00", "heartRate": 82, "systolicBP": 128, "spO2": 96.5, "temp": 37.5 },
    { "time": "10:00", "heartRate": 78, "systolicBP": 124, "spO2": 96.8, "temp": 37.3 },
    { "time": "14:00", "heartRate": 74, "systolicBP": 120, "spO2": 97.0, "temp": 37.1 },
    { "time": "18:00", "heartRate": 70, "systolicBP": 119, "spO2": 97.1, "temp": 37.0 },
    { "time": "22:00", "heartRate": 68, "systolicBP": 118, "spO2": 97.2, "temp": 36.9 }
  ]
}
```

---

### `GET /patients/{patient_id}/admissions/{admission_id}/lab-reports?window=24h`
Returns lab reports grouped by test panel (CBC, BMP, CMP, ABG, etc.) with delta analysis and sparkline series.

#### Response (`200 OK`)
```json
[
  {
    "reportName": "CBC (Complete Blood Count)",
    "tests": [
      {
        "testName": "WBC",
        "current": 9.8,
        "previous": 11.5,
        "delta": "-1.70",
        "deltaNum": -1.70,
        "unit": "x10E3/uL",
        "refRange": "4 - 11",
        "flag": "N",
        "trendLabel": "↓ Decreased (improving)",
        "trendColor": "#059669",
        "history": [
          { "time": "06:00", "value": 11.5, "fullTime": "2026-07-07 06:00" },
          { "time": "12:00", "value": 11.0, "fullTime": "2026-07-07 12:00" },
          { "time": "18:00", "value": 10.4, "fullTime": "2026-07-07 18:00" },
          { "time": "00:00", "value": 10.1, "fullTime": "2026-07-08 00:00" },
          { "time": "06:00", "value": 9.8, "fullTime": "2026-07-08 06:00" }
        ]
      }
    ]
  },
  {
    "reportName": "BMP (Basic Metabolic Panel)",
    "tests": [
      {
        "testName": "Potassium",
        "current": 3.52,
        "previous": 5.02,
        "delta": "-1.50",
        "deltaNum": -1.50,
        "unit": "mmol/L",
        "refRange": "3.5 - 5.1",
        "flag": "N",
        "trendLabel": "↓ Decreased (improving)",
        "trendColor": "#059669",
        "history": [
          { "time": "06:00", "value": 5.02 },
          { "time": "12:00", "value": 4.60 },
          { "time": "18:00", "value": 4.15 },
          { "time": "00:00", "value": 3.80 },
          { "time": "06:00", "value": 3.52 }
        ]
      }
    ]
  }
]
```

---

## 4. Radiology Images & Reports

### `GET /patients/{patient_id}/admissions/{admission_id}/radiology/images`
Returns image URLs securely generated via Azure Blob Storage SAS tokens.

#### Response (`200 OK`)
```json
[
  {
    "id": "RAD-001",
    "title": "Chest PA & Lateral (2 Views)",
    "modality": "X-RAY",
    "date": "2026-07-07 14:30",
    "imageUrl": "https://clinicalstorage.blob.core.windows.net/scans/p001_chest_xray.jpg?sas_token=..."
  }
]
```

---

### `GET /patients/{patient_id}/admissions/{admission_id}/radiology/reports`
Returns the radiologist's formal written report and findings.

#### Response (`200 OK`)
```json
[
  {
    "id": "RAD-001",
    "modality": "Chest X-Ray",
    "date": "2026-07-07 15:00",
    "radiologist": "Dr. Mark Vance, MD",
    "findings": "Significant clearing of previous bilateral lower lobe consolidations. No pneumothorax. Cardiothoracic ratio normal.",
    "impression": "Marked resolution of bilateral bacterial pneumonia. Resolving lung infection."
  }
]
```

---

## 5. SOFA Scoring System

### `GET /patients/{patient_id}/admissions/{admission_id}/sofa/current`
Returns the active SOFA score, baseline comparison, and 6 organ component breakdown.

#### Response (`200 OK`)
```json
{
  "currentTotal": 0,
  "previousTotal": 4,
  "currentWindow": "2026-07-08T09:00",
  "organs": {
    "respiration": { "score": 0, "valueStr": "Pao2/Fio2 Ratio: 419 mmHg", "evidence": "PaO2/FiO2 = 419 mmHg (Room air)" },
    "coagulation": { "score": 0, "valueStr": "Platelet Count: 223 ×10E3/uL", "evidence": "Platelet count = 223 ×10³/µL" },
    "liver": { "score": 0, "valueStr": "Total Bilirubin: 0.8 mg/dL", "evidence": "Total Bilirubin = 0.8 mg/dL" },
    "cardio": { "score": 0, "valueStr": "MAP: 82 mmHg", "evidence": "Mean Arterial Pressure = 82 mmHg without pressors" },
    "cns": { "score": 0, "valueStr": "Glasgow Coma Scale: 15 score", "evidence": "GCS = 15/15" },
    "renal": { "score": 0, "valueStr": "Creatinine: 1.02 mg/dL", "evidence": "Serum Creatinine = 1.02 mg/dL" }
  }
}
```

---

### `GET /patients/{patient_id}/admissions/{admission_id}/sofa/history`
Returns 4-hour window longitudinal telemetry for the SOFA Trend area chart.

#### Response (`200 OK`)
```json
[
  { "time": "2026-07-06 09:00", "shortTime": "07-06 09:00", "sofa": 3, "prevSofa": 2, "respiration": 1, "coagulation": 0, "liver": 0, "cardio": 1, "cns": 0, "renal": 1 },
  { "time": "2026-07-06 21:00", "shortTime": "07-06 21:00", "sofa": 7, "prevSofa": 3, "respiration": 2, "coagulation": 1, "liver": 0, "cardio": 2, "cns": 0, "renal": 2 },
  { "time": "2026-07-07 09:00", "shortTime": "07-07 09:00", "sofa": 6, "prevSofa": 7, "respiration": 1, "coagulation": 1, "liver": 1, "cardio": 1, "cns": 0, "renal": 1 },
  { "time": "2026-07-07 21:00", "shortTime": "07-07 21:00", "sofa": 4, "prevSofa": 6, "respiration": 1, "coagulation": 0, "liver": 0, "cardio": 1, "cns": 0, "renal": 1 },
  { "time": "2026-07-08 09:00", "shortTime": "07-08 09:00", "sofa": 0, "prevSofa": 4, "respiration": 0, "coagulation": 0, "liver": 0, "cardio": 0, "cns": 0, "renal": 0 }
]
```

---

## 6. Artificial Intelligence Summary

### `GET /patients/{patient_id}/admissions/{admission_id}/summary`
Synthesizes clinical vitals, labs, SOFA score, and radiology findings with OpenAI GPT models.

#### Response (`200 OK`)
```json
{
  "sofaSummary": "Current SOFA score is 0, improved from 4 six hours earlier. All organ system components are 0, including respiration, coagulation, liver, cardiovascular, CNS, and renal.",
  "vitalsSummary": "SpO2 is 97.2%, slightly down from 96.9%. MAP is 82 mmHg (stable). Temperature normal at 36.9°C.",
  "labsSummary": "WBC count decreased from 11.5 to 9.8 x10E3/uL showing resolution of leukocytosis. Serum Potassium normalized to 3.52 mmol/L.",
  "generatedAt": "2026-07-08T09:05:00Z"
}
```
