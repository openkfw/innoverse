'use client';

import { useState } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Project, PROJECT_PROGRESS } from '@/common/types';
import ContinueIcon from '@/components/icons/ContinueIcon';
import theme from '@/styles/theme';

import ProgressBar from '../common/ProgressBar';

interface TimingDataProps {
  project: Project;
}

const MAX_TEXT_LENGTH = 20;

const ProjectStageCard = (props: TimingDataProps) => {
  const { project } = props;
  const [isCollapsed, setIsCollapsed] = useState(project.summary.length <= MAX_TEXT_LENGTH);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Typography variant="overline" sx={titleStyles}>
        Projekt Info & Status
      </Typography>
      <Card sx={cardStyles} elevation={0}>
        <CardContent sx={cardContentStyles}>
          <ProgressBar active={PROJECT_PROGRESS.EXPLORATION} />

          <Grid sx={descriptionWrapperStyles}>
            <Typography variant="body1" color="text.primary">
              {project.title}
            </Typography>
            {!isCollapsed ? (
              <>
                <Typography sx={descriptionStyles}>{project.summary.slice(0, MAX_TEXT_LENGTH)}</Typography>
                <Button onClick={handleToggle} sx={buttonStyles} startIcon={<ContinueIcon />}>
                  <Typography sx={buttonTextStyles}>Weiter lesen</Typography>
                </Button>
              </>
            ) : (
              <Collapse in={isCollapsed}>
                <Typography sx={descriptionStyles}>{project.summary}</Typography>
              </Collapse>
            )}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default ProjectStageCard;

// Project stage card Styles
const titleStyles = {
  textAlign: 'center',
  color: 'primary.light',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
};

const cardStyles = {
  border: '1px solid rgba(0, 90, 140, 0.10)',
  background: 'rgba(240, 238, 225, 0.10)',
  borderRadius: '8px',
  width: '100%',
  height: '209px',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '411px',
  },
};

const cardContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const descriptionWrapperStyles = {
  flex: 1,
  marginTop: 2,
};

const descriptionStyles = {
  fontSize: '14px',
  color: 'text.primary',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    WebkitLineClamp: 10,
  },
};

const buttonStyles = {
  marginTop: 2,
  background: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 1,
  padding: '8px 16px',
  borderRadius: '48px',
  border: '1px solid rgba(0, 0, 0, 0.10)',
  backdropFilter: 'blur(24px)',
  maxWidth: 'fit-content',
};

const buttonTextStyles = {
  color: 'rgba(0, 0, 0, 0.56)',
};
