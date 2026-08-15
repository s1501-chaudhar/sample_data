import { useMemo, useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import {
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Area, AreaChart
} from 'recharts';
import { computePatientSofa, SOFA_ORGAN_CRITERIA } from '../../utils/sofaUtils';

export default function SofaScoreTab({ observations, meta }) {
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState(null);

  const sofaData = useMemo(
    () => computePatientSofa(observations, meta),
    [observations, meta]
  );

  const { currentTotal, previousTotal, organs, trendHistory, currentWindow } = sofaData;

  // Active values (dynamically reflect hovered trend point if hovering on the trend graph)
  const displayTotal = hoveredTrendPoint ? hoveredTrendPoint.sofa : currentTotal;
  const displayPrevious = hoveredTrendPoint ? (hoveredTrendPoint.prevSofa != null ? hoveredTrendPoint.prevSofa : previousTotal) : previousTotal;
  const displayWindow = hoveredTrendPoint ? hoveredTrendPoint.time : currentWindow;

  // Dynamic organ sub-scores
  const organCards = [
    {
      key: 'respiration',
      label: 'RESPIRATION',
      score: hoveredTrendPoint && hoveredTrendPoint.respiration != null ? hoveredTrendPoint.respiration : organs.respiration.score,
      valueStr: organs.respiration.valueStr,
      evidence: organs.respiration.evidence,
      criteria: SOFA_ORGAN_CRITERIA.respiration
    },
    {
      key: 'coagulation',
      label: 'COAGULATION',
      score: hoveredTrendPoint && hoveredTrendPoint.coagulation != null ? hoveredTrendPoint.coagulation : organs.coagulation.score,
      valueStr: organs.coagulation.valueStr,
      evidence: organs.coagulation.evidence,
      criteria: SOFA_ORGAN_CRITERIA.coagulation
    },
    {
      key: 'liver',
      label: 'LIVER',
      score: hoveredTrendPoint && hoveredTrendPoint.liver != null ? hoveredTrendPoint.liver : organs.liver.score,
      valueStr: organs.liver.valueStr,
      evidence: organs.liver.evidence,
      criteria: SOFA_ORGAN_CRITERIA.liver
    },
    {
      key: 'cardio',
      label: 'CARDIO',
      score: hoveredTrendPoint && hoveredTrendPoint.cardio != null ? hoveredTrendPoint.cardio : organs.cardio.score,
      valueStr: organs.cardio.valueStr,
      evidence: organs.cardio.evidence,
      criteria: SOFA_ORGAN_CRITERIA.cardiovascular
    },
    {
      key: 'cns',
      label: 'CNS',
      score: hoveredTrendPoint && hoveredTrendPoint.cns != null ? hoveredTrendPoint.cns : organs.cns.score,
      valueStr: organs.cns.valueStr,
      evidence: organs.cns.evidence,
      criteria: SOFA_ORGAN_CRITERIA.cns
    },
    {
      key: 'renal',
      label: 'RENAL',
      score: hoveredTrendPoint && hoveredTrendPoint.renal != null ? hoveredTrendPoint.renal : organs.renal.score,
      valueStr: organs.renal.valueStr,
      evidence: organs.renal.evidence,
      criteria: SOFA_ORGAN_CRITERIA.renal
    },
  ];

  const isImproved = displayTotal < displayPrevious;
  const isWorsened = displayTotal > displayPrevious;

  // Custom Tooltip component that cleanly syncs state with the top score cards
  const CustomTrendTooltip = ({ active, payload }) => {
    useEffect(() => {
      if (active && payload && payload.length > 0) {
        setHoveredTrendPoint(payload[0].payload);
      } else {
        setHoveredTrendPoint(null);
      }
    }, [active, payload]);

    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
      <Box sx={{ p: 1.5, bgcolor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.16)' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block' }}>
          Time Window: <span style={{ color: '#0F172A' }}>{data.time}</span>
        </Typography>
        <Typography variant="body2" fontWeight={800} color="#1E5EFF" sx={{ mt: 0.3 }}>
          Total SOFA Score: {data.sofa} points
        </Typography>
        {data.prevSofa != null && (
          <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ display: 'block', mt: 0.2 }}>
            Previous Window Score: {data.prevSofa}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Stack spacing={2.5}>
      {/* Top SOFA Score Section */}
      <Card sx={{ bgcolor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', p: 1 }}>
        <CardContent sx={{ p: 2.5 }}>
          {/* Header Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box
                sx={{
                  color: '#1E5EFF',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <MonitorHeartRoundedIcon sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="#0F172A">
                SOFA Score
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {hoveredTrendPoint ? (
                <Chip
                  icon={<AccessTimeRoundedIcon sx={{ fontSize: '15px !important', color: '#1E5EFF !important' }} />}
                  label={`Window: ${displayWindow}`}
                  size="small"
                  sx={{
                    bgcolor: '#EFF6FF',
                    color: '#1E5EFF',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    borderRadius: '8px',
                    border: '1px solid #BFDBFE',
                  }}
                />
              ) : (
                <Chip
                  label={`Window: ${currentWindow}`}
                  size="small"
                  sx={{
                    bgcolor: '#F1F5F9',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    borderRadius: '8px',
                  }}
                />
              )}
            </Stack>
          </Stack>

          {/* Current vs Previous SOFA Header */}
          <Box sx={{ mb: 2.5, p: 2, bgcolor: '#FAFBFD', borderRadius: '14px', border: '1px solid #EEF2F6' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {hoveredTrendPoint ? `SOFA SCORE (WINDOW: ${hoveredTrendPoint.time})` : 'CURRENT SOFA'}
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={3} sx={{ mt: 0.5 }}>
              <Typography
                sx={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: displayTotal === 0 ? '#10B981' : displayTotal <= 2 ? '#0284C7' : displayTotal <= 5 ? '#D97706' : '#DC2626',
                  lineHeight: 1,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}
              >
                {displayTotal}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  PREVIOUS
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#334155">
                  {displayPrevious}
                </Typography>

                {isImproved && (
                  <Chip
                    icon={<TrendingDownRoundedIcon sx={{ fontSize: '14px !important', color: '#059669 !important' }} />}
                    label={`Improved (-${displayPrevious - displayTotal})`}
                    size="small"
                    sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.75rem' }}
                  />
                )}
                {isWorsened && (
                  <Chip
                    icon={<TrendingUpRoundedIcon sx={{ fontSize: '14px !important', color: '#DC2626 !important' }} />}
                    label={`Elevated (+${displayTotal - displayPrevious})`}
                    size="small"
                    sx={{ bgcolor: '#FEF2F2', color: '#DC2626', fontWeight: 700, fontSize: '0.75rem' }}
                  />
                )}
              </Stack>
            </Stack>
          </Box>

          {/* 6 Organ System Boxes organized 3x2 (3 on top row, 3 on bottom row) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {organCards.map((organ) => {
              const scoreColor = organ.score === 0 ? '#10B981' : organ.score <= 1 ? '#0284C7' : organ.score <= 2 ? '#D97706' : '#DC2626';
              return (
                <Box
                  key={organ.key}
                  onClick={() => setSelectedOrgan(organ)}
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#1E5EFF',
                      boxShadow: '0 6px 16px rgba(30, 94, 255, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" fontWeight={700} color="#64748B" sx={{ letterSpacing: '0.04em' }}>
                      {organ.label}
                    </Typography>
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      color: scoreColor,
                      lineHeight: 1.1,
                      my: 0.5,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                    }}
                  >
                    {organ.score}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: 'block', fontSize: '0.75rem' }}>
                    {organ.valueStr}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Subtext info */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', fontStyle: 'italic' }}>
            Click any organ system to see calculation details. Hover on the SOFA Trend chart below to inspect past time window scores.
          </Typography>
        </CardContent>
      </Card>

      {/* SOFA Trend Chart Section (6h, 12h, 18h, 24h buttons removed) */}
      <Card sx={{ bgcolor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', p: 1 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
              SOFA Trend
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hover over any point to inspect SOFA score and organ breakdown at that time window
            </Typography>
          </Box>

          <Box sx={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendHistory}
                margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
                onMouseLeave={() => setHoveredTrendPoint(null)}
              >
                <defs>
                  <linearGradient id="sofaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#1E5EFF" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#1E5EFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="shortTime"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 24]}
                  ticks={[0, 6, 12, 18, 24]}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                  width={35}
                />
                <Tooltip content={<CustomTrendTooltip />} />
                <ReferenceLine y={2} stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'Sepsis Risk Threshold (SOFA ≥ 2)', fill: '#DC2626', fontSize: 10, position: 'insideTopRight' }} />
                <Area
                  type="monotone"
                  dataKey="sofa"
                  stroke="#1E5EFF"
                  strokeWidth={2.8}
                  fill="url(#sofaAreaGrad)"
                  dot={{ r: 4.5, fill: '#1E5EFF', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7, fill: '#1E5EFF', stroke: '#FFFFFF', strokeWidth: 2.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Interactive Calculation Breakdown Modal */}
      <Dialog
        open={Boolean(selectedOrgan)}
        onClose={() => setSelectedOrgan(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 1,
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
          },
        }}
      >
        {selectedOrgan && (
          <>
            <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" fontWeight={800} color="#0F172A">
                  {selectedOrgan.label} — Calculation Details
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Evaluated Variable: <b>{selectedOrgan.criteria.variable}</b> ({selectedOrgan.criteria.unit})
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedOrgan(null)}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              <Stack spacing={2.5}>
                {/* Result highlight banner */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: selectedOrgan.score === 0 ? '#ECFDF5' : selectedOrgan.score <= 2 ? '#EFF6FF' : '#FEF2F2',
                    border: `1px solid ${selectedOrgan.score === 0 ? '#A7F3D0' : selectedOrgan.score <= 2 ? '#BFDBFE' : '#FECACA'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                      Assigned Score
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color={selectedOrgan.score === 0 ? '#059669' : '#1E5EFF'}>
                      {selectedOrgan.score} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748B' }}>/ 4</span>
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#334155" sx={{ mt: 0.5 }}>
                      {selectedOrgan.evidence}
                    </Typography>
                  </Box>
                  <Chip
                    label={selectedOrgan.score === 0 ? 'Normal Function' : `Dysfunction +${selectedOrgan.score}`}
                    size="small"
                    sx={{
                      bgcolor: selectedOrgan.score === 0 ? '#10B981' : '#1E5EFF',
                      color: '#FFFFFF',
                      fontWeight: 700,
                    }}
                  />
                </Box>

                {/* Criteria Scoring Table */}
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Standard SOFA Scoring Matrix
                  </Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', width: 70 }}>Score</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Threshold Rule</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Clinical State</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrgan.criteria.ranges.map((r) => {
                          const isCurrentMatch = selectedOrgan.score === r.score;
                          return (
                            <TableRow
                              key={r.score}
                              sx={{
                                bgcolor: isCurrentMatch ? 'rgba(30, 94, 255, 0.08)' : 'inherit',
                                '&:hover': { bgcolor: isCurrentMatch ? 'rgba(30, 94, 255, 0.12)' : '#F8FAFC' },
                              }}
                            >
                              <TableCell sx={{ fontWeight: isCurrentMatch ? 800 : 600, color: isCurrentMatch ? '#1E5EFF' : '#475569' }}>
                                {r.score} {isCurrentMatch && '✓'}
                              </TableCell>
                              <TableCell sx={{ fontWeight: isCurrentMatch ? 700 : 500, color: isCurrentMatch ? '#0F172A' : '#475569' }}>
                                {r.rule}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                                {r.desc}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedOrgan(null)} variant="outlined" sx={{ borderRadius: '10px' }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Stack>
  );
}
