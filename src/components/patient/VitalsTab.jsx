import { useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Chip, Button
} from '@mui/material';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { computePatientVitals } from '../../utils/vitalsUtils';
import { useApp } from '../../context/AppContext';

export default function VitalsTab({ observations, meta }) {
  const { timeWindow, setTimeWindow } = useApp();

  const vitalsData = useMemo(
    () => computePatientVitals(observations, meta),
    [observations, meta]
  );

  const { current, timePoints6h, timePoints24h } = vitalsData;
  const activeSeries = timeWindow === '24h' || timeWindow === '18h' ? timePoints24h : timePoints6h;

  const vitalsCards = [
    { label: 'SPO₂', value: `${current.spo2}`, unit: '%', prev: current.spo2Prev, key: 'spo2' },
    { label: 'SYSTOLIC BP', value: `${current.systolicBp}`, unit: 'mmHg', prev: current.systolicBpPrev, key: 'systolicBp' },
    { label: 'DIASTOLIC BP', value: `${current.diastolicBp}`, unit: 'mmHg', prev: current.diastolicBpPrev, key: 'diastolicBp' },
    { label: 'RESPIRATORY RATE', value: `${current.respiratoryRate}`, unit: 'bpm', prev: current.respiratoryRatePrev, key: 'respiratoryRate' },
    { label: 'TEMPERATURE', value: `${current.temperature}`, unit: '°C', prev: current.temperaturePrev, key: 'temperature' },
    { label: 'PAIN SCORE', value: `${current.painScore}`, unit: '/10', prev: current.painScorePrev, key: 'painScore' },
    { label: 'URINE OUTPUT', value: `${current.urineOutput}`, unit: 'mL/hr', prev: current.urineOutputPrev, key: 'urineOutput' },
  ];

  const chartConfigs = [
    { title: 'SpO₂ (%)', dataKey: 'spo2', stroke: '#1E5EFF', domain: [0, 100], ticks: [0, 25, 50, 100], unit: '%' },
    { title: 'Systolic BP (mmHg)', dataKey: 'systolicBp', stroke: '#4F46E5', domain: [0, 150], ticks: [0, 30, 60, 120], unit: 'mmHg' },
    { title: 'Diastolic BP (mmHg)', dataKey: 'diastolicBp', stroke: '#0284C7', domain: [0, 100], ticks: [0, 20, 40, 80], unit: 'mmHg' },
    { title: 'Respiratory Rate (bpm)', dataKey: 'respiratoryRate', stroke: '#EA580C', domain: [0, 25], ticks: [0, 4, 8, 16], unit: 'bpm' },
    { title: 'Temperature (°C)', dataKey: 'temperature', stroke: '#DC2626', domain: [0, 45], ticks: [0, 10, 20, 40], unit: '°C' },
    { title: 'Pain Score (/10)', dataKey: 'painScore', stroke: '#B91C1C', domain: [0, 10], ticks: [0, 0.25, 0.5, 1], unit: '/10' },
    { title: 'Urine Output (mL/hr)', dataKey: 'urineOutput', stroke: '#16A34A', domain: [0, 100], ticks: [0, 20, 40, 80], unit: 'mL/hr' },
  ];

  return (
    <Stack spacing={3}>
      {/* Vitals Summary Card */}
      <Card sx={{ bgcolor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box sx={{ color: '#1E5EFF', display: 'flex' }}>
                <MonitorHeartRoundedIcon sx={{ fontSize: 26 }} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="#0F172A">
                Vitals
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.2} alignItems="center">
              <Chip
                label={`Last ${timeWindow} · ${activeSeries.length} readings`}
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
              <Stack direction="row" spacing={0.6}>
                {['6h', '12h', '18h', '24h'].map((w) => (
                  <Button
                    key={w}
                    size="small"
                    onClick={() => setTimeWindow(w)}
                    sx={{
                      minWidth: 42,
                      py: 0.4,
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      bgcolor: timeWindow === w ? '#1E5EFF' : '#F1F5F9',
                      color: timeWindow === w ? '#FFFFFF' : '#64748B',
                      boxShadow: timeWindow === w ? '0 2px 8px rgba(30, 94, 255, 0.25)' : 'none',
                      '&:hover': {
                        bgcolor: timeWindow === w ? '#184ED8' : '#E2E8F0',
                      },
                    }}
                  >
                    {w}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Stack>

          {/* Subtitle / Device */}
          <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 2.5 }}>
            Oxygen Device: <span style={{ color: '#0F172A', fontWeight: 700 }}>{current.oxygenDevice}</span>
          </Typography>

          {/* Vitals Metric Cards Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(7, 1fr)',
              },
              gap: 1.5,
            }}
          >
            {vitalsCards.map((v) => (
              <Box
                key={v.key}
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  bgcolor: '#FAFBFD',
                  border: '1px solid #EEF2F6',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 90,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="#64748B"
                  sx={{ letterSpacing: '0.03em', fontSize: '0.7rem', textTransform: 'uppercase' }}
                >
                  {v.label}
                </Typography>

                <Box sx={{ my: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.1,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                    }}
                  >
                    {v.value}
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginLeft: '4px' }}>
                      {v.unit}
                    </span>
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Prev: {v.prev}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Grid of Prominent, Large Vitals Line Graphs (2-column layout) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.5,
        }}
      >
        {chartConfigs.map((cfg) => (
          <Card
            key={cfg.title}
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              p: 0.5,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={800} color="#0F172A" sx={{ mb: 2, fontSize: '0.92rem' }}>
                {cfg.title}
              </Typography>

              <Box sx={{ width: '100%', height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeSeries} margin={{ top: 10, right: 25, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                      axisLine={{ stroke: '#E2E8F0' }}
                      tickLine={false}
                      dy={5}
                    />
                    <YAxis
                      domain={cfg.domain}
                      ticks={cfg.ticks}
                      tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                      axisLine={{ stroke: '#E2E8F0' }}
                      tickLine={false}
                      width={45}
                    />
                    <Tooltip
                      formatter={(val) => [`${val} ${cfg.unit}`, cfg.title]}
                      labelFormatter={(label) => `Time: ${label}`}
                      contentStyle={{
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.82rem',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={cfg.dataKey}
                      stroke={cfg.stroke}
                      strokeWidth={2.8}
                      dot={{ r: 3.5, fill: cfg.stroke, stroke: '#FFFFFF', strokeWidth: 1.5 }}
                      activeDot={{ r: 6, fill: cfg.stroke, stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
