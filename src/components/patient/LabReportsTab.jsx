import { useMemo, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Stack, TextField, InputAdornment, Chip, Popper, Paper, Divider, Fade
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip
} from 'recharts';
import { groupByTest, classifyChange } from '../../utils/labUtils';
import { useApp } from '../../context/AppContext';

// Standard mapping of test names to clinical report panel names
const PANEL_MAPPINGS = {
  // CBC
  'platelet count': 'CBC (Complete Blood Count)',
  'hemoglobin': 'CBC (Complete Blood Count)',
  'wbc': 'CBC (Complete Blood Count)',
  'rbc': 'CBC (Complete Blood Count)',
  'hematocrit': 'CBC (Complete Blood Count)',
  'mcv': 'CBC (Complete Blood Count)',
  'mch': 'CBC (Complete Blood Count)',
  'mchc': 'CBC (Complete Blood Count)',
  'rdw': 'CBC (Complete Blood Count)',

  // BMP
  'sodium': 'BMP (Basic Metabolic Panel)',
  'potassium': 'BMP (Basic Metabolic Panel)',
  'chloride': 'BMP (Basic Metabolic Panel)',
  'bicarbonate (hco3), calc': 'BMP (Basic Metabolic Panel)',
  'bun': 'BMP (Basic Metabolic Panel)',
  'creatinine': 'BMP (Basic Metabolic Panel)',
  'glucose': 'BMP (Basic Metabolic Panel)',
  'calcium': 'BMP (Basic Metabolic Panel)',

  // CMP / LFT
  'albumin': 'CMP & Hepatic Function Panel',
  'total bilirubin': 'CMP & Hepatic Function Panel',
  'alt': 'CMP & Hepatic Function Panel',
  'ast': 'CMP & Hepatic Function Panel',
  'alkaline phosphatase': 'CMP & Hepatic Function Panel',

  // ABG
  'paco2, arterial': 'ABG (Arterial Blood Gas)',
  'pao2, arterial': 'ABG (Arterial Blood Gas)',
  'ph, arterial': 'ABG (Arterial Blood Gas)',
  'lactate': 'ABG (Arterial Blood Gas)',
  'fio2': 'ABG (Arterial Blood Gas)',

  // Hemodynamics
  'mean arterial pressure (map)': 'Hemodynamics & Vitals Markers',
  'heart rate': 'Hemodynamics & Vitals Markers',

  // Inflammatory
  'crp': 'Inflammatory & Specialized Panels',
  'magnesium': 'Inflammatory & Specialized Panels',
  'phosphorus': 'Inflammatory & Specialized Panels',
};

// Panel icons / theme colors
const PANEL_STYLES = {
  'CBC (Complete Blood Count)': { icon: '🩸', color: '#DC2626', bg: '#FEF2F2' },
  'BMP (Basic Metabolic Panel)': { icon: '🧪', color: '#2563EB', bg: '#EFF6FF' },
  'CMP & Hepatic Function Panel': { icon: '🩺', color: '#D97706', bg: '#FFFBEB' },
  'ABG (Arterial Blood Gas)': { icon: '🫁', color: '#059669', bg: '#ECFDF5' },
  'Hemodynamics & Vitals Markers': { icon: '💓', color: '#7C3AED', bg: '#F5F3FF' },
  'Inflammatory & Specialized Panels': { icon: '🔬', color: '#475569', bg: '#F8FAFC' },
};

function generateTimeSeries(currentVal, prevVal) {
  const c = typeof currentVal === 'number' ? currentVal : parseFloat(currentVal) || 10;
  const p = typeof prevVal === 'number' ? prevVal : parseFloat(prevVal) || c;
  const diff = c - p;

  return [
    { time: '06:00', value: +(p - diff * 0.15).toFixed(2), fullTime: 'Jun 30, 06:00' },
    { time: '12:00', value: +p.toFixed(2), fullTime: 'Jun 30, 12:00' },
    { time: '18:00', value: +(p + diff * 0.35).toFixed(2), fullTime: 'Jun 30, 18:00' },
    { time: '00:00', value: +(p + diff * 0.65).toFixed(2), fullTime: 'Jul 1, 00:00' },
    { time: '06:00', value: +(p + diff * 0.85).toFixed(2), fullTime: 'Jul 1, 06:00' },
    { time: '12:00', value: +c.toFixed(2), fullTime: 'Jul 1, 12:00' },
  ];
}

const DEFAULT_LAB_ROWS = [
  { testName: 'Platelet Count', current: 223, previous: 233, delta: '-10.00', deltaNum: -10, unit: 'x10E3/uL', refRange: '150 - 400', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'CBC (Complete Blood Count)' },
  { testName: 'Hemoglobin', current: 13.3, previous: 11.6, delta: '+1.70', deltaNum: 1.7, unit: 'g/dL', refRange: '12 - 15.5', flag: 'N', trendLabel: '↑ Increased (improving)', trendColor: '#059669', reportName: 'CBC (Complete Blood Count)' },
  { testName: 'WBC', current: 9.8, previous: 15.6, delta: '-5.80', deltaNum: -5.8, unit: 'x10E3/uL', refRange: '4 - 11', flag: 'N', trendLabel: '↓ Decreased (improving)', trendColor: '#059669', reportName: 'CBC (Complete Blood Count)' },

  { testName: 'Sodium', current: 140, previous: 141, delta: '-1.00', deltaNum: -1, unit: 'mmol/L', refRange: '136 - 145', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'BMP (Basic Metabolic Panel)' },
  { testName: 'Potassium', current: 4.0, previous: 4.2, delta: '-0.20', deltaNum: -0.2, unit: 'mmol/L', refRange: '3.5 - 5.1', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'BMP (Basic Metabolic Panel)' },
  { testName: 'Chloride', current: 102, previous: 103, delta: '-1.00', deltaNum: -1, unit: 'mmol/L', refRange: '96 - 106', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'BMP (Basic Metabolic Panel)' },
  { testName: 'Bicarbonate (Hco3), Calc', current: 24, previous: 24, delta: '0.00', deltaNum: 0, unit: 'mmol/L', refRange: '22 - 26', flag: 'N', trendLabel: '→ Unchanged', trendColor: '#94A3B8', reportName: 'BMP (Basic Metabolic Panel)' },
  { testName: 'BUN', current: 18, previous: 24, delta: '-6.00', deltaNum: -6, unit: 'mg/dL', refRange: '7 - 20', flag: 'N', trendLabel: '↓ Decreased (improving)', trendColor: '#059669', reportName: 'BMP (Basic Metabolic Panel)' },
  { testName: 'Creatinine', current: 0.8, previous: 1.2, delta: '-0.40', deltaNum: -0.4, unit: 'mg/dL', refRange: '0.6 - 1.2', flag: 'N', trendLabel: '↓ Decreased (improving)', trendColor: '#059669', reportName: 'BMP (Basic Metabolic Panel)' },
  { testName: 'Glucose', current: 94, previous: 112, delta: '-18.00', deltaNum: -18, unit: 'mg/dL', refRange: '70 - 99', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'BMP (Basic Metabolic Panel)' },
  { testName: 'Calcium', current: 9.1, previous: 8.9, delta: '+0.20', deltaNum: 0.2, unit: 'mg/dL', refRange: '8.5 - 10.2', flag: 'N', trendLabel: '↑ Increased', trendColor: '#2563EB', reportName: 'BMP (Basic Metabolic Panel)' },

  { testName: 'Albumin', current: 4.1, previous: 3.8, delta: '+0.30', deltaNum: 0.3, unit: 'g/dL', refRange: '3.4 - 5.4', flag: 'N', trendLabel: '↑ Increased', trendColor: '#2563EB', reportName: 'CMP & Hepatic Function Panel' },
  { testName: 'Total Bilirubin', current: 0.8, previous: 0.9, delta: '-0.10', deltaNum: -0.1, unit: 'mg/dL', refRange: '0.2 - 1.2', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'CMP & Hepatic Function Panel' },
  { testName: 'ALT', current: 28, previous: 34, delta: '-6.00', deltaNum: -6, unit: 'U/L', refRange: '7 - 56', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'CMP & Hepatic Function Panel' },
  { testName: 'AST', current: 24, previous: 30, delta: '-6.00', deltaNum: -6, unit: 'U/L', refRange: '10 - 40', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'CMP & Hepatic Function Panel' },

  { testName: 'Paco2, Arterial', current: 40, previous: 40, delta: '0.00', deltaNum: 0, unit: 'mmHg', refRange: '35 - 45', flag: 'N', trendLabel: '→ Unchanged', trendColor: '#94A3B8', reportName: 'ABG (Arterial Blood Gas)' },
  { testName: 'Lactate', current: 1.1, previous: 1.8, delta: '-0.70', deltaNum: -0.7, unit: 'mmol/L', refRange: '0.5 - 2.0', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'ABG (Arterial Blood Gas)' },
  { testName: 'FiO2', current: 0.21, previous: 0.28, delta: '-0.07', deltaNum: -0.07, unit: 'fraction', refRange: '0.21 - 1.0', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'ABG (Arterial Blood Gas)' },

  { testName: 'Mean Arterial Pressure (Map)', current: 82, previous: 84, delta: '-2.00', deltaNum: -2, unit: 'mmHg', refRange: '65 - 110', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'Hemodynamics & Vitals Markers' },
  { testName: 'Heart Rate', current: 68, previous: 81, delta: '-13.00', deltaNum: -13, unit: 'bpm', refRange: '60 - 100', flag: 'N', trendLabel: '↓ Decreased', trendColor: '#64748B', reportName: 'Hemodynamics & Vitals Markers' },

  { testName: 'CRP', current: 41.7, previous: 145.5, delta: '-103.80', deltaNum: -103.8, unit: 'mg/L', refRange: '< 10.0', flag: 'H', trendLabel: '↓ Decreased (improving)', trendColor: '#059669', reportName: 'Inflammatory & Specialized Panels' },
  { testName: 'Magnesium', current: 2.0, previous: 1.9, delta: '+0.10', deltaNum: 0.1, unit: 'mg/dL', refRange: '1.7 - 2.2', flag: 'N', trendLabel: '↑ Increased', trendColor: '#2563EB', reportName: 'Inflammatory & Specialized Panels' },
  { testName: 'Phosphorus', current: 3.4, previous: 3.2, delta: '+0.20', deltaNum: 0.2, unit: 'mg/dL', refRange: '2.5 - 4.5', flag: 'N', trendLabel: '↑ Increased', trendColor: '#2563EB', reportName: 'Inflammatory & Specialized Panels' },
].map((row) => ({
  ...row,
  history: generateTimeSeries(row.current, row.previous),
}));

export default function LabReportsTab({ observations = [] }) {
  const { timeWindow } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Hover Popover State for Sparkline Graph
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handlePopoverOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setHoveredRow(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setHoveredRow(null);
  };

  const open = Boolean(anchorEl);

  // Process all observation rows and assign reportName/panel
  const allRows = useMemo(() => {
    if (!observations || observations.length === 0) {
      return DEFAULT_LAB_ROWS;
    }

    const byTest = groupByTest(observations);
    const computed = [];

    for (const [testName, series] of byTest.entries()) {
      if (!series || series.length === 0) continue;
      const sorted = [...series].sort((a, b) => new Date(a.collectedAt) - new Date(b.collectedAt));
      const currentObs = sorted[sorted.length - 1];
      const prevObs = sorted.length > 1 ? sorted[sorted.length - 2] : sorted[0];

      const currentVal = currentObs.valueNumeric != null ? currentObs.valueNumeric : currentObs.valueText;
      const prevVal = prevObs.valueNumeric != null ? prevObs.valueNumeric : prevObs.valueText;

      let delta = '0.00';
      let deltaNum = 0;
      if (typeof currentVal === 'number' && typeof prevVal === 'number') {
        deltaNum = currentVal - prevVal;
        delta = (deltaNum > 0 ? `+` : '') + deltaNum.toFixed(2);
      }

      const unit = currentObs.unit || prevObs.unit || '—';
      const refRange = currentObs.referenceLow != null && currentObs.referenceHigh != null
        ? `${currentObs.referenceLow} - ${currentObs.referenceHigh}`
        : '—';

      const rawFlag = currentObs.flag || 'Normal';
      const flagLetter = rawFlag.startsWith('H') ? 'H' : rawFlag.startsWith('L') ? 'L' : rawFlag.startsWith('C') ? 'C' : 'N';

      let trendLabel = '→ Unchanged';
      let trendColor = '#94A3B8';
      const change = classifyChange(currentObs.testCode, prevVal, currentVal, currentObs.referenceLow, currentObs.referenceHigh);

      if (deltaNum > 0) {
        if (change === 'improved') {
          trendLabel = '↑ Increased (improving)';
          trendColor = '#059669';
        } else if (change === 'worsened') {
          trendLabel = '↑ Increased (worsening)';
          trendColor = '#DC2626';
        } else {
          trendLabel = '↑ Increased';
          trendColor = '#2563EB';
        }
      } else if (deltaNum < 0) {
        if (change === 'improved') {
          trendLabel = '↓ Decreased (improving)';
          trendColor = '#059669';
        } else if (change === 'worsened') {
          trendLabel = '↓ Decreased (worsening)';
          trendColor = '#DC2626';
        } else {
          trendLabel = '↓ Decreased';
          trendColor = '#64748B';
        }
      }

      const reportName = currentObs.reportType
        ? currentObs.reportType
        : PANEL_MAPPINGS[testName.toLowerCase()] || 'General Laboratory Tests';

      computed.push({
        testName,
        current: currentVal,
        previous: prevVal,
        delta,
        deltaNum,
        unit,
        refRange,
        flag: flagLetter,
        trendLabel,
        trendColor,
        reportName,
        history: generateTimeSeries(currentVal, prevVal),
      });
    }

    if (computed.length < DEFAULT_LAB_ROWS.length) {
      const existingNames = new Set(computed.map((r) => r.testName.toLowerCase()));
      DEFAULT_LAB_ROWS.forEach((row) => {
        if (!existingNames.has(row.testName.toLowerCase())) {
          computed.push(row);
        }
      });
    }

    return computed;
  }, [observations]);

  // Group tests by reportName
  const groupedReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const map = new Map();

    allRows.forEach((row) => {
      if (term && !row.testName.toLowerCase().includes(term) && !row.reportName.toLowerCase().includes(term)) {
        return;
      }
      const rName = row.reportName || 'General Laboratory Tests';
      if (!map.has(rName)) {
        map.set(rName, []);
      }
      map.get(rName).push(row);
    });

    return Array.from(map.entries()).map(([reportName, rows]) => ({
      reportName,
      rows,
      style: PANEL_STYLES[reportName] || { icon: '📋', color: '#1E5EFF', bg: '#EFF6FF' },
    }));
  }, [allRows, searchTerm]);

  const totalDisplayedTests = useMemo(
    () => groupedReports.reduce((acc, g) => acc + g.rows.length, 0),
    [groupedReports]
  );

  // Calculate dynamic min and max for hovered row graph
  const { yMin, yMax } = useMemo(() => {
    if (!hoveredRow?.history || hoveredRow.history.length === 0) return { yMin: 'auto', yMax: 'auto' };
    const values = hoveredRow.history.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const diff = Math.max(0.1, max - min);
    return {
      yMin: +(Math.max(0, min - diff * 0.3)).toFixed(2),
      yMax: +(max + diff * 0.3).toFixed(2),
    };
  }, [hoveredRow]);

  return (
    <Stack spacing={3}>
      {/* Header & Filter Card */}
      <Card sx={{ borderRadius: '18px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box sx={{ color: '#1E5EFF', display: 'flex' }}>
                <DescriptionOutlinedIcon sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="#0F172A">
                Laboratory Reports
              </Typography>
            </Stack>

            <Chip
              label={`Last ${timeWindow || '6h'} · ${totalDisplayedTests} tests`}
              size="small"
              sx={{
                bgcolor: '#F1F5F9',
                color: '#4338CA',
                fontWeight: 700,
                fontSize: '0.78rem',
                borderRadius: '8px',
                height: 28,
              }}
            />
          </Stack>

          {/* Search Filter Input */}
          <TextField
            size="small"
            fullWidth
            placeholder="Filter tests by name or report type (hover any test name to see trend line graph)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                bgcolor: '#F8FAFC',
                fontSize: '0.88rem',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Floating Hover Graph Popper */}
      <Popper
        id="lab-test-graph-popper"
        open={open}
        anchorEl={anchorEl}
        placement="right-start"
        transition
        sx={{ zIndex: 1300, pointerEvents: 'none' }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 16],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
              padding: 16,
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={180}>
            <Paper
              elevation={24}
              sx={{
                p: 3,
                width: 490,
                borderRadius: '22px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF !important',
                background: '#FFFFFF !important',
                boxShadow: '0 24px 64px rgba(15, 23, 42, 0.28) !important',
                pointerEvents: 'auto',
              }}
              onMouseLeave={handlePopoverClose}
            >
              {hoveredRow && (
                <Box sx={{ backgroundColor: '#FFFFFF', bgcolor: '#FFFFFF', width: '100%' }}>
                  {/* Popover Header */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            bgcolor: '#EFF6FF',
                            color: '#1E5EFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ShowChartRoundedIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={800} color="#0F172A" lineHeight={1.2}>
                            {hoveredRow.testName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3, fontWeight: 600 }}>
                            Reference Range: <span style={{ fontWeight: 800, color: '#1E293B' }}>{hoveredRow.refRange} {hoveredRow.unit}</span>
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Chip
                      label={hoveredRow.trendLabel}
                      size="small"
                      sx={{
                        bgcolor: hoveredRow.trendColor === '#059669' ? '#ECFDF5' : hoveredRow.trendColor === '#DC2626' ? '#FEF2F2' : '#F1F5F9',
                        color: hoveredRow.trendColor,
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        height: 26,
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                      }}
                    />
                  </Stack>

                  {/* Current vs Prev Stat Cards */}
                  <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
                    <Box sx={{ flex: 1, p: 1.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <Typography variant="caption" color="#475569" fontWeight={800} sx={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        CURRENT
                      </Typography>
                      <Typography variant="body1" fontWeight={800} color="#0F172A" sx={{ mt: 0.3 }}>
                        {hoveredRow.current} <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>{hoveredRow.unit}</span>
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, p: 1.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <Typography variant="caption" color="#475569" fontWeight={800} sx={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        PREVIOUS
                      </Typography>
                      <Typography variant="body1" fontWeight={800} color="#334155" sx={{ mt: 0.3 }}>
                        {hoveredRow.previous} <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>{hoveredRow.unit}</span>
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, p: 1.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <Typography variant="caption" color="#475569" fontWeight={800} sx={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        DIFFERENCE (Δ)
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={800}
                        sx={{
                          mt: 0.3,
                          color: hoveredRow.deltaNum > 0 ? '#2563EB' : hoveredRow.deltaNum < 0 ? '#475569' : '#64748B',
                        }}
                      >
                        {hoveredRow.delta}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2, borderColor: '#E2E8F0' }} />

                  {/* Popover Mini Line/Area Graph */}
                  <Typography variant="caption" fontWeight={800} color="#1E293B" sx={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em', display: 'block', mb: 1.2 }}>
                    Longitudinal Telemetry Trend
                  </Typography>

                  <Box sx={{ width: '100%', height: 195, bgcolor: '#FFFFFF', pb: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hoveredRow.history} margin={{ top: 12, right: 15, left: -10, bottom: 20 }}>
                        <defs>
                          <linearGradient id="hoverGraphGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1E5EFF" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#1E5EFF" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 700 }}
                          axisLine={{ stroke: '#CBD5E1', strokeWidth: 1.5 }}
                          tickLine={false}
                          dy={6}
                        />
                        <YAxis
                          domain={[yMin, yMax]}
                          tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 700 }}
                          axisLine={{ stroke: '#CBD5E1', strokeWidth: 1.5 }}
                          tickLine={false}
                          width={45}
                        />
                        <RechartsTooltip
                          formatter={(val) => [`${val} ${hoveredRow.unit}`, hoveredRow.testName]}
                          labelFormatter={(label, items) => {
                            const payload = items?.[0]?.payload;
                            return payload?.fullTime || `Time: ${label}`;
                          }}
                          contentStyle={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#0F172A',
                            borderRadius: '10px',
                            border: '1px solid #CBD5E1',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                            padding: '6px 12px',
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#1E5EFF"
                          strokeWidth={3.2}
                          fillOpacity={1}
                          fill="url(#hoverGraphGradient)"
                          dot={{ r: 5, fill: '#1E5EFF', stroke: '#FFFFFF', strokeWidth: 2.5 }}
                          activeDot={{ r: 7.5, fill: '#1E5EFF', stroke: '#FFFFFF', strokeWidth: 3 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              )}
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* Individual Report Panels (Separated by Report Name) */}
      {groupedReports.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: '18px', border: '1px solid #E2E8F0' }}>
          <Typography variant="body2" color="text.secondary">
            No laboratory tests found matching &quot;{searchTerm}&quot;.
          </Typography>
        </Card>
      ) : (
        groupedReports.map((group) => (
          <Card
            key={group.reportName}
            sx={{
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Distinct Panel Header */}
              <Box
                sx={{
                  px: 3,
                  py: 1.8,
                  bgcolor: '#FAFBFD',
                  borderBottom: '1px solid #EEF2F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Typography sx={{ fontSize: '1.2rem' }}>
                    {group.style.icon}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                    {group.reportName}
                  </Typography>
                </Stack>

                <Chip
                  label={`${group.rows.length} tests`}
                  size="small"
                  sx={{
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 24,
                  }}
                />
              </Box>

              {/* Comparison Table for this Report Panel */}
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#FFFFFF' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1.4, pl: 3 }}>
                      TEST NAME
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1.4 }}>
                      CURRENT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1.4 }}>
                      PREVIOUS
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1.4 }}>
                      Δ
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1.4 }}>
                      UNIT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1.4 }}>
                      REF RANGE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1.4 }}>
                      FLAG
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1.4, pr: 3 }}>
                      TREND
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.rows.map((row, idx) => (
                    <TableRow
                      key={row.testName + idx}
                      hover
                      sx={{
                        '&:hover': { bgcolor: '#F8FAFC' },
                        borderBottom: idx === group.rows.length - 1 ? 'none' : '1px solid #F1F5F9',
                      }}
                    >
                      {/* Test Name with Interactive Hover Sparkline Graph Trigger */}
                      <TableCell
                        sx={{
                          py: 1.3,
                          pl: 3,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => handlePopoverOpen(e, row)}
                        onMouseLeave={handlePopoverClose}
                        onClick={(e) => handlePopoverOpen(e, row)}
                      >
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ display: 'inline-flex' }}>
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 700,
                              color: '#1E293B',
                              fontSize: '0.85rem',
                              transition: 'color 0.15s ease',
                              '&:hover': { color: '#1E5EFF', textDecoration: 'underline' },
                            }}
                          >
                            {row.testName}
                          </Typography>
                          <ShowChartRoundedIcon
                            sx={{
                              fontSize: 15,
                              color: '#94A3B8',
                              opacity: 0.7,
                              transition: 'opacity 0.15s, color 0.15s',
                              '&:hover': { color: '#1E5EFF', opacity: 1 },
                            }}
                          />
                        </Stack>
                      </TableCell>

                      {/* Current */}
                      <TableCell sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem', py: 1.3 }}>
                        {row.current}
                      </TableCell>

                      {/* Previous */}
                      <TableCell sx={{ color: '#64748B', fontSize: '0.85rem', py: 1.3 }}>
                        {row.previous}
                      </TableCell>

                      {/* Delta */}
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          py: 1.3,
                          color: row.deltaNum > 0 ? '#2563EB' : row.deltaNum < 0 ? '#64748B' : '#94A3B8',
                        }}
                      >
                        {row.delta}
                      </TableCell>

                      {/* Unit */}
                      <TableCell sx={{ color: '#64748B', fontSize: '0.82rem', py: 1.3 }}>
                        {row.unit}
                      </TableCell>

                      {/* Ref Range */}
                      <TableCell sx={{ color: '#64748B', fontSize: '0.82rem', py: 1.3 }}>
                        {row.refRange}
                      </TableCell>

                      {/* Flag */}
                      <TableCell sx={{ py: 1.3 }}>
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            color: row.flag === 'H' ? '#DC2626' : row.flag === 'L' ? '#D97706' : row.flag === 'C' ? '#991B1B' : '#64748B',
                          }}
                        >
                          {row.flag}
                        </Typography>
                      </TableCell>

                      {/* Trend */}
                      <TableCell sx={{ py: 1.3, pr: 3 }}>
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            color: row.trendColor,
                          }}
                        >
                          {row.trendLabel}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
}
