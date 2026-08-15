import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useApp } from '../context/AppContext';
import TimelineTab from '../components/patient/TimelineTab';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

export default function PatientTimeline() {
  const { observations, loading, loadData, patients } = useApp();
  const [key, setKey] = useState('');

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (!key && patients.length) setKey(`${patients[0].patientId}_${patients[0].admissionId}`); }, [patients, key]);

  const [patientId, admissionId] = key.split('_');
  const patientObs = useMemo(
    () => observations.filter((o) => o.patientId === patientId && o.admissionId === admissionId),
    [observations, patientId, admissionId]
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>Patient Timeline</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Chronological view of every collected report for a selected patient admission.
      </Typography>
      <FormControl size="small" sx={{ minWidth: 280, mb: 2.5 }}>
        <InputLabel>Patient</InputLabel>
        <Select label="Patient" value={key} onChange={(e) => setKey(e.target.value)}>
          {patients.map((p) => (
            <MenuItem key={`${p.patientId}_${p.admissionId}`} value={`${p.patientId}_${p.admissionId}`}>
              {p.name} \u2014 {p.patientId} / {p.admissionId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? <TableSkeleton rows={6} /> : <TimelineTab observations={patientObs} />}
    </Box>
  );
}
