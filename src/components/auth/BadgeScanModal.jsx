import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Typography, Box, Stack, Button,
  IconButton, CircularProgress, Chip, Avatar
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContactlessRoundedIcon from '@mui/icons-material/ContactlessRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import { motion, AnimatePresence } from 'framer-motion';

export default function BadgeScanModal({ open, onClose, onBadgeLogin }) {
  const [scanning, setScanning] = useState(false);
  const [scannedDoctor, setScannedDoctor] = useState(null);

  useEffect(() => {
    if (open) {
      setScanning(false);
      setScannedDoctor(null);
    }
  }, [open]);

  const handleSimulateScan = (docName, docRole, docDept, badgeId) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedDoctor({
        name: docName,
        role: docRole,
        dept: docDept,
        badgeId: badgeId,
      });

      // Auto login after 1.2s
      setTimeout(() => {
        if (onBadgeLogin) {
          onBadgeLogin(docRole, docName);
        }
      }, 1200);
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          p: 1,
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: 'rgba(14, 165, 233, 0.12)',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ContactlessRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              Hospital RFID / NFC Reader
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Touchless Staff Terminal Authentication
            </Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <AnimatePresence mode="wait">
          {!scannedDoctor ? (
            <motion.div
              key="scanning-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Stack spacing={2.5} alignItems="center" sx={{ py: 2 }}>
                {/* Visual Scanner Area */}
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    bgcolor: '#F0F7FF',
                    border: '2px dashed #93C5FD',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {scanning && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: '#1E5EFF',
                        boxShadow: '0 0 12px #1E5EFF',
                      }}
                      animate={{
                        top: ['0%', '100%', '0%'],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                  <ContactlessRoundedIcon
                    sx={{
                      fontSize: 48,
                      color: scanning ? '#1E5EFF' : '#64748B',
                      transition: 'color 0.3s',
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 600, color: '#64748B' }}>
                    {scanning ? 'Reading...' : 'Tap Badge'}
                  </Typography>
                </Box>

                <Box textAlign="center">
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Hold your Hospital SmartBadge near the sensor
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Supports HID iCLASS, MIFARE DESFire, and Apple/Google Health ID.
                  </Typography>
                </Box>

                {/* Quick Simulation Options */}
                <Box sx={{ width: '100%', pt: 1 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Simulate Badge Tap:
                  </Typography>
                  <Stack spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled={scanning}
                      onClick={() => handleSimulateScan('Dr. Priya Raghavan', 'Doctor', 'Chief Physician', 'BADGE-DOC-8921')}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        p: 1.2,
                        borderRadius: '10px',
                        borderColor: '#E2E8F0',
                        '&:hover': { borderColor: '#1E5EFF', bgcolor: '#F8FAFC' },
                      }}
                    >
                      <Avatar sx={{ width: 28, height: 28, mr: 1.2, bgcolor: '#1E5EFF', fontSize: '0.75rem' }}>PR</Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                          Dr. Priya Raghavan
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Badge #DOC-8921 • Chief of Medicine
                        </Typography>
                      </Box>
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled={scanning}
                      onClick={() => handleSimulateScan('Dr. Sarah Chen', 'Doctor', 'Cardiology Division', 'BADGE-DOC-3419')}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        p: 1.2,
                        borderRadius: '10px',
                        borderColor: '#E2E8F0',
                        '&:hover': { borderColor: '#1E5EFF', bgcolor: '#F8FAFC' },
                      }}
                    >
                      <Avatar sx={{ width: 28, height: 28, mr: 1.2, bgcolor: '#0EA5E9', fontSize: '0.75rem' }}>SC</Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                          Dr. Sarah Chen
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Badge #DOC-3419 • Cardiology Dept.
                        </Typography>
                      </Box>
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled={scanning}
                      onClick={() => handleSimulateScan('Marcus Wright', 'Laboratory Technician', 'Central Pathology', 'BADGE-LAB-7712')}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        p: 1.2,
                        borderRadius: '10px',
                        borderColor: '#E2E8F0',
                        '&:hover': { borderColor: '#1E5EFF', bgcolor: '#F8FAFC' },
                      }}
                    >
                      <Avatar sx={{ width: 28, height: 28, mr: 1.2, bgcolor: '#8B5CF6', fontSize: '0.75rem' }}>MW</Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                          Marcus Wright
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Badge #LAB-7712 • Senior Lab Tech
                        </Typography>
                      </Box>
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Stack spacing={2} alignItems="center" sx={{ py: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: '#ECFDF5',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 40 }} />
                </Box>
                <Box>
                  <Chip
                    label="Badge Verified"
                    color="success"
                    size="small"
                    sx={{ mb: 1, fontWeight: 700 }}
                  />
                  <Typography variant="h6" fontWeight={700}>
                    Welcome, {scannedDoctor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {scannedDoctor.dept} • {scannedDoctor.badgeId}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#1E5EFF', pt: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  <Typography variant="caption" fontWeight={600}>
                    Authenticating clinical session & loading charts...
                  </Typography>
                </Stack>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
