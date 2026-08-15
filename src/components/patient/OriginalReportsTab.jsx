import { useMemo } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Stack, Chip } from '@mui/material';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { groupIntoReports, fmtDateTime } from '../../utils/labUtils';

export default function OriginalReportsTab({ observations }) {
  const reports = useMemo(() => groupIntoReports(observations), [observations]);

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>Original Reports</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Source PDFs referenced by each report's <code>blob_path</code>. A few sample PDFs are wired
          up for this demo; the rest show as unavailable, exactly as they would before a real
          blob-storage backend is connected.
        </Typography>
        <List disablePadding>
          {reports.map((r) => (
            <ListItem
              key={r.reportId}
              divider
              secondaryAction={
                r.hasLocalFile ? (
                  <Button
                    size="small" variant="outlined" endIcon={<OpenInNewRoundedIcon fontSize="small" />}
                    href={r.blobPath} target="_blank" rel="noreferrer"
                  >
                    View
                  </Button>
                ) : (
                  <Chip size="small" label="Not available in demo" sx={{ bgcolor: '#EEF1F7', color: '#6B7488', fontWeight: 600 }} />
                )
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: r.hasLocalFile ? '#EEF3FF' : '#F5F7FB', color: r.hasLocalFile ? 'primary.main' : '#B7BECC' }}>
                  <PictureAsPdfRoundedIcon fontSize="small" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${r.reportType} \u2014 ${r.reportId}`}
                secondary={`${fmtDateTime(r.collectedAt)} \u00b7 Accession ${r.accessionNumber} \u00b7 ${r.hospitalName}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
