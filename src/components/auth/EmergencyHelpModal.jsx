import {
  Dialog, DialogTitle, DialogContent, Typography, Box, Stack,
  IconButton, Chip, Divider, Grid
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const EMERGENCY_CODES = [
  { code: 'Code Blue', desc: 'Adult Medical Emergency / Cardiac Arrest', color: '#1E5EFF', bg: '#EFF6FF' },
  { code: 'Code Red', desc: 'Fire / Smoke Condition in Facility', color: '#DC2626', bg: '#FEF2F2' },
  { code: 'Code Gold', desc: 'Trauma / Multiple Critical Influx', color: '#D97706', bg: '#FFFBEB' },
  { code: 'Code Silver', desc: 'Hostile Situation / Security Response', color: '#475569', bg: '#F8FAFC' },
];

export default function EmergencyHelpModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningAmberRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              Hospital Rapid Contacts & Emergency
            </Typography>
            <Typography variant="caption" color="text.secondary">
              24/7 Clinical Support & IT Helpdesk
            </Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.5}>
          {/* Direct Helpdesk Cards */}
          <Box
            sx={{
              p: 2,
              borderRadius: '14px',
              bgcolor: '#F0F9FF',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  bgcolor: '#0284C7',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PhoneInTalkRoundedIcon />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0369A1">
                  Clinical IT Helpdesk (24/7 Hotline)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Password locks, EHR sync issues, Workstation setup
                </Typography>
              </Box>
            </Stack>
            <Chip
              label="Ext: 4357 (HELP)"
              sx={{ fontWeight: 700, bgcolor: '#0284C7', color: '#fff' }}
            />
          </Box>

          <Divider />

          {/* Quick Hospital Codes */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1.5, display: 'block' }}>
              Standard Hospital Emergency Codes:
            </Typography>
            <Stack spacing={1}>
              {EMERGENCY_CODES.map((item) => (
                <Box
                  key={item.code}
                  sx={{
                    p: 1.2,
                    borderRadius: '10px',
                    bgcolor: item.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body2" fontWeight={700} sx={{ color: item.color }}>
                    {item.code}
                  </Typography>
                  <Typography variant="caption" fontWeight={500} color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" color="text.secondary">
              🔒 <b>Security Reminder:</b> Never share your Progress Notes authentication PIN or biometrics with anyone. All terminal interactions are logged under HIPAA audit § 164.312(b).
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
