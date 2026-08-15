import { useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  Box, Drawer, Toolbar, AppBar, Typography, Avatar, IconButton, Menu, MenuItem,
  Button, Chip, Stack, FormControl, Select, Divider
} from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { useApp } from '../../context/AppContext';
import ProgressNotesLogo from '../auth/ProgressNotesLogo';

const DRAWER_WIDTH = 300;

export default function AppLayout() {
  const navigate = useNavigate();
  const {
    role, userName, logout, patientsMeta,
    selectedPatientId, setSelectedPatientId,
    selectedAdmissionId, setSelectedAdmissionId,
    timeWindow, setTimeWindow
  } = useApp();

  const [anchorEl, setAnchorEl] = useState(null);
  const isLabUser = role === 'Laboratory Technician' || (role && role.toLowerCase().includes('lab'));

  // Distinct patient IDs
  const patientIds = useMemo(() => {
    const ids = new Set(Object.values(patientsMeta).map((p) => p.patientId));
    return Array.from(ids);
  }, [patientsMeta]);

  // Available admissions for the selected patient
  const availableAdmissions = useMemo(() => {
    if (!selectedPatientId) return [];
    return Object.values(patientsMeta).filter((p) => p.patientId === selectedPatientId);
  }, [patientsMeta, selectedPatientId]);

  // Auto-select first admission if patient changed
  const handlePatientChange = (pid) => {
    setSelectedPatientId(pid);
    const firstAdm = Object.values(patientsMeta).find((p) => p.patientId === pid)?.admissionId || '';
    setSelectedAdmissionId(firstAdm);
    navigate('/dashboard');
  };

  const handleAdmissionChange = (adm) => {
    setSelectedAdmissionId(adm);
    navigate('/dashboard');
  };

  // Active patient metadata for AI summary
  const activeMeta = selectedPatientId && selectedAdmissionId ? patientsMeta[`${selectedPatientId}_${selectedAdmissionId}`] : null;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ================= LEFT SIDEBAR (DRAWER) ================= */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            bgcolor: '#FFFFFF',
            borderRight: '1px solid #E2E8F0',
            px: 2.5,
            py: 2.5,
          },
        }}
      >
        {/* App Logo */}
        <Box sx={{ mb: 3 }}>
          <ProgressNotesLogo size="small" />
        </Box>

        {isLabUser ? (
          /* Lab Technician Sidebar Controls */
          <Stack spacing={2.5}>
            <Chip
              icon={<ScienceRoundedIcon sx={{ fontSize: '15px !important', color: '#8B5CF6 !important' }} />}
              label="Lab Technician Mode"
              size="small"
              sx={{ width: '100%', bgcolor: '#F5F3FF', color: '#6D28D9', fontWeight: 700, fontSize: '0.74rem', py: 1.8 }}
            />

            <Box
              sx={{
                p: 2,
                borderRadius: '14px',
                bgcolor: '#EFF6FF',
                border: '1px solid #DBEAFE',
                color: '#1E40AF',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                <CloudUploadRoundedIcon fontSize="small" />
                <Typography variant="subtitle2" fontWeight={800}>
                  Upload Workstation
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ display: 'block', color: '#3B82F6', lineHeight: 1.4 }}>
                Ingest laboratory reports, CBC/BMP chemistry, and vitals datasets.
              </Typography>
            </Box>
          </Stack>
        ) : (
          /* Doctor / Clinician Sidebar Controls */
          <Stack spacing={2.5}>
            {/* Clinician Badge */}
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Chip
                label={role === 'Nurse' ? 'NURSE' : 'DOCTOR'}
                size="small"
                sx={{
                  bgcolor: '#EEF2FF',
                  color: '#4F46E5',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  borderRadius: '8px',
                }}
              />
              <Typography variant="subtitle2" fontWeight={700} color="#0F172A">
                {userName || 'Dr. Sarah Mitchell'}
              </Typography>
            </Stack>

            {/* Patient Selection Dropdowns */}
            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#64748B"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1.2 }}
              >
                PATIENT SELECTION
              </Typography>

              <Stack spacing={1.8}>
                <FormControl size="small" fullWidth>
                  <Typography variant="caption" color="#475569" fontWeight={600} sx={{ mb: 0.4 }}>
                    Patient ID
                  </Typography>
                  <Select
                    value={selectedPatientId}
                    displayEmpty
                    onChange={(e) => handlePatientChange(e.target.value)}
                    sx={{ borderRadius: '12px', bgcolor: '#F8FAFC', fontSize: '0.85rem' }}
                  >
                    <MenuItem value="">
                      <em>— Select Patient —</em>
                    </MenuItem>
                    {patientIds.map((pid) => (
                      <MenuItem key={pid} value={pid}>
                        {pid}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth disabled={!selectedPatientId}>
                  <Typography variant="caption" color="#475569" fontWeight={600} sx={{ mb: 0.4 }}>
                    Admission ID
                  </Typography>
                  <Select
                    value={selectedAdmissionId}
                    displayEmpty
                    onChange={(e) => handleAdmissionChange(e.target.value)}
                    sx={{ borderRadius: '12px', bgcolor: '#F8FAFC', fontSize: '0.85rem' }}
                  >
                    <MenuItem value="">
                      <em>— Select Admission —</em>
                    </MenuItem>
                    {availableAdmissions.map((adm) => (
                      <MenuItem key={adm.admissionId} value={adm.admissionId}>
                        {adm.admissionId}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            {/* Time Window Buttons */}
            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#64748B"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1.2 }}
              >
                TIME WINDOW
              </Typography>
              <Stack direction="row" spacing={0.8}>
                {['6h', '12h', '18h', '24h'].map((w) => {
                  const isSelected = timeWindow === w;
                  return (
                    <Button
                      key={w}
                      size="small"
                      onClick={() => setTimeWindow(w)}
                      sx={{
                        flex: 1,
                        py: 0.6,
                        borderRadius: '9px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textTransform: 'none',
                        bgcolor: isSelected ? '#1E5EFF' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        boxShadow: isSelected ? '0 4px 10px rgba(30, 94, 255, 0.25)' : 'none',
                        '&:hover': {
                          bgcolor: isSelected ? '#184ED8' : '#E2E8F0',
                        },
                      }}
                    >
                      {w}
                    </Button>
                  );
                })}
              </Stack>
            </Box>

            <Divider sx={{ my: 0.5 }} />

            {/* AI Progress Summary */}
            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#64748B"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1.2 }}
              >
                AI PROGRESS SUMMARY
              </Typography>

              {!activeMeta ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Select a patient and admission to generate the AI progress summary.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #EEF2F6' }}>
                    <Typography variant="caption" fontWeight={800} color="#1E5EFF" sx={{ display: 'block', mb: 0.4, letterSpacing: '0.04em' }}>
                      SOFA
                    </Typography>
                    <Typography variant="body2" color="#334155" sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                      Current SOFA score is <b>0</b>, improved from 1 six hours earlier. All organ system components are 0, including respiration, coagulation, liver, cardiovascular, CNS, and renal.
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #EEF2F6' }}>
                    <Typography variant="caption" fontWeight={800} color="#059669" sx={{ display: 'block', mb: 0.4, letterSpacing: '0.04em' }}>
                      VITALS
                    </Typography>
                    <Typography variant="body2" color="#334155" sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                      SpO2 is <b>97.2%</b>, slightly down from 96.9%. MAP is <b>82 mmHg</b> (stable). Temperature normal at <b>36.9°C</b>.
                    </Typography>
                  </Box>
                </Stack>
              )}
            </Box>
          </Stack>
        )}
      </Drawer>

      {/* ================= RIGHT MAIN AREA ================= */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', color: 'text.primary', borderBottom: '1px solid #E7EBF3' }}>
          <Toolbar sx={{ gap: 2, px: 3 }}>
            {isLabUser && (
              <Typography variant="subtitle2" fontWeight={700} color="#64748B">
                Laboratory Report Processing Terminal
              </Typography>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                size="small"
                onClick={() => { logout(); navigate('/login'); }}
                sx={{
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  '&:hover': { color: '#0F172A', bgcolor: '#F1F5F9' },
                }}
              >
                Sign Out
              </Button>

              <Chip
                label="● API Online"
                size="small"
                sx={{
                  bgcolor: '#F8FAFC',
                  color: '#475569',
                  border: '1px solid #E2E8F0',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 26,
                }}
              />

              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                <Avatar sx={{ width: 32, height: 32, bgcolor: isLabUser ? '#8B5CF6' : '#1E5EFF', fontSize: '0.85rem' }}>
                  {(userName || '?').slice(0, 1).toUpperCase()}
                </Avatar>
              </IconButton>
            </Stack>

            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled sx={{ opacity: '1 !important' }}>
                <Box>
                  <Typography variant="body2" fontWeight={700}>{userName}</Typography>
                  <Typography variant="caption" color="text.secondary">{role || 'Doctor'}</Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={() => { logout(); navigate('/login'); }}>
                <LogoutRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
