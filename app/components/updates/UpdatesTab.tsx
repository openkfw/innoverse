import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Project, ProjectUpdateWithAdditionalData } from '@/common/types';
import theme from '@/styles/theme';
import { getUpdatesByProjectId } from '@/utils/requests/updates/requests';

import { errorMessage } from '../common/CustomToast';

import { AddUpdateCard } from './AddUpdateCard';
import { ProjectTimeLine } from './ProjectTimeLine';

interface UpdatesTabProps {
  project: Project;
  onUpdate: (updates: ProjectUpdateWithAdditionalData[]) => void;
  isFollowed: boolean;
  setFollowed: (i: boolean) => void;
  followersAmount: number;
  setFollowersAmount: (i: number) => void;
}

export const UpdatesTab = ({ project, onUpdate }: UpdatesTabProps) => {
  const isVeryLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const appInsights = useAppInsightsContext();

  const refetchUpdates = async () => {
    try {
      const updates = await getUpdatesByProjectId(project.id);
      if (updates) {
        onUpdate(updates);
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

  if (project?.updates?.length === 0) {
    return (
      <Card sx={cardStyles}>
        <AddUpdateCard
          wrapSx={noUpdatesCardWrapperStyles}
          cardSx={{ background: 'transparent', boxShadow: 'none' }}
          project={project}
          refetchUpdates={refetchUpdates}
          text={'Es gibt noch keine Neuigkeiten zu diesem Projekt. Klick hier um eine hinzuzufügen.'}
        />
      </Card>
    );
  }

  return (
    <Card sx={cardStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        <Stack direction={isVeryLargeScreen ? 'row-reverse' : 'column'}>
          <AddUpdateCard
            wrapSx={updateCardWrapperStyles}
            project={project}
            refetchUpdates={refetchUpdates}
            text={'Halten Dein Publikum auf dem Laufenden! Klick hier, um eine Neuigkeit hinzuzufügen.'}
          />
          <Box flexGrow="1">
            <ProjectTimeLine widthOfDateColumn={isSmallScreen ? '83px' : '273px'} projectUpdates={project.updates} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Updates Tab Styles
const cardStyles = {
  borderRadius: '24px',
  backgroundColor: 'common.white',
  zIndex: 0,
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
};

const colorOverlayStyles = {
  width: '354px',
  position: 'absolute',
  height: 'fit-content',
  borderRadius: 'var(--2, 16px) 0px 0px var(--2, 16px)',
  opacity: 0.6,
  background: 'linear-gradient(90deg, rgba(240, 238, 225, 0.00) 10.42%, #F0EEE1 100%)',
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

const updateCardWrapperStyles: SxProps = {
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

const noUpdatesCardWrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  padding: '32px 24px',
  background: 'linear-gradient(0deg, rgba(240, 238, 225, 0.30) 0%, rgba(240, 238, 225, 0.30) 100%), #FFF',
  margin: '88px 64px',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    margin: '48px 24px',
  },
};
