import React, { useMemo, useState, useCallback } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea,
} from 'recharts';
import {
  UploadCloud, FileText, X, ChevronDown, Sparkles, Activity, HeartPulse, Wind, Thermometer,
  Gauge, Stethoscope, ImageOff, TrendingUp, TrendingDown, Minus, User,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Demo data - three synthetic patients, fully fictional               */
/* ------------------------------------------------------------------ */

const NOW = new Date('2026-07-15T18:00:00');
const hoursAgo = (h) => new Date(NOW.getTime() - h * 3600 * 1000);

const VITAL_HOURS = [48, 42, 36, 30, 24, 18, 12, 6, 0];
const LAB_HOURS = [48, 36, 24, 12, 0];

function buildVitals(rows) {
  return VITAL_HOURS.map((h, i) => ({ t: hoursAgo(h), hoursAgo: h, ...rows[i] }));
}
function buildLabSeries(values) {
  return LAB_HOURS.map((h, i) => ({ t: hoursAgo(h), hoursAgo: h, v: values[i] }));
}

const LAB_META = {
  WBC: { unit: 'x10\u00b3/\u00b5L', refLow: 4.0, refHigh: 11.0, worseDir: 'high' },
  Hemoglobin: { unit: 'g/dL', refLow: 12.0, refHigh: 16.0, worseDir: 'low' },
  Platelets: { unit: 'x10\u00b3/\u00b5L', refLow: 150, refHigh: 450, worseDir: 'low' },
  Creatinine: { unit: 'mg/dL', refLow: 0.6, refHigh: 1.3, worseDir: 'high' },
  CRP: { unit: 'mg/L', refLow: 0, refHigh: 10, worseDir: 'high' },
  Lactate: { unit: 'mmol/L', refLow: 0.5, refHigh: 2.2, worseDir: 'high' },
};

const PATIENTS = {
  sepsis: {
    id: 'sepsis', name: 'Robert Chen', age: 64, gender: 'Male', mrn: 'MRN-771204',
    diagnosis: 'Septic Shock secondary to Community-Acquired Pneumonia',
    bed: 'ICU \u2013 Bay 3', physician: 'Dr. Elena Marchetti', admitted: hoursAgo(60),
    badge: 'Sepsis', badgeColor: 'bg-red-50 text-red-700 border-red-200',
    isSeptic: true,
    sofa: {
      current: { resp: 2, coag: 1, liver: 0, cardio: 0, cns: 0, renal: 1 },
      previous: { resp: 3, coag: 2, liver: 1, cardio: 4, cns: 1, renal: 2 },
    },
    vitals: buildVitals([
      { hr: 118, sbp: 88, dbp: 52, rr: 26, spo2: 90, temp: 102.6 },
      { hr: 114, sbp: 92, dbp: 54, rr: 24, spo2: 91, temp: 102.0 },
      { hr: 110, sbp: 96, dbp: 56, rr: 22, spo2: 92, temp: 101.4 },
      { hr: 106, sbp: 100, dbp: 58, rr: 21, spo2: 93, temp: 100.8 },
      { hr: 102, sbp: 104, dbp: 60, rr: 20, spo2: 94, temp: 100.2 },
      { hr: 98, sbp: 108, dbp: 62, rr: 19, spo2: 95, temp: 99.6 },
      { hr: 94, sbp: 112, dbp: 64, rr: 18, spo2: 96, temp: 99.0 },
      { hr: 90, sbp: 116, dbp: 66, rr: 17, spo2: 96, temp: 98.6 },
      { hr: 86, sbp: 120, dbp: 70, rr: 16, spo2: 97, temp: 98.2 },
    ]),
    labs: {
      WBC: buildLabSeries([22.4, 19.1, 16.3, 13.8, 11.2]),
      Hemoglobin: buildLabSeries([10.2, 10.0, 9.8, 9.9, 10.1]),
      Platelets: buildLabSeries([98, 105, 118, 132, 145]),
      Creatinine: buildLabSeries([2.4, 2.0, 1.7, 1.4, 1.2]),
      CRP: buildLabSeries([210, 175, 140, 98, 62]),
      Lactate: buildLabSeries([4.8, 3.6, 2.7, 2.1, 1.6]),
    },
    priorityLabs: ['Lactate', 'WBC', 'Creatinine'],
    radiology: null,
  },
  nonsepsis: {
    id: 'nonsepsis', name: 'Maria Gomez', age: 45, gender: 'Female', mrn: 'MRN-771198',
    diagnosis: 'Post-Operative Monitoring \u2014 Laparoscopic Cholecystectomy',
    bed: 'Ward 2B', physician: 'Dr. Samuel Okafor', admitted: hoursAgo(36),
    badge: 'Standard', badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    isSeptic: false, sofa: null,
    vitals: buildVitals([
      { hr: 84, sbp: 118, dbp: 74, rr: 16, spo2: 97, temp: 99.2 },
      { hr: 82, sbp: 119, dbp: 75, rr: 16, spo2: 97, temp: 99.0 },
      { hr: 80, sbp: 120, dbp: 76, rr: 15, spo2: 98, temp: 98.8 },
      { hr: 79, sbp: 120, dbp: 76, rr: 15, spo2: 98, temp: 98.6 },
      { hr: 78, sbp: 121, dbp: 77, rr: 15, spo2: 98, temp: 98.4 },
      { hr: 77, sbp: 122, dbp: 77, rr: 14, spo2: 99, temp: 98.3 },
      { hr: 76, sbp: 122, dbp: 78, rr: 14, spo2: 99, temp: 98.2 },
      { hr: 76, sbp: 123, dbp: 78, rr: 14, spo2: 99, temp: 98.1 },
      { hr: 75, sbp: 124, dbp: 78, rr: 14, spo2: 99, temp: 98.0 },
    ]),
    labs: {
      WBC: buildLabSeries([12.4, 9.8, 8.4, 7.6, 6.9]),
      Hemoglobin: buildLabSeries([11.4, 11.5, 11.6, 11.7, 11.8]),
      Platelets: buildLabSeries([248, 256, 262, 268, 271]),
      Creatinine: buildLabSeries([0.9, 0.9, 0.8, 0.8, 0.8]),
      CRP: buildLabSeries([45, 30, 18, 10, 6]),
      Lactate: buildLabSeries([1.3, 1.2, 1.1, 1.1, 1.0]),
    },
    priorityLabs: ['WBC', 'CRP', 'Hemoglobin'],
    radiology: null,
  },
  radiology: {
    id: 'radiology', name: 'David Okafor', age: 58, gender: 'Male', mrn: 'MRN-771233',
    diagnosis: 'Community-Acquired Pneumonia, Right Lower Lobe',
    bed: 'Med-Surg 4A', physician: 'Dr. Priya Raghavan', admitted: hoursAgo(48),
    badge: 'Radiology', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    isSeptic: false, sofa: null,
    vitals: buildVitals([
      { hr: 100, sbp: 112, dbp: 70, rr: 24, spo2: 91, temp: 101.5 },
      { hr: 98, sbp: 113, dbp: 71, rr: 23, spo2: 92, temp: 101.0 },
      { hr: 95, sbp: 115, dbp: 72, rr: 21, spo2: 93, temp: 100.4 },
      { hr: 92, sbp: 116, dbp: 73, rr: 20, spo2: 94, temp: 99.8 },
      { hr: 89, sbp: 118, dbp: 74, rr: 19, spo2: 94, temp: 99.4 },
      { hr: 87, sbp: 120, dbp: 75, rr: 18, spo2: 95, temp: 99.0 },
      { hr: 85, sbp: 121, dbp: 76, rr: 17, spo2: 95, temp: 98.8 },
      { hr: 84, sbp: 122, dbp: 77, rr: 16, spo2: 96, temp: 98.6 },
      { hr: 82, sbp: 124, dbp: 78, rr: 16, spo2: 96, temp: 98.5 },
    ]),
    labs: {
      WBC: buildLabSeries([14.5, 12.6, 10.8, 9.6, 8.9]),
      Hemoglobin: buildLabSeries([13.6, 13.5, 13.5, 13.4, 13.5]),
      Platelets: buildLabSeries([231, 240, 248, 253, 258]),
      Creatinine: buildLabSeries([0.9, 0.9, 0.9, 0.9, 0.9]),
      CRP: buildLabSeries([160, 118, 78, 42, 22]),
      Lactate: buildLabSeries([1.6, 1.5, 1.4, 1.3, 1.2]),
    },
    priorityLabs: ['WBC', 'CRP'],
    radiology: {
      modality: 'Chest X-Ray, PA View', date: hoursAgo(6),
      findings: 'Focal airspace opacity in the right lower lobe with air bronchograms, decreased in extent and density compared with the prior exam. No pleural effusion. No pneumothorax. Heart size and mediastinal contours are normal.',
      impression: 'Improving right lower lobe pneumonia. No new consolidation.',
    },
  },
};

const SOFA_LABELS = {
  resp: 'Respiration (PaO\u2082/FiO\u2082)', coag: 'Coagulation (Platelets)', liver: 'Liver (Bilirubin)',
  cardio: 'Cardiovascular (MAP / Pressors)', cns: 'CNS (Glasgow Coma Scale)', renal: 'Renal (Creatinine)',
};
const sofaTotal = (s) => Object.values(s).reduce((a, b) => a + b, 0);
const sofaBand = (total) => {
  if (total >= 13) return { label: 'Severe organ dysfunction', color: 'text-red-700 bg-red-50 border-red-200' };
  if (total >= 10) return { label: 'High organ dysfunction', color: 'text-orange-700 bg-orange-50 border-orange-200' };
  if (total >= 7) return { label: 'Moderate organ dysfunction', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'Mild / resolving dysfunction', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
};
const scoreColor = (n) => (n === 0 ? 'bg-emerald-500' : n === 1 ? 'bg-amber-400' : n === 2 ? 'bg-orange-500' : 'bg-red-600');

function classifyChange(testName, first, last) {
  const meta = LAB_META[testName];
  if (first == null || last == null || first === last) return 'stable';
  const pctChange = Math.abs((last - first) / first);
  if (pctChange < 0.02) return 'stable';
  const rising = last > first;
  if (meta.worseDir === 'high') return rising ? 'worsened' : 'improved';
  return rising ? 'improved' : 'worsened';
}

function TrendIcon({ change }) {
  if (change === 'improved') return <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />;
  if (change === 'worsened') return <TrendingUp className="w-3.5 h-3.5 text-red-600" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

function fmtTime(d) {
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
function fmtShortTime(d) {
  return d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/* ------------------------------------------------------------------ */
/* Summary generation - simple template over first-vs-latest values    */
/* ------------------------------------------------------------------ */

function generateSummary(patient, windowHours) {
  const lines = [];
  for (const testName of patient.priorityLabs) {
    const series = patient.labs[testName].filter((p) => p.hoursAgo <= windowHours);
    if (series.length < 2) continue;
    const first = series[0], last = series[series.length - 1];
    const meta = LAB_META[testName];
    const change = classifyChange(testName, first.v, last.v);
    const verb = change === 'improved' ? 'improving' : change === 'worsened' ? 'worsening' : 'stable';
    lines.push({
      change,
      text: `${testName} was ${first.v} ${meta.unit} and is now ${last.v} ${meta.unit} \u2014 ${verb}.`,
    });
  }
  if (patient.isSeptic && patient.sofa) {
    const cur = sofaTotal(patient.sofa.current), prev = sofaTotal(patient.sofa.previous);
    const change = cur < prev ? 'improved' : cur > prev ? 'worsened' : 'stable';
    lines.unshift({
      change,
      text: `SOFA score has ${change === 'improved' ? 'improved' : change === 'worsened' ? 'worsened' : 'held steady'} from ${prev} to ${cur} over the last 48 hours.`,
    });
  }
  if (patient.radiology) {
    lines.push({ change: 'improved', text: `Imaging: ${patient.radiology.impression}` });
  }
  return lines;
}

/* ------------------------------------------------------------------ */
/* UI subcomponents                                                    */
/* ------------------------------------------------------------------ */

function UploadPanel({ files, onAdd, onRemove }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = React.useRef(null);

  const handleFiles = useCallback((fileList) => {
    const arr = Array.from(fileList).map((f) => ({ name: f.name, size: f.size, id: `${f.name}-${Date.now()}-${Math.random()}` }));
    onAdd(arr);
  }, [onAdd]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <UploadCloud className="w-4 h-4 text-blue-600" />
        <h2 className="text-sm font-semibold text-slate-800">Upload Reports</h2>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <input ref={inputRef} type="file" multiple accept=".pdf,image/*" className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        <UploadCloud className="w-6 h-6 text-blue-500 mx-auto mb-1.5" />
        <p className="text-xs font-medium text-slate-600">Drop PDF or image reports here</p>
        <p className="text-[11px] text-slate-400 mt-0.5">or click to browse \u2014 demo only, not processed</p>
      </div>
      {files.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-600 truncate flex-1">{f.name}</span>
              <button onClick={() => onRemove(f.id)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SummaryPanel({ patient, windowHours }) {
  const lines = useMemo(() => generateSummary(patient, windowHours), [patient, windowHours]);
  return (
    <div className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/70 to-white p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h2 className="text-sm font-semibold text-slate-800">Progress Summary</h2>
      </div>
      {lines.length === 0 ? (
        <p className="text-xs text-slate-500">Not enough readings in this window to summarize a trend.</p>
      ) : (
        <ul className="space-y-2">
          {lines.map((l, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 leading-relaxed">
              <span className="mt-0.5 shrink-0"><TrendIcon change={l.change} /></span>
              <span>{l.text}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[10px] text-slate-400 mt-3 leading-snug">
        Generated from the displayed observation values only \u2014 illustrative demo, not a clinical
        interpretation.
      </p>
    </div>
  );
}

function PatientHeaderCard({ patient }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{patient.name}</h1>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${patient.badgeColor}`}>{patient.badge}</span>
            </div>
            <p className="text-sm text-slate-500">{patient.diagnosis}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-5 pt-4 border-t border-slate-100">
        {[
          ['MRN', patient.mrn],
          ['Age / Gender', `${patient.age} / ${patient.gender}`],
          ['Bed', patient.bed],
          ['Physician', patient.physician],
          ['Admitted', fmtTime(patient.admitted)],
          ['Length of Stay', `${Math.round((NOW - patient.admitted) / 36e5)}h`],
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SofaCard({ sofa }) {
  const cur = sofaTotal(sofa.current), prev = sofaTotal(sofa.previous);
  const band = sofaBand(cur);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-red-600" />
          <h2 className="text-sm font-semibold text-slate-800">SOFA Score</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 line-through">{prev}</span>
          <span className="text-2xl font-extrabold text-slate-900">{cur}</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${band.color}`}>{band.label}</span>
        </div>
      </div>
      <div className="space-y-2">
        {Object.entries(sofa.current).map(([key, val]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-slate-600 w-56 shrink-0">{SOFA_LABELS[key]}</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((n) => (
                <div key={n} className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${
                  n <= val ? scoreColor(val) : 'bg-slate-100 text-slate-300'
                }`}>{n === val ? val : ''}</div>
              ))}
            </div>
            <span className="text-[11px] text-slate-400">prev {sofa.previous[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const VITAL_ROWS = [
  { key: 'hr', label: 'Heart Rate', unit: 'bpm', icon: HeartPulse },
  { key: 'bp', label: 'Blood Pressure', unit: 'mmHg', icon: Activity },
  { key: 'rr', label: 'Resp. Rate', unit: '/min', icon: Wind },
  { key: 'spo2', label: 'SpO\u2082', unit: '%', icon: Stethoscope },
  { key: 'temp', label: 'Temperature', unit: '\u00b0F', icon: Thermometer },
];

function VitalsTable({ vitals, windowHours }) {
  const rows = vitals.filter((v) => v.hoursAgo <= windowHours);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 overflow-x-auto">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-blue-600" />
        <h2 className="text-sm font-semibold text-slate-800">Vitals</h2>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left text-[11px] font-semibold text-slate-400 uppercase pb-2 pr-4 whitespace-nowrap">Parameter</th>
            {rows.map((v, i) => (
              <th key={i} className="text-left text-[11px] font-semibold text-slate-400 uppercase pb-2 pr-6 whitespace-nowrap">
                {fmtShortTime(v.t)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VITAL_ROWS.map(({ key, label, unit, icon: Icon }) => (
            <tr key={key} className="border-t border-slate-100">
              <td className="py-2 pr-4 whitespace-nowrap">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <Icon className="w-3.5 h-3.5 text-slate-400" /> {label}
                </span>
              </td>
              {rows.map((v, i) => (
                <td key={i} className="py-2 pr-6 text-sm font-semibold text-slate-800 whitespace-nowrap">
                  {key === 'bp' ? `${v.sbp}/${v.dbp}` : v[key]}
                  <span className="text-[10px] font-normal text-slate-400 ml-1">{unit}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LabChart({ testName, series, windowHours }) {
  const meta = LAB_META[testName];
  const data = series.filter((p) => p.hoursAgo <= windowHours).map((p) => ({ time: fmtShortTime(p.t), value: p.v }));
  const first = data[0]?.value, last = data[data.length - 1]?.value;
  const change = classifyChange(testName, first, last);
  const changeColor = change === 'improved' ? 'text-emerald-600' : change === 'worsened' ? 'text-red-600' : 'text-slate-400';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-semibold text-slate-700">{testName}</p>
        <span className={`flex items-center gap-1 text-[11px] font-semibold ${changeColor}`}>
          <TrendIcon change={change} /> {last ?? '\u2014'} {meta.unit}
        </span>
      </div>
      <div style={{ height: 110 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F7" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <ReferenceArea y1={meta.refLow} y2={meta.refHigh} fill="#1E5EFF" fillOpacity={0.06} />
            <Line type="monotone" dataKey="value" stroke="#1E5EFF" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RadiologySchematic() {
  // Simple original schematic illustration (not a real radiograph) marking the RLL opacity discussed in findings.
  return (
    <svg viewBox="0 0 220 220" className="w-full h-full">
      <rect width="220" height="220" fill="#0B1220" rx="12" />
      <path d="M110 30 L110 190" stroke="#3B4A63" strokeWidth="2" />
      {[...Array(9)].map((_, i) => (
        <path key={i} d={`M ${45 - i * 1.5} ${45 + i * 15} Q 110 ${35 + i * 15} ${175 + i * 1.5} ${45 + i * 15}`}
          stroke="#3B4A63" strokeWidth="1.5" fill="none" opacity="0.7" />
      ))}
      <ellipse cx="70" cy="105" rx="42" ry="70" fill="#111C2E" stroke="#4C5F7D" strokeWidth="1.5" />
      <ellipse cx="150" cy="105" rx="42" ry="70" fill="#111C2E" stroke="#4C5F7D" strokeWidth="1.5" />
      <ellipse cx="158" cy="145" rx="20" ry="16" fill="#D9C27A" opacity="0.55" />
      <text x="110" y="205" textAnchor="middle" fill="#94A3B8" fontSize="9">Illustrative schematic \u2014 not an actual radiograph</text>
    </svg>
  );
}

function RadiologySection({ radiology }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <ImageOff className="w-4 h-4 text-blue-600" />
        <h2 className="text-sm font-semibold text-slate-800">Radiology \u2014 {radiology.modality}</h2>
        <span className="text-[11px] text-slate-400 ml-auto">{fmtTime(radiology.date)}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-5">
        <div className="rounded-xl overflow-hidden border border-slate-200" style={{ aspectRatio: '1/1' }}>
          <RadiologySchematic />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Findings</p>
            <p className="text-sm text-slate-700 leading-relaxed">{radiology.findings}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Impression</p>
            <p className="text-sm font-semibold text-slate-800">{radiology.impression}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root component                                                      */
/* ------------------------------------------------------------------ */

export default function ClinicalDashboardDemo() {
  const [patientId, setPatientId] = useState('sepsis');
  const [windowHours, setWindowHours] = useState(48);
  const [files, setFiles] = useState([]);
  const patient = PATIENTS[patientId];

  const addFiles = useCallback((arr) => setFiles((prev) => [...arr, ...prev]), []);
  const removeFile = useCallback((id) => setFiles((prev) => prev.filter((f) => f.id !== id)), []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="border-b border-slate-200 bg-white px-6 py-3.5 flex items-center gap-3 flex-wrap">
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">PN</div>
        <h1 className="text-sm font-bold text-slate-800">Progress Notes \u2014 Clinical Console</h1>
        <span className="text-xs text-slate-400">Demo patients \u2014 fully synthetic</span>
        <div className="ml-auto flex gap-1.5">
          {Object.values(PATIENTS).map((p) => (
            <button
              key={p.id}
              onClick={() => setPatientId(p.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                p.id === patientId ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.name.split(' ')[0]} <span className="opacity-70 font-normal">\u00b7 {p.badge}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 p-5 max-w-[1400px] mx-auto">
        {/* Left column */}
        <aside style={{ width: '300px' }} className="w-full lg:shrink-0 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <UploadPanel files={files} onAdd={addFiles} onRemove={removeFile} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <ChevronDown className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800">Time Window</h2>
            </div>
            <select
              value={windowHours}
              onChange={(e) => setWindowHours(Number(e.target.value))}
              className="w-full text-sm font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={6}>Last 6 hours</option>
              <option value={12}>Last 12 hours</option>
              <option value={48}>Last 48 hours</option>
            </select>
          </div>

          <SummaryPanel patient={patient} windowHours={windowHours} />
        </aside>

        {/* Center column */}
        <main className="flex-1 space-y-5 min-w-0">
          <PatientHeaderCard patient={patient} />
          {patient.isSeptic && patient.sofa && <SofaCard sofa={patient.sofa} />}
          <VitalsTable vitals={patient.vitals} windowHours={windowHours} />

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800">Report Comparison</h2>
              <span className="text-[11px] text-slate-400 ml-auto">Shaded band = reference range</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {Object.entries(patient.labs).map(([testName, series]) => (
                <LabChart key={testName} testName={testName} series={series} windowHours={windowHours} />
              ))}
            </div>
          </div>

          {patient.radiology && <RadiologySection radiology={patient.radiology} />}
        </main>
      </div>
    </div>
  );
}
