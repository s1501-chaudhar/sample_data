import { useMemo, useState } from 'react';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Box, Stack, Chip } from '@mui/material';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, Legend,
} from 'recharts';
import { groupByTest, fmtDateTime } from '../../utils/labUtils';

export default function GraphsTab({ observations }) {
  const byTest = useMemo(() => groupByTest(observations.filter((o) => o.valueNumeric != null)), [observations]);
  const testNames = useMemo(() => Array.from(byTest.keys()), [byTest]);
  const [selected, setSelected] = useState(testNames[0] || '');
  const activeTest = selected && byTest.has(selected) ? selected : testNames[0];

  const series = byTest.get(activeTest) || [];
  const chartData = series.map((o) => ({
    time: fmtDateTime(o.collectedAt),
    value: o.valueNumeric,
    refLow: o.referenceLow,
    refHigh: o.referenceHigh,
    flag: o.flag,
  }));
  const refLow = series[0]?.referenceLow;
  const refHigh = series[0]?.referenceHigh;
  const unit = series[0]?.unit;

  if (testNames.length === 0) {
    return (
      <Card><CardContent><Typography variant="body2" color="text.secondary">No numeric results available to chart.</Typography></CardContent></Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>Trend Chart</Typography>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Test</InputLabel>
            <Select label="Test" value={activeTest} onChange={(e) => setSelected(e.target.value)}>
              {testNames.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>

        <Box sx={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F7" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit={unit ? ` ${unit}` : ''} width={70} />
              <Tooltip formatter={(v) => [`${v} ${unit || ''}`, activeTest]} />
              <Legend />
              {refLow != null && refHigh != null && (
                <ReferenceArea y1={refLow} y2={refHigh} fill="#1E5EFF" fillOpacity={0.06} label={{ value: 'Reference range', position: 'insideTopRight', fontSize: 10, fill: '#1E5EFF' }} />
              )}
              <Line type="monotone" dataKey="value" name={activeTest} stroke="#1E5EFF" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        {refLow != null && (
          <Chip size="small" label={`Reference range: ${refLow} - ${refHigh} ${unit || ''}`} sx={{ mt: 1, bgcolor: '#EEF3FF', color: 'primary.main', fontWeight: 600 }} />
        )}
      </CardContent>
    </Card>
  );
}
