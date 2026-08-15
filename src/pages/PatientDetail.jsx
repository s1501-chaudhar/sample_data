import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Button } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useApp } from '../context/AppContext';
import PatientHeader from '../components/patient/PatientHeader';
import OverviewTab from '../components/patient/OverviewTab';
import SofaScoreTab from '../components/patient/SofaScoreTab';
import VitalsTab from '../components/patient/VitalsTab';
import LabReportsTab from '../components/patient/LabReportsTab';
import RadiologyTab from '../components/patient/RadiologyTab';
import TimelineTab from '../components/patient/TimelineTab';
import GraphsTab from '../components/patient/GraphsTab';
import OriginalReportsTab from '../components/patient/OriginalReportsTab';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

const TABS = ['Overview', 'SOFA Score', 'Vitals', 'Laboratory Reports', 'Radiology Reports', 'Timeline', 'Graphs', 'Original Reports'];

export default function PatientDetail() {
  const { patientId, admissionId } = useParams();
  const navigate = useNavigate();
  const { observations, loading, loadData, patientsMeta } = useApp();
  const [tab, setTab] = useState(0);

  useEffect(() => { loadData(); }, [loadData]);

  const meta = patientsMeta[`${patientId}_${admissionId}`];
  const patientObs = useMemo(
    () => observations.filter((o) => o.patientId === patientId && o.admissionId === admissionId),
    [observations, patientId, admissionId]
  );

  return (
    <Box>
      <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/patients')} sx={{ mb: 2 }} color="inherit">
        Back to Patients
      </Button>

      {!meta ? (
        <Typography color="text.secondary">Patient not found in demo dataset.</Typography>
      ) : (
        <>
          <PatientHeader meta={meta} />
          <Tabs
            value={tab} onChange={(e, v) => setTab(v)}
            sx={{ mb: 2.5, '& .MuiTabs-indicator': { height: 3, borderRadius: '3px' } }}
          >
            {TABS.map((t) => <Tab key={t} label={t} sx={{ textTransform: 'none', fontWeight: 600 }} />)}
          </Tabs>

          {loading ? (
            <TableSkeleton rows={6} />
          ) : (
            <>
              {tab === 0 && <OverviewTab observations={patientObs} />}
              {tab === 1 && <SofaScoreTab observations={patientObs} meta={meta} />}
              {tab === 2 && <VitalsTab observations={patientObs} meta={meta} />}
              {tab === 3 && <LabReportsTab observations={patientObs} />}
              {tab === 4 && <RadiologyTab radiologyReports={[]} />}
              {tab === 5 && <TimelineTab observations={patientObs} />}
              {tab === 6 && <GraphsTab observations={patientObs} />}
              {tab === 7 && <OriginalReportsTab observations={patientObs} />}
            </>
          )}
        </>
      )}
    </Box>
  );
}
