import { useEffect, useState } from 'react';

import { Stack, SxProps, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { ProjectUpdate } from '@/common/types';
import theme from '@/styles/theme';

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
    const refetchUpdates = async () => {
      const { data } = await getProjectUpdates({ projectId });
      if (data) {
        setProjectUpdates([...data]);
      }
    };
    if (updateAdded) {
      refetchUpdates();
    }
  }, [projectId, updateAdded]);

  useEffect(() => {
    const fetchUpdates = async () => {
      const { data } = await getProjectUpdates({ projectId });
      if (data) {
        setProjectUpdates([...data]);
      }
    };

    fetchUpdates();
  }, [projectId]);

  return (
    <Card sx={cardStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        <Stack direction={isVeryLargeScreen ? 'row' : 'column'}>
          <ProjectTimeLine widthOfDateColumn={isSmallScreen ? '83px' : '275px'} projectUpdates={projectUpdates} />
          <AddUpdateCard sx={updateCardStyles} projectId={projectId} setUpdateAdded={setUpdateAdded} />
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
  marginLeft: '1.5em',
  width: '270px',
  [theme.breakpoints.down('lg')]: {
    marginLeft: '315px',
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    marginTop: 5,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
};
