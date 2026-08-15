import { Chip } from '@mui/material';
import { flagStyle } from '../../utils/labUtils';

export default function FlagChip({ flag, size = 'small' }) {
  const s = flagStyle(flag);
  return (
    <Chip
      label={s.label}
      size={size}
      sx={{
        color: s.color,
        backgroundColor: s.bg,
        fontWeight: 700,
        fontSize: '0.72rem',
        height: 22,
      }}
    />
  );
}
