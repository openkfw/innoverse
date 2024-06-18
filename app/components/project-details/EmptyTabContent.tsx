import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ObjectType, Project } from '@/common/types';
import theme from '@/styles/theme';

import InteractionButton, { InteractionType } from '../common/InteractionButton';
import ReminderIcon from '../icons/ReminderIcon';

import { handleFollow, handleRemoveFollower } from './likes-follows/actions';

interface EmptyTabContentProps {
  isFollowed: boolean;
  setFollowed: (followed: boolean) => void;
  followersAmount: number;
  setFollowersAmount: (amount: number) => void;
  project: Project;
  message: string;
}

function EmptyTabContent({
  isFollowed,
  setFollowed,
  followersAmount,
  setFollowersAmount,
  project,
  message,
}: EmptyTabContentProps) {
  function toggleFollow() {
    if (isFollowed) {
      setFollowed(false);
      handleRemoveFollower({ objectType: ObjectType.PROJECT, objectId: project.id });
      setFollowersAmount(followersAmount - 1);
    } else {
      setFollowed(true);
      handleFollow({ objectType: ObjectType.PROJECT, objectId: project.id });
      setFollowersAmount(followersAmount + 1);
    }
  }

  return (
    <Box sx={wrapperStyles}>
      <Grid container spacing={2}>
        <Grid item>
          <ReminderIcon />
        </Grid>
        <Grid item xs>
          <Typography variant="body1" sx={textStyles}>
            {message}
          </Typography>
        </Grid>
      </Grid>

      <InteractionButton
        isSelected={isFollowed}
        interactionType={InteractionType.PROJECT_FOLLOW}
        onClick={toggleFollow}
        sx={followButtonStyles}
      />
    </Box>
  );
}

export default EmptyTabContent;

// Empty Tab Content styles
const wrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '32px 24px',
  gap: '16px',
  maxWidth: '761px',
  borderRadius: '8px',
  background: 'linear-gradient(0deg, rgba(240, 238, 225, 0.30) 0%, rgba(240, 238, 225, 0.30) 100%), #FFF',
  margin: '88px 64px',

  [theme.breakpoints.down('md')]: {
    margin: '48px 24px',
  },
};

const textStyles = {
  color: 'text.primary',
  fontFamily: '***FONT_REMOVED***',
};

const followButtonStyles = {
  marginTop: 0,
  padding: '8px 24px',
  borderRadius: '48px',
  backdropFilter: 'blur(24px)',
  background: '#B7F9AA',

  [theme.breakpoints.down('md')]: {
    alignSelf: 'center',
  },
};
