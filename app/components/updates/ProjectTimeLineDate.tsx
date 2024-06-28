import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { ProjectUpdateWithAdditionalData } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';

import { DateField } from './DateField';

function getDay(date: Date) {
  return date.getDate().toString();
}

function getMonth(date: Date) {
  return date.toLocaleString('de-DE', { month: 'short' });
}

interface ProjectTimeLineDateProps {
  update: ProjectUpdateWithAdditionalData;
  showDivider: boolean;
  sx?: SxProps;
}

export const ProjectTimeLineDate = ({ update, showDivider, sx }: ProjectTimeLineDateProps) => {
  const dayMonth = `${getDay(update.updatedAt)} ${getMonth(update.updatedAt)}`;

  return (
    <Box sx={sx}>
      <DateField date={dayMonth} divider={showDivider} sx={{ fontSize: { xs: '16px', md: '24px' } }}>
        {update.projectStart && (
          <Box sx={projectStartStyles}>
            <Typography variant="subtitle2" color="primary.main">
              {m.components_updates_projectTimeLineDate_kickoff()}
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
