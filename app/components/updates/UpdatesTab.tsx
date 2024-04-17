import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ProjectData, ProjectUpdate } from '@/common/types';
import theme from '@/styles/theme';

import { errorMessage } from '../common/CustomToast';

import { getProjectUpdates } from './actions';
import { AddUpdateCard } from './AddUpdateCard';
import { ProjectTimeLine } from './ProjectTimeLine';

interface UpdatesTabProps {
  projectData: ProjectData;
  onUpdate: (updates: ProjectUpdate[]) => void;
}

export const UpdatesTab = ({ projectData, onUpdate }: UpdatesTabProps) => {
  const isVeryLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const appInsights = useAppInsightsContext();

  const refetchUpdates = async () => {
    try {
      const { data } = await getProjectUpdates({ projectId: projectData.id });
      if (data) {
        onUpdate(data);
      }
    } catch (error) {
      console.error('Error refetching project updates:', error);
      errorMessage({ message: 'Failed to refetch project updates. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to refetch project updates.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return (
    <Card sx={cardStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        <Stack direction={isVeryLargeScreen ? 'row-reverse' : 'column'}>
          <AddUpdateCard sx={updateCardStyles} projectId={projectData.id} refetchUpdates={refetchUpdates} />
          <Box flexGrow={'1'}>
            <ProjectTimeLine
              widthOfDateColumn={isSmallScreen ? '83px' : '273px'}
              projectUpdates={projectData.updates}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Updates Tab Styles
const cardStyles = {
  borderRadius: '24px',
  background: 'common.white',
  position: 'relative',
  zIndex: 0,
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
};

const colorOverlayStyles = {
  width: '354px',
  height: '100%',
  borderRadius: 'var(--2, 16px) 0px 0px var(--2, 16px)',
  opacity: 0.6,
  background: 'linear-gradient(90deg, rgba(240, 238, 225, 0.00) 10.42%, #F0EEE1 100%)',
  position: 'absolute',
  zIndex: -1,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
};

const cardContentStyles = {
  my: '88px',
  mx: '64px',
  [theme.breakpoints.down('md')]: {
    mx: '24px',
    my: '48px',
  },
  '&.MuiCardContent-root': {
    padding: 0,
  },
};

const updateCardStyles: SxProps = {
  width: '270px',
  maxWidth: '100%',
  marginLeft: '1.5em',
  [theme.breakpoints.down('lg')]: {
    marginLeft: '305px',
    width: '385px',
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    marginBottom: 2,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
};
