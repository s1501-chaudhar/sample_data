import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Typography, Box, Stack, Button,
  IconButton, CircularProgress, Alert
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';

const SSO_PROVIDERS = [
  {
    id: 'epic',
    name: 'Epic Hyperspace EHR',
    subtitle: 'OAuth 2.0 / SMART on FHIR',
    color: '#D13438',
    icon: '🏥',
    defaultUser: { name: 'Dr. Priya Raghavan', role: 'Doctor' },
  },
  {
    id: 'cerner',
    name: 'Oracle Cerner Millennium',
    subtitle: 'Enterprise Health Pass',
    color: '#F48024',
    icon: '⚕️',
    defaultUser: { name: 'Dr. Sarah Chen', role: 'Doctor' },
  },
  {
    id: 'azure',
    name: 'Hospital Microsoft Entra (Azure AD)',
    subtitle: 'Federated SAML 2.0 Identity',
    color: '#0078D4',
    icon: '🔷',
    defaultUser: { name: 'Marcus Wright', role: 'Laboratory Technician' },
  },
  {
    id: 'okta',
    name: 'Okta Health ID',
    subtitle: 'Multi-Factor Authenticated Portal',
    color: '#00297A',
    icon: '🔐',
    defaultUser: { name: 'Elena Rostova', role: 'Nurse' },
  },
];

export default function SsoModal({ open, onClose, onSsoLogin }) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [authenticating, setAuthenticating] = useState(false);

  const handleSelect = (provider) => {
    setSelectedProvider(provider);
    setAuthenticating(true);

    setTimeout(() => {
      setAuthenticating(false);
      if (onSsoLogin) {
        onSsoLogin(provider.defaultUser.role, provider.defaultUser.name);
      }
    }, 1200);
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
              bgcolor: 'rgba(30, 94, 255, 0.1)',
              color: '#1E5EFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SecurityRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              Enterprise Hospital SSO
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Federated EHR & Directory Sign-In
            </Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Authenticate using your affiliated medical center identity provider or clinical portal:
        </Typography>

        {authenticating ? (
          <Stack spacing={2} alignItems="center" sx={{ py: 4, textAlign: 'center' }}>
            <CircularProgress size={36} sx={{ color: selectedProvider?.color || '#1E5EFF' }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Connecting to {selectedProvider?.name}...
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Verifying PKI certificates and clinical directory rights
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {SSO_PROVIDERS.map((prov) => (
              <Button
                key={prov.id}
                variant="outlined"
                onClick={() => handleSelect(prov)}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  p: 1.5,
                  borderRadius: '12px',
                  borderColor: '#E2E8F0',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#1E5EFF',
                    bgcolor: '#F8FAFC',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(30, 94, 255, 0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    bgcolor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    mr: 1.5,
                    flexShrink: 0,
                  }}
                >
                  {prov.icon}
                </Box>
                <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {prov.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {prov.subtitle}
                  </Typography>
                </Box>
              </Button>
            ))}

            <Box sx={{ pt: 1 }}>
              <Alert severity="info" sx={{ borderRadius: '10px', fontSize: '0.78rem' }}>
                Single Sign-On is encrypted via TLS 1.3 with automated HIPAA session auditing.
              </Alert>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
