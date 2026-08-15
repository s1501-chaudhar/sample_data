import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button, Stack,
  IconButton, InputAdornment, Alert, CircularProgress
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { motion } from 'framer-motion';

import { useApp } from '../context/AppContext';
import ProgressNotesLogo from '../components/auth/ProgressNotesLogo';
import doctorBannerImg from '../assets/doctor_banner.jpg';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const lower = username.toLowerCase();
      const isLabUser = lower.includes('lab') || lower.includes('tech') || lower.includes('pathology');
      const isNurse = lower.includes('nurse');
      const determinedRole = isLabUser ? 'Laboratory Technician' : isNurse ? 'Nurse' : 'Doctor';
      const displayName = username.trim() || (isLabUser ? 'Lab Technician Marcus' : 'Dr. Sarah Mitchell');

      login(determinedRole, displayName);
      if (isLabUser) {
        navigate('/upload');
      } else {
        navigate('/dashboard');
      }
    }, 600);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#F4F7FB',
        backgroundImage: `
          radial-gradient(at 10% 10%, rgba(30, 94, 255, 0.06) 0px, transparent 40%),
          radial-gradient(at 90% 90%, rgba(14, 165, 233, 0.06) 0px, transparent 40%),
          linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '980px' }}
      >
        <Card
          sx={{
            width: '100%',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 50px -12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)',
            overflow: 'hidden',
            bgcolor: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.05fr' },
          }}
        >
          {/* Left Hero Side with Doctor Image and Medical Ambient */}
          <Box
            sx={{
              position: 'relative',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 4.5,
              background: 'linear-gradient(155deg, #0B2447 0%, #19376D 60%, #0F172A 100%)',
              color: '#FFFFFF',
              overflow: 'hidden',
            }}
          >
            {/* Background Image */}
            <Box
              component="img"
              src={doctorBannerImg}
              alt="Hospital Doctors"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.28,
                mixBlendMode: 'luminosity',
                zIndex: 0,
              }}
            />

            {/* Glowing Orbs */}
            <Box
              sx={{
                position: 'absolute',
                top: '-20%',
                right: '-20%',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(30, 94, 255, 0.4) 0%, transparent 70%)',
                filter: 'blur(30px)',
                zIndex: 1,
              }}
            />

            {/* Top Logo on Dark */}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <ProgressNotesLogo size="medium" light={true} />
            </Box>

            {/* Center Hero Copy */}
            <Box sx={{ position: 'relative', zIndex: 2, my: 'auto', py: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: '2rem',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  mb: 1.5,
                }}
              >
                Intelligent Patient Progress &amp; Lab Reports.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#CBD5E1',
                  lineHeight: 1.6,
                  fontSize: '0.95rem',
                }}
              >
                Access real-time patient observations, vital metrics, SOFA scores, and clinical progress summaries in one secure portal.
              </Typography>
            </Box>

            {/* Bottom Status */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                pt: 2,
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Progress Notes System
              </Typography>
              <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 600 }}>
                ● API Online
              </Typography>
            </Box>
          </Box>

          {/* Right Login Form (Only Username, Password, and Sign In) */}
          <Box
            sx={{
              p: { xs: 3.5, sm: 5, lg: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: '#FFFFFF',
            }}
          >
            {/* Logo for mobile / top */}
            <Box sx={{ mb: 3.5 }}>
              <ProgressNotesLogo size="medium" />
            </Box>

            <Box sx={{ mb: 3.5 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.4rem', sm: '1.6rem' },
                }}
              >
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Enter your username and password to access the dashboard.
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                onClose={() => setError('')}
                sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.85rem' }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                {/* Username Field */}
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#334155"
                    sx={{ mb: 0.8, display: 'block' }}
                  >
                    Username
                  </Typography>
                  <TextField
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    autoFocus
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: '12px',
                          bgcolor: '#FFFFFF',
                          '&:hover': { bgcolor: '#F8FAFC' },
                        },
                      },
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#334155"
                    sx={{ mb: 0.8, display: 'block' }}
                  >
                    Password
                  </Typography>
                  <TextField
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label="toggle password visibility"
                              sx={{ color: '#94A3B8' }}
                            >
                              {showPassword ? (
                                <VisibilityOffRoundedIcon fontSize="small" />
                              ) : (
                                <VisibilityRoundedIcon fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: '12px',
                          bgcolor: '#FFFFFF',
                          '&:hover': { bgcolor: '#F8FAFC' },
                        },
                      },
                    }}
                  />
                </Box>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={!loading && <ArrowForwardRoundedIcon />}
                  sx={{
                    mt: 1,
                    py: 1.4,
                    borderRadius: '12px',
                    bgcolor: '#1E5EFF',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 8px 20px -4px rgba(30, 94, 255, 0.4)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#184ED8',
                      boxShadow: '0 12px 24px -4px rgba(30, 94, 255, 0.5)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {loading ? (
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <CircularProgress size={18} color="inherit" />
                      <span>Signing in...</span>
                    </Stack>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Stack>
            </form>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
}
