import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';

import { DateField } from './DateField';

function getDay(date: string) {
  return new Date(date).getDate().toString();
}

function getMonth(date: string) {
  return new Date(date).toLocaleString('de-DE', { month: 'short' });
}

interface ProjectTimeLineDateProps {
  update: ProjectUpdate;
  showDivider: boolean;
  sx?: SxProps;
}

export const ProjectTimeLineDate = ({ update, showDivider, sx }: ProjectTimeLineDateProps) => {
  const dayMonth = `${getDay(update.date)} ${getMonth(update.date)}`;

  return (
    <Box sx={sx}>
      <DateField date={dayMonth} divider={showDivider} sx={{ fontSize: { xs: '16px', md: '24px' } }}>
        {update.projectStart && (
          <Box sx={projectStartStyles}>
            <Typography variant="subtitle2" color="primary.main">
              Project Kickoff
            </Typography>
          </Box>
        )}
      </DateField>
    </Box>
  );
};

const projectStartStyles = {
  my: 1,
  p: 1,
  background: 'rgba(0, 90, 140, 0.10)',
  borderRadius: '8px',
  textAlign: 'center',
};
