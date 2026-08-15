import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, accent = '#1E5EFF', sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ height: '100%' }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
          <Avatar sx={{ bgcolor: `${accent}18`, color: accent, width: 48, height: 48, borderRadius: '14px' }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {label}
            </Typography>
            <Typography variant="h5" fontWeight={800} lineHeight={1.2}>
              {value}
            </Typography>
            {sub && (
              <Typography variant="caption" color="text.secondary">
                {sub}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
