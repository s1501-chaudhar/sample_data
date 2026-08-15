import { Box, Card, CardContent, Grid, Typography, Avatar, Stack } from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { fmtDate } from '../../utils/labUtils';

function Field({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} color="#0F172A" sx={{ mt: 0.2 }}>
        {value ?? '—'}
      </Typography>
    </Box>
  );
}

export default function PatientHeader({ meta }) {
  if (!meta) return null;
  return (
    <Card sx={{ mb: 2, borderRadius: '18px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: '#EEF3FF', color: '#1E5EFF' }}>
            <PersonRoundedIcon fontSize="medium" />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={800} color="#0F172A" lineHeight={1.2}>
              {meta.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3, fontSize: '0.85rem' }}>
              {meta.diagnosis}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={6} sm={4} md={2.4}>
            <Field label="Patient ID" value={meta.patientId} />
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Field label="Admission ID" value={meta.admissionId} />
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Field label="Age / Gender" value={`${meta.age} / ${meta.gender}`} />
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Field label="Admission Date" value={fmtDate(meta.admissionDate)} />
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Field label="Attending Physician" value={meta.physician} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
