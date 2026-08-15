import { Box, Typography, Stack } from '@mui/material';

export default function ProgressNotesLogo({ size = 'medium', light = false }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconBoxSize = isLarge ? 48 : isSmall ? 32 : 40;
  const plusSize = isLarge ? 26 : isSmall ? 18 : 22;
  const titleSize = isLarge ? '1.45rem' : isSmall ? '1.05rem' : '1.25rem';
  const subtitleSize = isLarge ? '0.72rem' : isSmall ? '0.58rem' : '0.65rem';

  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ userSelect: 'none' }}>
      {/* Blue Square with White Plus Icon */}
      <Box
        sx={{
          width: iconBoxSize,
          height: iconBoxSize,
          borderRadius: isLarge ? '12px' : '9px',
          bgcolor: '#1E5EFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(30, 94, 255, 0.35)',
          flexShrink: 0,
        }}
      >
        <svg
          width={plusSize}
          height={plusSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4V20M4 12H20"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Box>

      {/* Brand Text */}
      <Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: titleSize,
            letterSpacing: '-0.02em',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            color: light ? '#FFFFFF' : '#0F172A',
            lineHeight: 1.1,
          }}
        >
          Progress Notes
        </Typography>
        <Typography
          sx={{
            fontSize: subtitleSize,
            fontWeight: 700,
            color: light ? 'rgba(255, 255, 255, 0.7)' : '#64748B',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            mt: 0.3,
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
          }}
        >
          LAB REPORT INTELLIGENCE
        </Typography>
      </Box>
    </Stack>
  );
}
