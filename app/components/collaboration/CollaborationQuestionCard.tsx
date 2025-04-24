'use client';

import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { CollaborationQuestion } from '@/common/types';
import { UserAvatar } from '@/components/common/UserAvatar';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { parseStringForLinks } from '../common/LinkString';

import CollaborationCommentsSection from './comments/CollaborationCommentsSection';

interface CollaborationQuestionCardProps {
  item: CollaborationQuestion;
  projectId: string;
  questionId: string;
  projectName?: string;
}

export const CollaborationQuestionCard = ({ item }: CollaborationQuestionCardProps) => {
  const { title, description, authors } = item;

  const avatarGroupStyle = {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    color: 'rgba(0, 0, 0, 0.10)',
    '& .MuiAvatar-colorDefault': {
      border: '2px solid white',
      background: 'linear-gradient(84deg, #85898b 0%, #ffffff 100%)',
      color: 'rgba(0, 0, 0, 0.56)',
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: '40px',
    },
  };

  const commentWrapperStyle = {
    marginLeft: '-16px',
    width: 'calc(100% + 16px)',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  };

  return (
    <Grid container>
      <Grid container item xs={12} md={6} direction="column" spacing={2} sx={leftGridStyle}>
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" color="secondary.contrastText">
            {parseStringForLinks(description)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="overline" color="primary.main">
            {m.components_collaboration_collaborationQuestionCard_question()}
          </Typography>
          <AvatarGroup sx={avatarGroupStyle}>
            {authors.length > 0 ? (
              authors.map((author, idx) => <UserAvatar key={idx} size={48} user={author} allowAnimation />)
            ) : (
              <Typography variant="caption" color="text.disabled">
                {m.components_collaboration_collaborationQuestionCard_noAssigned()}
              </Typography>
            )}
          </AvatarGroup>
        </Grid>
      </Grid>
      <Grid container item xs={12} md={6}>
        <Box sx={commentWrapperStyle}>
          <CollaborationCommentsSection collaborationQuestion={item} />
        </Box>
      </Grid>
    </Grid>
  );
};

const leftGridStyle: SxProps = {
  paddingRight: '2em',
  [theme.breakpoints.down('md')]: {
    paddingRight: 0,
  },
};
