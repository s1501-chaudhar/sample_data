import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, InputAdornment, Grid, Card, CardContent, Avatar,
  Chip, Stack,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CardSkeletons } from '../components/common/LoadingSkeleton';

export default function Patients() {
  const { patients, loading, loadData, observations } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      [p.name, p.patientId, p.admissionId, p.mrn, p.diagnosis].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [patients, query]);

  const criticalByPatient = useMemo(() => {
    const map = {};
    for (const o of observations) {
      if (o.flag === 'High' || o.flag === 'Critical') {
        const key = `${o.patientId}_${o.admissionId}`;
        map[key] = (map[key] || 0) + 1;
      }
    }
    return map;
  }, [observations]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>Patients</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {patients.length} patient records across {new Set(patients.map((p) => p.patientId)).size} unique patients.
      </Typography>

      <TextField
        placeholder="Search by Patient ID, Admission ID, MRN or Name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        sx={{ mb: 3, maxWidth: 480 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" color="action" /></InputAdornment> }}
      />

      {loading ? (
        <CardSkeletons count={6} />
      ) : (
        <Grid container spacing={2}>
          {filtered.map((p, idx) => {
            const key = `${p.patientId}_${p.admissionId}`;
            const criticalCount = criticalByPatient[key] || 0;
            return (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: idx * 0.02 }}>
                  <Card
                    sx={{ cursor: 'pointer', height: '100%', transition: 'box-shadow .2s', '&:hover': { boxShadow: '0 6px 20px rgba(20,40,90,0.08)' } }}
                    onClick={() => navigate(`/patients/${p.patientId}/${p.admissionId}`)}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.2 }}>
                        <Avatar sx={{ bgcolor: '#EEF3FF', color: 'primary.main' }}><PersonRoundedIcon /></Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle2" fontWeight={700} noWrap>{p.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.patientId} / {p.admissionId} \u00b7 {p.age}{p.gender?.[0]}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 40 }}>
                        {p.diagnosis}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip size="small" label={p.dischargeDate ? 'Discharged' : 'Active'} sx={{
                          bgcolor: p.dischargeDate ? '#EEF1F7' : '#E7F7EE',
                          color: p.dischargeDate ? '#6B7488' : '#1DA35C', fontWeight: 700,
                        }} />
                        {criticalCount > 0 && (
                          <Chip size="small" label={`${criticalCount} abnormal`} sx={{ bgcolor: '#FCEBEC', color: '#D8434A', fontWeight: 700 }} />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
