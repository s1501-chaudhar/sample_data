// vitalsUtils.js - Vitals processing, comparisons, and time-series extraction

export function computePatientVitals(observations = [], meta = {}) {
  // Base vitals templates based on patient meta or observations
  const patientId = meta?.patientId || 'P001';
  const admissionId = meta?.admissionId || 'ADM001';

  // Seed baseline values for current vs previous comparison
  const current = {
    spo2: 96.9,
    spo2Prev: 96.8,
    systolicBp: 112,
    systolicBpPrev: 111,
    diastolicBp: 66,
    diastolicBpPrev: 66,
    respiratoryRate: 15,
    respiratoryRatePrev: 15,
    temperature: 36.9,
    temperaturePrev: 36.9,
    painScore: 1,
    painScorePrev: 1,
    urineOutput: 69,
    urineOutputPrev: 69,
    oxygenDevice: 'Room Air',
  };

  // Adjust slightly per patient if needed for realism
  if (patientId === 'P002') {
    current.spo2 = 98.2;
    current.spo2Prev = 97.5;
    current.systolicBp = 124;
    current.systolicBpPrev = 128;
    current.diastolicBp = 74;
    current.diastolicBpPrev = 76;
    current.respiratoryRate = 16;
    current.respiratoryRatePrev = 18;
    current.temperature = 37.1;
    current.temperaturePrev = 37.4;
    current.painScore = 2;
    current.painScorePrev = 3;
    current.urineOutput = 75;
    current.urineOutputPrev = 70;
  } else if (patientId === 'P003') {
    current.spo2 = 94.5;
    current.spo2Prev = 93.8;
    current.systolicBp = 138;
    current.systolicBpPrev = 142;
    current.diastolicBp = 82;
    current.diastolicBpPrev = 85;
    current.respiratoryRate = 20;
    current.respiratoryRatePrev = 22;
    current.temperature = 38.2;
    current.temperaturePrev = 38.6;
    current.painScore = 4;
    current.painScorePrev = 6;
    current.urineOutput = 55;
    current.urineOutputPrev = 48;
    current.oxygenDevice = 'Nasal Cannula 2L/min';
  }

  // Generate continuous time-series readings for 6h, 12h, 18h, 24h
  const timePoints6h = [
    { time: '7/7 20:00', spo2: current.spo2Prev - 0.2, systolicBp: current.systolicBpPrev - 2, diastolicBp: current.diastolicBpPrev - 1, respiratoryRate: current.respiratoryRatePrev + 1, temperature: current.temperaturePrev + 0.1, painScore: current.painScorePrev, urineOutput: current.urineOutputPrev - 3 },
    { time: '7/7 21:00', spo2: current.spo2Prev - 0.1, systolicBp: current.systolicBpPrev - 1, diastolicBp: current.diastolicBpPrev, respiratoryRate: current.respiratoryRatePrev + 1, temperature: current.temperaturePrev + 0.1, painScore: current.painScorePrev, urineOutput: current.urineOutputPrev - 1 },
    { time: '7/7 22:00', spo2: current.spo2Prev, systolicBp: current.systolicBpPrev, diastolicBp: current.diastolicBpPrev, respiratoryRate: current.respiratoryRatePrev, temperature: current.temperaturePrev, painScore: current.painScorePrev, urineOutput: current.urineOutputPrev },
    { time: '7/7 23:00', spo2: current.spo2Prev + 0.1, systolicBp: current.systolicBpPrev + 1, diastolicBp: current.diastolicBpPrev, respiratoryRate: current.respiratoryRatePrev, temperature: current.temperaturePrev, painScore: current.painScorePrev, urineOutput: current.urineOutputPrev + 1 },
    { time: '7/8 00:00', spo2: current.spo2Prev + 0.1, systolicBp: current.systolicBpPrev + 1, diastolicBp: current.diastolicBpPrev, respiratoryRate: current.respiratoryRate, temperature: current.temperature, painScore: current.painScore, urineOutput: current.urineOutput },
    { time: '7/8 01:00', spo2: current.spo2, systolicBp: current.systolicBp, diastolicBp: current.diastolicBp, respiratoryRate: current.respiratoryRate, temperature: current.temperature, painScore: current.painScore, urineOutput: current.urineOutput },
    { time: '7/8 01:10', spo2: current.spo2, systolicBp: current.systolicBp, diastolicBp: current.diastolicBp, respiratoryRate: current.respiratoryRate, temperature: current.temperature, painScore: current.painScore, urineOutput: current.urineOutput },
  ];

  const timePoints24h = [
    { time: '7/7 02:00', spo2: current.spo2 - 1.2, systolicBp: current.systolicBp + 6, diastolicBp: current.diastolicBp + 4, respiratoryRate: current.respiratoryRate + 3, temperature: current.temperature + 0.4, painScore: current.painScore + 2, urineOutput: current.urineOutput - 10 },
    { time: '7/7 06:00', spo2: current.spo2 - 0.9, systolicBp: current.systolicBp + 4, diastolicBp: current.diastolicBp + 3, respiratoryRate: current.respiratoryRate + 2, temperature: current.temperature + 0.3, painScore: current.painScore + 1, urineOutput: current.urineOutput - 8 },
    { time: '7/7 10:00', spo2: current.spo2 - 0.5, systolicBp: current.systolicBp + 2, diastolicBp: current.diastolicBp + 1, respiratoryRate: current.respiratoryRate + 1, temperature: current.temperature + 0.2, painScore: current.painScore + 1, urineOutput: current.urineOutput - 4 },
    { time: '7/7 14:00', spo2: current.spo2 - 0.3, systolicBp: current.systolicBp + 1, diastolicBp: current.diastolicBp, respiratoryRate: current.respiratoryRate, temperature: current.temperature + 0.1, painScore: current.painScore, urineOutput: current.urineOutput - 2 },
    { time: '7/7 18:00', spo2: current.spo2Prev - 0.1, systolicBp: current.systolicBpPrev, diastolicBp: current.diastolicBpPrev, respiratoryRate: current.respiratoryRatePrev, temperature: current.temperaturePrev, painScore: current.painScorePrev, urineOutput: current.urineOutputPrev },
    { time: '7/7 22:00', spo2: current.spo2Prev, systolicBp: current.systolicBpPrev + 1, diastolicBp: current.diastolicBpPrev, respiratoryRate: current.respiratoryRate, temperature: current.temperature, painScore: current.painScore, urineOutput: current.urineOutput },
    { time: '7/8 01:10', spo2: current.spo2, systolicBp: current.systolicBp, diastolicBp: current.diastolicBp, respiratoryRate: current.respiratoryRate, temperature: current.temperature, painScore: current.painScore, urineOutput: current.urineOutput },
  ];

  return {
    current,
    readingsSummary: 'Last 6h · 7 readings',
    timePoints6h,
    timePoints24h,
  };
}
