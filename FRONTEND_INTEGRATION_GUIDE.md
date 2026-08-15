# Frontend Integration & Testing Guide

This guide explains how to connect and run the React frontend with the FastAPI backend.

---

## 🚀 Quick Start (Running Both Together)

### 1. Backend Setup
In your FastAPI repository root:
```bash
# 1. Activate your Python environment
source .venv/bin/activate

# 2. Run Uvicorn server on port 8000
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Open `http://127.0.0.1:8000/docs` to view the interactive Swagger/OpenAPI documentation.

---

### 2. Frontend Setup
In `progress-notes-app`:
```bash
# 1. Ensure .env points to the backend
echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env

# 2. Install dependencies (if not already installed)
npm install

# 3. Start Vite dev server
npm run dev
```
- Open `http://127.0.0.1:5173/` in your browser.

---

## 🔍 How Frontend Communicates with Backend
The frontend includes a modular API client layer in `src/api/`:
- **`src/api/client.js`**: Central Fetch client with automatic `Authorization: Bearer <token>` injection.
- **`src/api/authService.js`**: Calls `POST /auth/login`.
- **`src/api/patientService.js`**: Calls `GET /patients`, `GET /patients/{id}/admissions`, and `GET /patients/{id}/admissions/{adm}/info`.
- **`src/api/vitalsService.js`**: Calls `GET /patients/{id}/admissions/{adm}/vitals`.
- **`src/api/labService.js`**: Calls `GET /patients/{id}/admissions/{adm}/lab-reports`.
- **`src/api/radiologyService.js`**: Calls `GET /patients/{id}/admissions/{adm}/radiology/*`.
- **`src/api/sofaService.js`**: Calls `GET /patients/{id}/admissions/{adm}/sofa/*`.
- **`src/api/summaryService.js`**: Calls `GET /patients/{id}/admissions/{adm}/summary`.

---

## 🛡️ Graceful Offline Fallback
- When the backend is online, the frontend dynamically consumes live endpoints.
- If the backend is temporarily offline or being restarted, the frontend gracefully falls back to bundled clinical fixtures without throwing unhandled exceptions.
- The top header pill indicates `● API Online` when connected to FastAPI.
