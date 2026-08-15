// excelService.js
// Reads Lab_Report_Observations_Sample.xlsx using SheetJS (xlsx) and normalizes it
// into plain JS objects. This is the ONLY source of structured lab data for the app.
// To later replace with SQL/Blob Storage: swap fetchLabObservations() for an API call
// that resolves to the same shape (array of Observation objects) - nothing else changes.

import * as XLSX from 'xlsx';

const EXCEL_PATH = '/data/Lab_Report_Observations_Sample.xlsx';

// A few report_ids for P001/ADM001 are backed by real sample PDFs in this demo.
const LOCAL_FILE_OVERRIDES = {
  'P001-ADM001-CBC-2': '/reports/P001/ADM001/CBC/P001-ADM001-CBC-2.pdf',
  'P001-ADM001-BMP-2': '/reports/P001/ADM001/BMP/P001-ADM001-BMP-2.pdf',
  'P001-ADM001-CMP-1': '/reports/P001/ADM001/CMP/P001-ADM001-CMP-1.pdf',
};

function excelSerialToDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'number') {
    // Excel serial date -> JS Date
    return new Date(Math.round((value - 25569) * 86400 * 1000));
  }
  if (typeof value === 'string') {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

let _cache = null;

export async function fetchLabObservations() {
  if (_cache) return _cache;

  const res = await fetch(EXCEL_PATH);
  if (!res.ok) throw new Error(`Failed to load Excel data source (${res.status})`);
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array', cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const observations = rows.map((r, idx) => {
    const collected = excelSerialToDate(r.collection_datetime);
    const reported = excelSerialToDate(r.reported_datetime);
    const blobPath = LOCAL_FILE_OVERRIDES[r.report_id] || r.blob_path || null;
    return {
      rowId: `${r.report_id}-${r.test_code || r.test_name}-${idx}`,
      patientId: r.patient_id,
      admissionId: r.admission_id,
      reportId: r.report_id,
      reportType: r.report_type,
      department: r.department,
      accessionNumber: r.accession_number,
      specimenType: r.specimen_type,
      collectedAt: collected,
      reportedAt: reported,
      testCode: r.test_code,
      testName: r.test_name,
      resultType: r.result_type,
      valueNumeric: r.value_numeric,
      valueText: r.value_text,
      unit: r.unit,
      referenceLow: r.reference_low,
      referenceHigh: r.reference_high,
      flag: r.abnormal_flag || 'Normal',
      blobPath,
      hasLocalFile: !!LOCAL_FILE_OVERRIDES[r.report_id],
      hospitalName: r.hospital_name,
      extractionStatus: r.extraction_status,
    };
  });

  _cache = observations;
  return observations;
}

export function clearCache() {
  _cache = null;
}
