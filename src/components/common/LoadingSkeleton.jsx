import { Box, Skeleton, Stack } from '@mui/material';

export function CardSkeletons({ count = 4 }) {
  return (
    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rounded" width={260} height={90} sx={{ borderRadius: '18px', flex: '1 1 240px' }} />
      ))}
    </Stack>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <Box>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={40} sx={{ mb: 1, borderRadius: '10px' }} />
      ))}
    </Box>
  );
}
