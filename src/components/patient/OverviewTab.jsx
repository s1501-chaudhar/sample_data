import { Box, Card, CardContent, Typography, Grid, Stack, Chip, Divider } from '@mui/material';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import { generateProgressSummary, groupIntoReports, fmtDateTime } from '../../utils/labUtils';
import FlagChip from '../common/FlagChip';

const CHANGE_META = {
  improved: { icon: <TrendingDownRoundedIcon fontSize="small" />, color: '#1DA35C', label: 'Improved' },
  worsened: { icon: <TrendingUpRoundedIcon fontSize="small" />, color: '#D8434A', label: 'Worsened' },
  stable: { icon: <TrendingFlatRoundedIcon fontSize="small" />, color: '#6B7488', label: 'Stable' },
};

export default function OverviewTab({ observations }) {
  const summary = generateProgressSummary(observations);
  const reports = groupIntoReports(observations);
  const latestReport = reports[reports.length - 1];
  const abnormalCount = observations.filter((o) => o.flag === 'High' || o.flag === 'Critical').length;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesomeRoundedIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={700}>Progress Summary</Typography>
            </Stack>
            {summary.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Not enough repeated measurements yet to summarize a trend for this admission.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {summary.map((line, i) => {
                  const meta = CHANGE_META[line.change] || CHANGE_META.stable;
                  return (
                    <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                      <Box sx={{ color: meta.color, mt: 0.2 }}>{meta.icon}</Box>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>{line.text}</Typography>
                      <Chip size="small" label={meta.label} sx={{ bgcolor: `${meta.color}18`, color: meta.color, fontWeight: 700 }} />
                    </Stack>
                  );
                })}
              </Stack>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Generated directly from the Excel observation values for this admission - not a clinical interpretation.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>Quick Stats</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Reports on file</Typography>
                  <Typography variant="h5" fontWeight={800}>{reports.length}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Abnormal results</Typography>
                  <Typography variant="h5" fontWeight={800} color={abnormalCount ? 'error.main' : 'text.primary'}>{abnormalCount}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <ScienceRoundedIcon fontSize="small" color="action" />
                <Typography variant="subtitle1" fontWeight={700}>Most Recent Report</Typography>
              </Stack>
              {latestReport ? (
                <>
                  <Typography variant="body2" fontWeight={700}>{latestReport.reportType}</Typography>
                  <Typography variant="caption" color="text.secondary">{fmtDateTime(latestReport.collectedAt)}</Typography>
                  <Divider sx={{ my: 1.2 }} />
                  <Stack spacing={0.8}>
                    {latestReport.rows.slice(0, 4).map((r) => (
                      <Stack key={r.rowId} direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">{r.testName}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={700}>{r.valueNumeric ?? r.valueText} {r.unit || ''}</Typography>
                          <FlagChip flag={r.flag} />
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">No reports available.</Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
}
