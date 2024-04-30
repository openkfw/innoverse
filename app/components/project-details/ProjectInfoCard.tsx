'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Project } from '@/common/types';
import theme from '@/styles/theme';

import InteractionButton, { interactionButtonStyles, InteractionType } from '../common/InteractionButton';

import { handleFollow, handleLike, handleRemoveFollower, handleRemoveLike } from './likes-follows/actions';
import CollaborationColumn from './CollaborationColumn';
import { ProjectInfoCardSmall } from './ProjectInfoCardSmall';
import ProjectStageCard from './ProjectStageCard';
import TeamMembersColumn from './TeamMembersColumn';
import UpdateCard from './UpdateCard';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ProjectInfoProps {
  project: Project;
  isLiked: boolean;
  isFollowed: boolean;
  setLiked: (i: boolean) => void;
  setFollowed: (i: boolean) => void;
  likesAmount: number;
  followersAmount: number;
  setLikesAmount: (i: number) => void;
  setFollowersAmount: (i: number) => void;
}

export const ProjectInfoCard = (props: ProjectInfoProps) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const {
    project,
    isLiked,
    isFollowed,
    setLiked,
    setFollowed,
    likesAmount,
    followersAmount,
    setLikesAmount,
    setFollowersAmount,
  } = props;

  // Interaction buttons
  const interactionButtons = () => {
    function toggleLike() {
      if (isLiked) {
        setLiked(false);
        handleRemoveLike({ projectId: project.id });
        setLikesAmount(likesAmount - 1);
      } else {
        setLiked(true);
        handleLike({ projectId: project.id });
        setLikesAmount(likesAmount + 1);
      }
    }

    function toggleFollow() {
      if (isFollowed) {
        setFollowed(false);
        handleRemoveFollower({ projectId: project.id });
        setFollowersAmount(followersAmount - 1);
      } else {
        setFollowed(true);
        handleFollow({ projectId: project.id });
        setFollowersAmount(followersAmount + 1);
      }
    }

    return (
      <Stack direction="row" spacing={1} sx={interactionStyles}>
        <InteractionButton
          isSelected={isLiked}
          projectName={project.title}
          interactionType={InteractionType.LIKE}
          onClick={toggleLike}
          label={likesAmount.toString()}
          sx={interactionButtonStyles}
        />
        <InteractionButton
          isSelected={isFollowed}
          projectName={project.title}
          interactionType={InteractionType.PROJECT_FOLLOW}
          onClick={toggleFollow}
          sx={interactionButtonStyles}
        />
      </Stack>
    );
  };

  return (
    <Box sx={wrapperStyles}>
      {interactionButtons()}

      <Card sx={cardStyles}>
        <CardContent sx={cardContentStyles}>
          {isSmallScreen ? (
            <ProjectInfoCardSmall project={project} />
          ) : (
            <Grid container sx={containerStyles}>
              <Grid item sx={firstRowStyles}>
                <Grid sx={projectStageCardStyles}>
                  <ProjectStageCard project={project} />
                </Grid>
                {project.team.length ? (
                  <Grid sx={teamMembersColumnStyles}>
                    <TeamMembersColumn team={project.team} projectName={project.title} />
                  </Grid>
                ) : null}
              </Grid>

              <Grid item sx={secondRowStyles}>
                <Grid sx={collaborationColumnStyles}>
                  <CollaborationColumn project={project} />
                </Grid>
                <Grid item sx={updateCardStyles}>
                  <UpdateCard updates={project?.updates} />
                </Grid>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// Project Info Card Styles
const wrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '85%',
  maxWidth: '1600px',
  [theme.breakpoints.down('md')]: {
    width: '90%',
  },
};

const cardStyles = {
  borderRadius: '24px',
  width: '100%',
  margin: '0 8px',
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
};

const cardContentStyles = {
  margin: '56px 64px 48px 64px',
  [theme.breakpoints.down('md')]: {
    margin: '24px',
  },
  [theme.breakpoints.down('sm')]: {
    margin: '8px',
  },
};

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
};

const firstRowStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 3,
};

const projectStageCardStyles = {
  width: '100%',
  alignSelf: 'flex-start',
};

const teamMembersColumnStyles = {
  alignSelf: 'flex-start',
};

const secondRowStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 3,
};

const collaborationColumnStyles = {
  width: '100%',
};

const updateCardStyles = {
  alignSelf: 'flex-start',
};

const interactionStyles = {
  alignSelf: 'flex-end',
  marginBottom: '40px',
  marginRight: '64px',
  [theme.breakpoints.down('sm')]: {
    marginRight: 0,
  },
};
