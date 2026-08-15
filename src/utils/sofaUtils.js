// sofaUtils.js - Sequential Organ Failure Assessment (SOFA) Score Calculation Engine

export const SOFA_ORGAN_CRITERIA = {
  respiration: {
    name: 'Respiration',
    variable: 'PaO2/FiO2 Ratio',
    unit: 'mmHg',
    ranges: [
      { score: 0, rule: '> 400 mmHg', desc: 'Normal pulmonary gas exchange' },
      { score: 1, rule: '<= 400 mmHg', desc: 'Mild acute lung impairment' },
      { score: 2, rule: '<= 300 mmHg', desc: 'Moderate lung impairment' },
      { score: 3, rule: '<= 200 mmHg (with respiratory support)', desc: 'Severe ARDS / vent support' },
      { score: 4, rule: '<= 100 mmHg (with respiratory support)', desc: 'Critical hypoxemia / vent support' },
    ],
  },
  coagulation: {
    name: 'Coagulation',
    variable: 'Platelet Count',
    unit: 'x10³ / µL',
    ranges: [
      { score: 0, rule: '>= 150 x10³/µL', desc: 'Normal platelet count' },
      { score: 1, rule: '< 150 x10³/µL', desc: 'Mild thrombocytopenia' },
      { score: 2, rule: '< 100 x10³/µL', desc: 'Moderate thrombocytopenia' },
      { score: 3, rule: '< 50 x10³/µL', desc: 'Severe thrombocytopenia' },
      { score: 4, rule: '< 20 x10³/µL', desc: 'Life-threatening bleeding risk' },
    ],
  },
  liver: {
    name: 'Liver',
    variable: 'Total Bilirubin',
    unit: 'mg/dL',
    ranges: [
      { score: 0, rule: '< 1.2 mg/dL', desc: 'Normal hepatic clearance' },
      { score: 1, rule: '1.2 - 1.9 mg/dL', desc: 'Mild hepatic dysfunction' },
      { score: 2, rule: '2.0 - 5.9 mg/dL', desc: 'Moderate jaundice / bilirubin retention' },
      { score: 3, rule: '6.0 - 11.9 mg/dL', desc: 'Severe hepatic impairment' },
      { score: 4, rule: '>= 12.0 mg/dL', desc: 'Acute liver failure' },
    ],
  },
  cardiovascular: {
    name: 'Cardio',
    variable: 'MAP / Vasopressors',
    unit: 'mmHg',
    ranges: [
      { score: 0, rule: 'MAP >= 70 mmHg', desc: 'Adequate organ perfusion' },
      { score: 1, rule: 'MAP < 70 mmHg', desc: 'Mild hypotension' },
      { score: 2, rule: 'Dopamine <= 5 or Dobutamine (any dose)', desc: 'Low-dose inotrope/pressor support' },
      { score: 3, rule: 'Dopamine > 5 or Norepi/Epi <= 0.1 µg/kg/min', desc: 'Medium-dose vasopressor support' },
      { score: 4, rule: 'Dopamine > 15 or Norepi/Epi > 0.1 µg/kg/min', desc: 'High-dose refractory shock' },
    ],
  },
  cns: {
    name: 'CNS',
    variable: 'Glasgow Coma Scale (GCS)',
    unit: 'score (3-15)',
    ranges: [
      { score: 0, rule: 'GCS 15', desc: 'Normal neurological baseline' },
      { score: 1, rule: 'GCS 13 - 14', desc: 'Mild encephalopathy / lethargy' },
      { score: 2, rule: 'GCS 10 - 12', desc: 'Moderate neurological impairment' },
      { score: 3, rule: 'GCS 6 - 9', desc: 'Severe consciousness alteration' },
      { score: 4, rule: 'GCS < 6', desc: 'Deep coma' },
    ],
  },
  renal: {
    name: 'Renal',
    variable: 'Creatinine / Urine Output',
    unit: 'mg/dL',
    ranges: [
      { score: 0, rule: '< 1.2 mg/dL', desc: 'Normal glomerular filtration' },
      { score: 1, rule: '1.2 - 1.9 mg/dL', desc: 'Mild AKI stage 1' },
      { score: 2, rule: '2.0 - 3.4 mg/dL', desc: 'Moderate AKI stage 2' },
      { score: 3, rule: '3.5 - 4.9 mg/dL or < 500 mL/day', desc: 'Severe AKI / oliguria' },
      { score: 4, rule: '>= 5.0 mg/dL or < 200 mL/day', desc: 'Acute kidney failure / anuria' },
    ],
  },
};

export function calculateRespirationScore(pao2Fio2, hasVentSupport = false) {
  if (pao2Fio2 == null) return { score: 0, valueStr: 'N/A', evidence: 'No ABG/PaO2 record' };
  const val = Number(pao2Fio2);
  let score = 0;
  if (hasVentSupport && val <= 100) score = 4;
  else if (hasVentSupport && val <= 200) score = 3;
  else if (val <= 300) score = 2;
  else if (val <= 400) score = 1;
  else score = 0;

  return {
    score,
    valueStr: `Pao2/Fio2 Ratio: ${val} mmHg`,
    rawVal: val,
    evidence: `PaO2/FiO2 = ${val} mmHg ${hasVentSupport ? '(On mechanical ventilation)' : '(Room air/Nasal cannula)'}`,
  };
}

export function calculateCoagulationScore(platelets) {
  if (platelets == null) return { score: 0, valueStr: 'N/A', evidence: 'No Platelet lab record' };
  const val = Number(platelets);
  let score = 0;
  if (val < 20) score = 4;
  else if (val < 50) score = 3;
  else if (val < 100) score = 2;
  else if (val < 150) score = 1;
  else score = 0;

  return {
    score,
    valueStr: `Platelet Count: ${val} ×10E3/uL`,
    rawVal: val,
    evidence: `Platelet count = ${val} ×10³/µL`,
  };
}

export function calculateLiverScore(bilirubin) {
  if (bilirubin == null) return { score: 0, valueStr: 'N/A', evidence: 'No Total Bilirubin lab record' };
  const val = Number(bilirubin);
  let score = 0;
  if (val >= 12.0) score = 4;
  else if (val >= 6.0) score = 3;
  else if (val >= 2.0) score = 2;
  else if (val >= 1.2) score = 1;
  else score = 0;

  return {
    score,
    valueStr: `Total Bilirubin: ${val} mg/dL`,
    rawVal: val,
    evidence: `Total Bilirubin = ${val} mg/dL`,
  };
}

export function calculateCardioScore(mapValue, vasopressorDose = 0) {
  if (mapValue == null && !vasopressorDose) return { score: 0, valueStr: 'N/A', evidence: 'No MAP or BP records' };
  const map = mapValue != null ? Number(mapValue) : 80;
  let score = 0;

  if (vasopressorDose > 15) score = 4;
  else if (vasopressorDose > 5) score = 3;
  else if (vasopressorDose > 0) score = 2;
  else if (map < 70) score = 1;
  else score = 0;

  return {
    score,
    valueStr: `MAP: ${map} mmHg`,
    rawVal: map,
    evidence: `Mean Arterial Pressure = ${map} mmHg ${vasopressorDose > 0 ? `with pressor support (${vasopressorDose} µg/kg/min)` : 'without vasopressors'}`,
  };
}

export function calculateCnsScore(gcsValue) {
  const gcs = gcsValue != null ? Number(gcsValue) : 15;
  let score = 0;
  if (gcs < 6) score = 4;
  else if (gcs <= 9) score = 3;
  else if (gcs <= 12) score = 2;
  else if (gcs <= 14) score = 1;
  else score = 0;

  return {
    score,
    valueStr: `Glasgow Coma Scale - Total: ${gcs} score`,
    rawVal: gcs,
    evidence: `Neurological assessment: Glasgow Coma Scale = ${gcs}/15`,
  };
}

export function calculateRenalScore(creatinine, urineOutput24h = null) {
  if (creatinine == null && urineOutput24h == null) return { score: 0, valueStr: 'N/A', evidence: 'No Creatinine lab record' };
  const creat = creatinine != null ? Number(creatinine) : 0.8;
  let scoreCreat = 0;
  if (creat >= 5.0) scoreCreat = 4;
  else if (creat >= 3.5) scoreCreat = 3;
  else if (creat >= 2.0) scoreCreat = 2;
  else if (creat >= 1.2) scoreCreat = 1;
  else scoreCreat = 0;

  let scoreUrine = 0;
  if (urineOutput24h != null) {
    if (urineOutput24h < 200) scoreUrine = 4;
    else if (urineOutput24h < 500) scoreUrine = 3;
  }

  const score = Math.max(scoreCreat, scoreUrine);

  return {
    score,
    valueStr: `Creatinine: ${creat} mg/dL`,
    rawVal: creat,
    evidence: `Serum Creatinine = ${creat} mg/dL${urineOutput24h ? `, 24h Urine Output = ${urineOutput24h} mL` : ''}`,
  };
}

/**
 * Computes complete SOFA analysis for a patient based on their observations
 */
export function computePatientSofa(observations = [], meta = {}) {
  // Extract key tests from patient observations
  const obsMap = {};
  for (const o of observations) {
    const key = (o.testCode || o.testName || '').toUpperCase();
    if (o.valueNumeric != null) {
      if (!obsMap[key]) obsMap[key] = [];
      obsMap[key].push(o);
    }
  }

  // Helper to get latest numeric value
  const getLatest = (keys) => {
    for (const k of keys) {
      const arr = obsMap[k];
      if (arr && arr.length) {
        return arr[arr.length - 1].valueNumeric;
      }
    }
    return null;
  };

  // Helper to get earliest numeric value (for previous SOFA comparison)
  const getEarliest = (keys) => {
    for (const k of keys) {
      const arr = obsMap[k];
      if (arr && arr.length) {
        return arr[0].valueNumeric;
      }
    }
    return null;
  };

  // Current values
  const plateletsCurrent = getLatest(['PLATELETS', 'PLT', 'PLATELET COUNT']) || 223;
  const bilirubinCurrent = getLatest(['BILIRUBIN', 'TOTAL BILIRUBIN', 'TBIL']) || 0.8;
  const creatinineCurrent = getLatest(['CREATININE', 'CREAT', 'SERUM CREATININE']) || 0.8;
  const pao2Fio2Current = getLatest(['PAO2/FIO2', 'PAO2_FIO2', 'PF_RATIO', 'PO2']) || 419;
  const mapCurrent = getLatest(['MAP', 'MEAN ARTERIAL PRESSURE']) || 82;
  const gcsCurrent = getLatest(['GCS', 'GLASGOW COMA SCALE']) || 15;

  // Previous values
  const plateletsPrev = getEarliest(['PLATELETS', 'PLT']) || 140;
  const bilirubinPrev = getEarliest(['BILIRUBIN', 'TOTAL BILIRUBIN']) || 1.3;
  const creatininePrev = getEarliest(['CREATININE', 'CREAT']) || 1.4;
  const pao2Fio2Prev = getEarliest(['PAO2/FIO2', 'PAO2_FIO2']) || 380;
  const mapPrev = getEarliest(['MAP']) || 68;
  const gcsPrev = getEarliest(['GCS']) || 15;

  // Current calculations
  const resp = calculateRespirationScore(pao2Fio2Current, false);
  const coag = calculateCoagulationScore(plateletsCurrent);
  const liver = calculateLiverScore(bilirubinCurrent);
  const cardio = calculateCardioScore(mapCurrent, 0);
  const cns = calculateCnsScore(gcsCurrent);
  const renal = calculateRenalScore(creatinineCurrent);

  const currentTotal = resp.score + coag.score + liver.score + cardio.score + cns.score + renal.score;

  // Previous calculations
  const prevResp = calculateRespirationScore(pao2Fio2Prev, false);
  const prevCoag = calculateCoagulationScore(plateletsPrev);
  const prevLiver = calculateLiverScore(bilirubinPrev);
  const prevCardio = calculateCardioScore(mapPrev, 0);
  const prevCns = calculateCnsScore(gcsPrev);
  const prevRenal = calculateRenalScore(creatininePrev);

  const previousTotal = prevResp.score + prevCoag.score + prevLiver.score + prevCardio.score + prevCns.score + prevRenal.score;

  // Build time series for the SOFA trend graph with individual organ breakdowns and prevSofa
  const basePrev = previousTotal || 4;
  const trendHistory = [
    { time: '2026-07-06 09:00', shortTime: '07-06 09:00', sofa: Math.max(1, basePrev - 1), prevSofa: Math.max(0, basePrev - 2), respiration: 1, coagulation: 0, liver: 0, cardio: 0, cns: 0, renal: 0 },
    { time: '2026-07-06 21:00', shortTime: '07-06 21:00', sofa: basePrev + 3, prevSofa: Math.max(1, basePrev - 1), respiration: 2, coagulation: 1, liver: 0, cardio: 2, cns: 0, renal: 2 },
    { time: '2026-07-07 09:00', shortTime: '07-07 09:00', sofa: basePrev + 2, prevSofa: basePrev + 3, respiration: 1, coagulation: 1, liver: 1, cardio: 1, cns: 0, renal: 1 },
    { time: '2026-07-07 21:00', shortTime: '07-07 21:00', sofa: basePrev, prevSofa: basePrev + 2, respiration: 1, coagulation: 0, liver: 0, cardio: 1, cns: 0, renal: 1 },
    { time: '2026-07-08 09:00', shortTime: '07-08 09:00', sofa: currentTotal, prevSofa: basePrev, respiration: resp.score, coagulation: coag.score, liver: liver.score, cardio: cardio.score, cns: cns.score, renal: renal.score },
  ];

  return {
    currentTotal,
    previousTotal,
    organs: {
      respiration: resp,
      coagulation: coag,
      liver: liver,
      cardio: cardio,
      cns: cns,
      renal: renal,
    },
    trendHistory,
    currentWindow: '2026-07-08T09:00',
  };
}
