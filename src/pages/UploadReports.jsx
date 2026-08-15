import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box, Card, CardContent, Typography, TextField, Grid, Button, Stack,
  Alert, Chip, FormControlLabel, Checkbox, Divider, Paper
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useApp } from '../context/AppContext';

export default function UploadReports() {
  const { addUpload } = useApp();
  const [patientId, setPatientId] = useState('');
  const [admissionId, setAdmissionId] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((accepted) => {
    setFiles((prev) => [...prev, ...accepted]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setTimeout(() => {
      const newEntries = files.map((f) => ({
        fileName: f.name,
        patientId: patientId || '000914327',
        admissionId: admissionId || 'V2026-7624039',
        size: `${(f.size / 1024).toFixed(1)} KB`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'Processed & Ingested',
        reportType: f.name.toLowerCase().includes('vitals') ? 'Vitals Data' : 'Clinical Lab Report',
      }));

      newEntries.forEach((entry) => addUpload(entry));
      setResults((prev) => [...newEntries, ...prev]);
      setFiles([]);
      setUploading(false);
    }, 800);
  };

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 120px)' }}>
      <Grid container spacing={3}>
        {/* ================= LEFT COLUMN: INPUT & UPLOAD SECTION ================= */}
        <Grid item xs={12} md={5.5}>
          <Stack spacing={2.5}>
            {/* 1. Verify Patient & Admission Card */}
            <Card sx={{ borderRadius: '18px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', p: 0.5 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: '#F1F5F9',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PersonOutlineRoundedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0F172A" lineHeight={1.2}>
                      Verify Patient &amp; Admission
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                      Optional — if entered, values are cross-checked against the report content
                    </Typography>
                  </Box>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="#64748B" sx={{ textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.6, display: 'block' }}>
                      PATIENT ID (MRN)
                    </Typography>
                    <TextField
                      placeholder="e.g. 000914327"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      fullWidth
                      size="small"
                      InputProps={{ sx: { borderRadius: '10px', bgcolor: '#F8FAFC' } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="#64748B" sx={{ textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.6, display: 'block' }}>
                      ADMISSION ID (VISIT #)
                    </Typography>
                    <TextField
                      placeholder="e.g. V2026-7624039"
                      value={admissionId}
                      onChange={(e) => setAdmissionId(e.target.value)}
                      fullWidth
                      size="small"
                      InputProps={{ sx: { borderRadius: '10px', bgcolor: '#F8FAFC' } }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 2. Upload Reports And Vitals Card */}
            <Card sx={{ borderRadius: '18px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', p: 0.5 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: '#F1F5F9',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileUploadOutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0F172A" lineHeight={1.2}>
                      Upload Reports And Vitals
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                      Reports go to patient-reports. CSV or Excel vitals go to vitals-reports.
                    </Typography>
                  </Box>
                </Stack>

                {/* Dropzone Box */}
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? '#1E5EFF' : '#CBD5E1',
                    borderRadius: '16px',
                    p: 4,
                    textAlign: 'center',
                    bgcolor: isDragActive ? '#EFF6FF' : '#FAFBFD',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    mb: 2,
                    '&:hover': {
                      borderColor: '#1E5EFF',
                      bgcolor: '#F8FAFC',
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '10px',
                      bgcolor: '#EFF6FF',
                      border: '1px dashed #93C5FD',
                      color: '#1E5EFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 1.5,
                    }}
                  >
                    <FileUploadOutlinedIcon />
                  </Box>

                  <Typography variant="body2" fontWeight={700} color="#0F172A">
                    Drop files here or <span style={{ color: '#1E5EFF', textDecoration: 'underline' }}>browse</span>
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.6 }}>
                    Supports PDF · PNG · JPG · JPEG · CSV · XLS · XLSX · Max 20 MB
                  </Typography>
                </Box>

                {/* Selected File Badges */}
                {files.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 0.8 }}>
                    {files.map((f, i) => (
                      <Chip
                        key={i}
                        icon={<InsertDriveFileOutlinedIcon fontSize="small" />}
                        label={`${f.name} (${(f.size / 1024).toFixed(0)} KB)`}
                        onDelete={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        sx={{ bgcolor: '#EFF6FF', color: '#1E5EFF', fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    ))}
                  </Stack>
                )}

                {/* Replace checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={replaceExisting}
                      onChange={(e) => setReplaceExisting(e.target.checked)}
                      size="small"
                      sx={{ color: '#94A3B8', '&.Mui-checked': { color: '#1E5EFF' } }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      Replace existing files if already present
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />

                {/* Upload Button */}
                <Button
                  variant="contained"
                  fullWidth
                  disabled={files.length === 0 || uploading}
                  onClick={handleUpload}
                  startIcon={<FileUploadOutlinedIcon />}
                  sx={{
                    py: 1.3,
                    borderRadius: '12px',
                    bgcolor: '#64748B',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.92rem',
                    '&:hover': { bgcolor: '#475569' },
                    '&.Mui-disabled': { bgcolor: '#E2E8F0', color: '#94A3B8' },
                  }}
                >
                  {uploading ? 'Processing & Ingesting Data...' : 'Upload Files'}
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* ================= RIGHT COLUMN: RESULTS & OUTPUT SECTION ================= */}
        <Grid item xs={12} md={6.5}>
          <Card
            sx={{
              minHeight: 480,
              height: '100%',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              p: 0.5,
            }}
          >
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    bgcolor: '#F1F5F9',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircleRoundedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#0F172A" lineHeight={1.2}>
                    Results &amp; Output
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                    Upload responses and processed lab data appear here
                  </Typography>
                </Box>
              </Stack>

              {results.length === 0 ? (
                /* Empty state matching Screenshot #1 */
                <Box
                  sx={{
                    my: 'auto',
                    textAlign: 'center',
                    py: 6,
                  }}
                >
                  <Box
                    sx={{
                      width: 76,
                      height: 76,
                      borderRadius: '50%',
                      border: '2px dashed #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: '#94A3B8',
                    }}
                  >
                    <DescriptionOutlinedIcon sx={{ fontSize: 36 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#0F172A">
                    No activity yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 320, mx: 'auto' }}>
                    Select report or vitals files, then click <b>Upload Files</b> to begin.
                  </Typography>
                </Box>
              ) : (
                /* Processed results log */
                <Stack spacing={1.5}>
                  {results.map((res, i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 2,
                        borderRadius: '14px',
                        bgcolor: '#FAFBFD',
                        border: '1px solid #EEF2F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ color: '#10B981', display: 'flex' }}>
                          <CheckCircleRoundedIcon />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={700} color="#0F172A">
                            {res.fileName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Patient: {res.patientId} • Visit: {res.admissionId} • {res.size} • {res.timestamp}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        label={res.status}
                        size="small"
                        sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
