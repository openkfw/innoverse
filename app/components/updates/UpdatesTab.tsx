import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ProjectUpdate } from '@/common/types';
import theme from '@/styles/theme';

import { errorMessage } from '../common/CustomToast';

import { getProjectUpdates } from './actions';
import { AddUpdateCard } from './AddUpdateCard';
import { ProjectTimeLine } from './ProjectTimeLine';

interface UpdatesTabProps {
  projectId: string;
}

export const UpdatesTab = (props: UpdatesTabProps) => {
  const { projectId } = props;
  const [updateAdded, setUpdateAdded] = useState<boolean>(false);
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([]);

  const isVeryLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const { data } = await getProjectUpdates({ projectId });
        if (data) {
          setProjectUpdates([...data]);
        }
      } catch (error) {
        console.error('Error fetching project updates:', error);
        errorMessage({ message: 'Failed to fetch project updates. Please try again later.' });
      }
    };

    fetchUpdates();
  }, [projectId]);

  useEffect(() => {
    const refetchUpdates = async () => {
      try {
        const { data } = await getProjectUpdates({ projectId });
        if (data) {
          setProjectUpdates([...data]);
        }
      } catch (error) {
        console.error('Error refetching project updates:', error);
        errorMessage({ message: 'Failed to refetch project updates. Please try again later.' });
      }
    };

    if (updateAdded) {
      refetchUpdates();
    }
  }, [projectId, updateAdded]);

  return (
    <Card sx={cardStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        <Stack direction={isVeryLargeScreen ? 'row-reverse' : 'column'}>
          <AddUpdateCard sx={updateCardStyles} projectId={projectId} setUpdateAdded={setUpdateAdded} />
          <Box flexGrow={'1'}>
            <ProjectTimeLine widthOfDateColumn={isSmallScreen ? '83px' : '273px'} projectUpdates={projectUpdates} />
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
