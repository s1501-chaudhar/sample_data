import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1E5EFF', light: '#5B85FF', dark: '#123BB0', contrastText: '#fff' },
    secondary: { main: '#0EA5A5' },
    background: { default: '#F5F7FB', paper: '#FFFFFF' },
    success: { main: '#1DA35C' },
    warning: { main: '#E8A317' },
    error: { main: '#D8434A' },
    text: { primary: '#1A2138', secondary: '#6B7488' },
    divider: '#E7EBF3',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 800 }, h2: { fontWeight: 800 }, h3: { fontWeight: 700 },
    h4: { fontWeight: 700 }, h5: { fontWeight: 700 }, h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 18 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: '1px solid #E7EBF3',
          boxShadow: '0 2px 10px rgba(20, 40, 90, 0.04)',
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 12, boxShadow: 'none' } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderBottom: '1px solid #EEF1F7' } },
    },
  },
});

export default theme;
