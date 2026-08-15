import { useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Card, Stack, Tabs, Tab
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

import { useApp } from '../context/AppContext';
import PatientHeader from '../components/patient/PatientHeader';
import SofaScoreTab from '../components/patient/SofaScoreTab';
import VitalsTab from '../components/patient/VitalsTab';
import LabReportsTab from '../components/patient/LabReportsTab';
import RadiologyTab from '../components/patient/RadiologyTab';
import TimelineTab from '../components/patient/TimelineTab';
import OriginalReportsTab from '../components/patient/OriginalReportsTab';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

const TABS = [
  'SOFA Score',
  'Vitals',
  'Laboratory Reports',
  'Radiology Reports',
  'Timeline',
  'Original Reports',
];

export default function Dashboard() {
  const {
    observations, loading, loadData, patientsMeta,
    selectedPatientId, selectedAdmissionId
  } = useApp();

  const [tab, setTab] = useState(0);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Active patient metadata and observations
  const activeMeta = selectedPatientId && selectedAdmissionId ? patientsMeta[`${selectedPatientId}_${selectedAdmissionId}`] : null;
  const activeObs = useMemo(() => {
    if (!selectedPatientId || !selectedAdmissionId) return [];
    return observations.filter((o) => o.patientId === selectedPatientId && o.admissionId === selectedAdmissionId);
  }, [observations, selectedPatientId, selectedAdmissionId]);

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 120px)' }}>
      {!activeMeta ? (
        /* Empty State matching screenshot */
        <Card
          sx={{
            minHeight: 520,
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
          }}
        >
          <Box sx={{ maxWidth: 420 }}>
            <Box
              sx={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                bgcolor: '#F1F5F9',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <PersonOutlineRoundedIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="#0F172A">
              Select a patient and admission to begin
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
              Use the sidebar to choose Patient ID and Admission ID
            </Typography>
          </Box>
        </Card>
      ) : (
        /* Active Patient Progress View */
        <Stack spacing={2.5}>
          <PatientHeader meta={activeMeta} />

          <Card sx={{ borderRadius: '18px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', p: 0.5 }}>
            <Tabs
              value={tab}
              onChange={(e, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 1.5,
                '& .MuiTabs-indicator': { height: 3, borderRadius: '3px', bgcolor: '#1E5EFF' },
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.88rem', minHeight: 48 },
              }}
            >
              {TABS.map((t) => (
                <Tab key={t} label={t} />
              ))}
            </Tabs>
          </Card>

          {loading ? (
            <TableSkeleton rows={6} />
          ) : (
            <Box>
              {tab === 0 && <SofaScoreTab observations={activeObs} meta={activeMeta} />}
              {tab === 1 && <VitalsTab observations={activeObs} meta={activeMeta} />}
              {tab === 2 && <LabReportsTab observations={activeObs} />}
              {tab === 3 && <RadiologyTab radiologyReports={[]} />}
              {tab === 4 && <TimelineTab observations={activeObs} />}
              {tab === 5 && <OriginalReportsTab observations={activeObs} />}
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
}
