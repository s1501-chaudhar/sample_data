import { Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Avatar } from '@mui/material';
import ImageSearchRoundedIcon from '@mui/icons-material/ImageSearchRounded';

// The sample Excel dataset only contains CBC/BMP/CMP lab rows - no radiology rows.
// This tab renders correctly for a patient that does have radiology data (structure
// matches the spec) and shows a clean empty state otherwise.
export default function RadiologyTab({ radiologyReports = [] }) {
  if (radiologyReports.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Avatar sx={{ bgcolor: '#EEF3FF', color: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
            <ImageSearchRoundedIcon />
          </Avatar>
          <Typography variant="subtitle1" fontWeight={700}>No radiology reports on file</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mx: 'auto', mt: 0.5 }}>
            This demo dataset only includes laboratory observations (CBC / BMP / CMP). Radiology
            reports uploaded via "Upload Reports" for this patient will appear here.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>Radiology Reports</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Report Date</TableCell>
              <TableCell>Modality</TableCell>
              <TableCell>Body Part</TableCell>
              <TableCell>Findings</TableCell>
              <TableCell>Impression</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {radiologyReports.map((r, i) => (
              <TableRow key={i} hover>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.modality}</TableCell>
                <TableCell>{r.bodyPart}</TableCell>
                <TableCell sx={{ maxWidth: 260 }}>{r.findings}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>{r.impression}</TableCell>
                <TableCell><Button size="small">View Report</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
