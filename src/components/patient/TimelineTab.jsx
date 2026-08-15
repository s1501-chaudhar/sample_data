import { useMemo, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Stack, Collapse, IconButton, Table, TableBody,
  TableCell, TableHead, TableRow,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import { groupIntoReports, fmtDateTime } from '../../utils/labUtils';
import FlagChip from '../common/FlagChip';

export default function TimelineTab({ observations }) {
  const reports = useMemo(() => groupIntoReports(observations), [observations]);
  const [openId, setOpenId] = useState(reports[reports.length - 1]?.reportId || null);

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Patient Timeline</Typography>
        <Box sx={{ position: 'relative', pl: 3 }}>
          <Box sx={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 2, bgcolor: '#E7EBF3' }} />
          <Stack spacing={2.5}>
            {reports.map((r) => {
              const open = openId === r.reportId;
              const anyAbnormal = r.rows.some((row) => row.flag === 'High' || row.flag === 'Critical');
              return (
                <Box key={r.reportId} sx={{ position: 'relative' }}>
                  <Box sx={{
                    position: 'absolute', left: -21, top: 4, width: 14, height: 14, borderRadius: '50%',
                    bgcolor: anyAbnormal ? '#D8434A' : '#1DA35C', border: '3px solid #fff', boxShadow: '0 0 0 2px #E7EBF3',
                  }} />
                  <Stack
                    direction="row" alignItems="center" spacing={1.5}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setOpenId(open ? null : r.reportId)}
                  >
                    <ScienceRoundedIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight={700}>{fmtDateTime(r.collectedAt)}</Typography>
                    <Typography variant="body2" color="text.secondary">{r.reportType}</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton size="small" sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: '.2s' }}>
                      <ExpandMoreRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Collapse in={open}>
                    <Table size="small" sx={{ mt: 1, ml: 4 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Test</TableCell>
                          <TableCell>Result</TableCell>
                          <TableCell>Flag</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {r.rows.map((row) => (
                          <TableRow key={row.rowId}>
                            <TableCell>{row.testName}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{row.valueNumeric ?? row.valueText} {row.unit || ''}</TableCell>
                            <TableCell><FlagChip flag={row.flag} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Collapse>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
