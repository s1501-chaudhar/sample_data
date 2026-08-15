// labUtils.js - pure helper functions for working with observation rows.

export const FLAG_COLORS = {
  Normal: { color: '#1DA35C', bg: '#E7F7EE', label: 'Normal' },
  High: { color: '#D8434A', bg: '#FCEBEC', label: 'High' },
  Low: { color: '#B5720A', bg: '#FDF1DD', label: 'Low' },
  Critical: { color: '#FFFFFF', bg: '#8E1F26', label: 'Critical' },
};

export function flagStyle(flag) {
  return FLAG_COLORS[flag] || FLAG_COLORS.Normal;
}

// Tests where a LOWER value moving down is actually improvement-oriented depends on context;
// for this demo, define which tests are "higher is worse" (infection/inflammation/renal markers)
// vs tests that simply need to return toward the reference midpoint.
const HIGHER_IS_WORSE = new Set(['WBC', 'CRP', 'CREATININE', 'BUN', 'GLUCOSE', 'POTASSIUM']);

export function groupIntoReports(observations) {
  const map = new Map();
  for (const o of observations) {
    if (!map.has(o.reportId)) {
      map.set(o.reportId, {
        reportId: o.reportId,
        reportType: o.reportType,
        department: o.department,
        collectedAt: o.collectedAt,
        reportedAt: o.reportedAt,
        accessionNumber: o.accessionNumber,
        specimenType: o.specimenType,
        blobPath: o.blobPath,
        hasLocalFile: o.hasLocalFile,
        patientId: o.patientId,
        admissionId: o.admissionId,
        hospitalName: o.hospitalName,
        rows: [],
      });
    }
    map.get(o.reportId).rows.push(o);
  }
  return Array.from(map.values()).sort((a, b) => (a.collectedAt || 0) - (b.collectedAt || 0));
}

export function groupByTest(observations) {
  const map = new Map();
  for (const o of observations) {
    if (!map.has(o.testName)) map.set(o.testName, []);
    map.get(o.testName).push(o);
  }
  for (const arr of map.values()) arr.sort((a, b) => (a.collectedAt || 0) - (b.collectedAt || 0));
  return map;
}

export function trendDirection(prevVal, nextVal) {
  if (prevVal == null || nextVal == null) return 'flat';
  const diff = nextVal - prevVal;
  const pct = prevVal !== 0 ? Math.abs(diff / prevVal) : 0;
  if (pct < 0.02) return 'flat';
  return diff > 0 ? 'up' : 'down';
}

// "Improved / Stable / Worsened" classification between two readings of the same test.
export function classifyChange(testCode, prevVal, nextVal, refLow, refHigh) {
  if (prevVal == null || nextVal == null) return 'stable';
  const dir = trendDirection(prevVal, nextVal);
  if (dir === 'flat') return 'stable';

  const higherIsWorse = HIGHER_IS_WORSE.has((testCode || '').toUpperCase());
  const inRangeBefore = refLow != null && refHigh != null ? prevVal >= refLow && prevVal <= refHigh : null;
  const inRangeAfter = refLow != null && refHigh != null ? nextVal >= refLow && nextVal <= refHigh : null;

  if (inRangeBefore === false && inRangeAfter === true) return 'improved';
  if (inRangeBefore === true && inRangeAfter === false) return 'worsened';

  if (higherIsWorse) return dir === 'down' ? 'improved' : 'worsened';
  // default: moving toward the reference midpoint counts as improvement
  if (refLow != null && refHigh != null) {
    const mid = (refLow + refHigh) / 2;
    const distBefore = Math.abs(prevVal - mid);
    const distAfter = Math.abs(nextVal - mid);
    return distAfter < distBefore ? 'improved' : distAfter > distBefore ? 'worsened' : 'stable';
  }
  return 'stable';
}

export function fmtDateTime(d) {
  if (!d) return '\u2014';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '\u2014';
  return dt.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export function fmtDate(d) {
  if (!d) return '\u2014';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '\u2014';
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Generates a short natural-language progress note straight from the Excel values -
// no AI call, just a template over the first vs. latest reading per key test.
export function generateProgressSummary(observations) {
  const byTest = groupByTest(observations.filter((o) => o.valueNumeric != null));
  const lines = [];
  const priority = ['WBC', 'CRP', 'CREATININE', 'HEMOGLOBIN', 'SODIUM', 'GLUCOSE'];

  for (const code of priority) {
    const series = Array.from(byTest.values()).find((s) => (s[0]?.testCode || '').toUpperCase() === code);
    if (!series || series.length < 2) continue;
    const first = series[0];
    const last = series[series.length - 1];
    if (first.valueNumeric == null || last.valueNumeric == null) continue;
    const change = classifyChange(code, first.valueNumeric, last.valueNumeric, last.referenceLow, last.referenceHigh);
    const hours = first.collectedAt && last.collectedAt
      ? Math.round((new Date(last.collectedAt) - new Date(first.collectedAt)) / 36e5)
      : null;
    const verb = change === 'improved' ? 'improved' : change === 'worsened' ? 'worsened' : 'remained stable';
    const timeStr = hours ? ` over ${hours} hours` : '';
    if (change === 'stable' && Math.abs(first.valueNumeric - last.valueNumeric) < 0.01) {
      lines.push({ text: `${first.testName} remains stable at ${last.valueNumeric} ${last.unit || ''}.`, change });
    } else {
      lines.push({
        text: `${first.testName} has ${verb} from ${first.valueNumeric} to ${last.valueNumeric} ${last.unit || ''}${timeStr}.`,
        change,
      });
    }
  }
  return lines;
}
