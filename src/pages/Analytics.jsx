import { useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { groupIntoReports } from '../utils/labUtils';
import { CardSkeletons } from '../components/common/LoadingSkeleton';

const FLAG_PIE_COLORS = { Normal: '#1DA35C', High: '#D8434A', Low: '#E8A317', Critical: '#8E1F26' };

export default function Analytics() {
  const { observations, loading, loadData } = useApp();
  useEffect(() => { loadData(); }, [loadData]);

  const reportsByType = useMemo(() => {
    const reports = groupIntoReports(observations);
    const counts = {};
    for (const r of reports) counts[r.reportType] = (counts[r.reportType] || 0) + 1;
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [observations]);

  const flagBreakdown = useMemo(() => {
    const counts = {};
    for (const o of observations) counts[o.flag] = (counts[o.flag] || 0) + 1;
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [observations]);

  const reportsPerDay = useMemo(() => {
    const reports = groupIntoReports(observations);
    const counts = {};
    for (const r of reports) {
      if (!r.collectedAt) continue;
      const day = new Date(r.collectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      counts[day] = (counts[day] || 0) + 1;
    }
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [observations]);

  if (loading) return <CardSkeletons count={3} />;

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>Analytics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Aggregate view across all patients in the demo dataset.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Reports by Type</Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={reportsByType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F7" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1E5EFF" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Result Flag Breakdown</Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={flagBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                      {flagBreakdown.map((entry) => <Cell key={entry.name} fill={FLAG_PIE_COLORS[entry.name] || '#999'} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Reports Collected per Day</Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={reportsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F7" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0EA5A5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
