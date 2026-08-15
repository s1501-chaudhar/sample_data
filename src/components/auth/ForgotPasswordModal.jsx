import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Typography, Box, Stack, Alert, IconButton, CircularProgress
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

export default function ForgotPasswordModal({ open, onClose, defaultIdentifier = '' }) {
  const [step, setStep] = useState(1); // 1: input identifier, 2: verify OTP, 3: set new password, 4: success
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = () => {
    setStep(1);
    setIdentifier('');
    setOtp(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your Staff ID or registered hospital email.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 900);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setError('Please enter the full 6-digit security code.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 800);
  };

  const handleSetNewPassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 900);
  };

  return (
    <Dialog
      open={open}
      onClose={handleReset}
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
              bgcolor: 'rgba(30, 94, 255, 0.1)',
              color: '#1E5EFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockResetRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              Reset Credentials
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hospital Identity & Access Management
            </Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={handleReset} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.85rem' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <Stack spacing={2.5}>
              <Typography variant="body2" color="text.secondary">
                Enter your Hospital Staff ID, Badge Number, or registered Clinical Email to receive a one-time verification token.
              </Typography>
              <TextField
                autoFocus
                label="Staff ID / Work Email"
                placeholder="e.g. DOC-9482 or dr.raghavan@memorial.org"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                fullWidth
                size="small"
                required
                InputProps={{
                  sx: { borderRadius: '12px' },
                }}
              />
              <Box sx={{ p: 1.5, bgcolor: '#F1F5F9', borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  💡 <b>Quick demo:</b> Enter any email (e.g. <code>demo@hospital.org</code>) to simulate password recovery.
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1E5EFF 0%, #0EA5E9 100%)',
                  fontWeight: 600,
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Send Verification Code'}
              </Button>
            </Stack>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <Stack spacing={2.5} alignItems="center">
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MarkEmailReadRoundedIcon />
              </Box>
              <Box textAlign="center">
                <Typography variant="subtitle2" fontWeight={700}>
                  Security Token Sent
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  We sent a 6-digit code to the mobile/pager linked with <b>{identifier}</b>.
                </Typography>
              </Box>

              {/* 6 Digit Inputs */}
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ my: 1 }}>
                {otp.map((digit, idx) => (
                  <TextField
                    key={idx}
                    id={`otp-input-${idx}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        width: '32px',
                        padding: '10px 0',
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                ))}
              </Stack>

              <Button
                size="small"
                onClick={() => setOtp(['7', '4', '2', '9', '1', '5'])}
                sx={{ fontSize: '0.75rem', textDecoration: 'underline' }}
              >
                Auto-fill demo OTP (742915)
              </Button>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1E5EFF 0%, #0EA5E9 100%)',
                  fontWeight: 600,
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Verify Code'}
              </Button>
            </Stack>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSetNewPassword}>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Choose a strong new password meeting hospital cybersecurity compliance standards.
              </Typography>
              <TextField
                type="password"
                label="New Password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                size="small"
                required
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
              <TextField
                type="password"
                label="Confirm New Password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                size="small"
                required
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1E5EFF 0%, #0EA5E9 100%)',
                  fontWeight: 600,
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Update Password & Return'}
              </Button>
            </Stack>
          </form>
        )}

        {step === 4 && (
          <Stack spacing={2.5} alignItems="center" sx={{ py: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 36 }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight={700}>
                Password Reset Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Your clinical credentials have been securely updated. You can now log into Progress Notes.
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleReset}
              sx={{
                py: 1.2,
                borderRadius: '12px',
                background: '#1E5EFF',
                fontWeight: 600,
              }}
            >
              Back to Login
            </Button>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
