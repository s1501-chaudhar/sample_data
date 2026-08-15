import { Box, Typography, Card, CardContent, Stack, Avatar, Divider, Switch, FormControlLabel } from '@mui/material';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { userName, role } = useApp();
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>Settings</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Demo settings \u2014 nothing here is persisted between sessions.
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 52, height: 52, bgcolor: 'secondary.main' }}>{(userName || '?')[0]}</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>{userName}</Typography>
              <Typography variant="body2" color="text.secondary">{role}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Preferences</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Highlight abnormal results in tables" />
          <Divider sx={{ my: 1.5 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Show progress summary on patient overview" />
          <Divider sx={{ my: 1.5 }} />
          <FormControlLabel control={<Switch />} label="Compact table density" />
        </CardContent>
      </Card>
    </Box>
  );
}
