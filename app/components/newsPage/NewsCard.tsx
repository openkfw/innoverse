'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';
import AvatarIcon from '@/components/common/AvatarIcon';
import InteractionButton, { InteractionType } from '@/components/common/InteractionButton';
import { handleFollow, handleRemoveFollower, isFollowed } from '@/components/project-details/likes-follows/actions';
import theme from '@/styles/theme';
import { formatDate } from '@/utils/helpers';

import { UpdateEmojiReactionCard } from '../collaboration/emojiReactions/UpdateEmojiReactionCard';

interface ProjectCardProps {
  update: ProjectUpdate;
  sx?: any;
  noClamp?: boolean;
}

export default function NewsCard(props: ProjectCardProps) {
  const { update, sx, noClamp = false } = props;
  const projectId = update.projectId;
  const { title, comment, author, date } = update;

  const [isProjectFollowed, setIsProjectFollowed] = useState<boolean>(false);

  const toggleFollow = async () => {
    if (isProjectFollowed) {
      setIsProjectFollowed(false);
      await handleRemoveFollower({ projectId });
    } else {
      setIsProjectFollowed(true);
      await handleFollow({ projectId });
    }
  };

  useEffect(() => {
    const setProjectInteraction = async () => {
      const projectIsFollowed = (await isFollowed({ projectId })).data;
      setIsProjectFollowed(projectIsFollowed ?? false);
    };
    setProjectInteraction();
  }, [projectId]);

  return (
    <Card sx={{ ...cardStyles, ...sx }}>
      <CardHeader
        sx={cardHeaderStyles}
        avatar={author && <AvatarIcon user={author} size={24} />}
        title={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {author && (
              <Typography variant="subtitle2" color="secondary.contrastText" sx={{ fontSize: '14px' }}>
                {author.name}
              </Typography>
            )}

            <Typography variant="caption" color="secondary.contrastText">
              {formatDate(date)}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={cardContentStyles}>
        <Box sx={titleWrapperStyles}>
          <Typography sx={noClamp ? subtitleStyles : null} color="text.primary" variant="body1">
            {comment}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={cardActionsStyles}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={7}>
            {projectId ? (
              <Link href={`/projects/${projectId}`} style={{ ...linkStyle }}>
                <Stack direction="row" alignItems="center">
                  <ArrowForwardIcon sx={{ fontSize: '14px', color: 'secondary.main' }} />
                  <Typography variant="subtitle2" sx={{ fontSize: '14px' }} noWrap>
                    {title}
                  </Typography>
                </Stack>
              </Link>
            ) : (
              <Stack direction="row" alignItems="center" />
            )}
          </Grid>

          <Grid item container xs={5} justifyContent="flex-end">
            <InteractionButton
              isSelected={isProjectFollowed}
              projectName={title}
              interactionType={InteractionType.PROJECT_FOLLOW}
              onClick={() => toggleFollow()}
              sx={followButtonStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <UpdateEmojiReactionCard updateId={update.id} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

// News Card Styles
const cardStyles = {
  paddingX: 3,
  paddingY: 4,
  borderRadius: '8px',
  marginRight: 3,
  height: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '368px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '100%',
  },
  display: 'flex',
  flexDirection: 'column',
};

const cardHeaderStyles = {
  textAlign: 'left',
  padding: 0,
  marginTop: 1,
  '& .MuiCardHeader-avatar': {
    marginRight: 1,
  },
};

const cardContentStyles = {
  paddingTop: 0,
  padding: 0,
  margin: 0,
  textAlign: 'left',
};

const cardActionsStyles = {
  mt: 'auto',
  p: 0,
  pt: 1,
};

const titleWrapperStyles = {
  marginTop: 10 / 8,
  marginBotom: 10 / 8,
};

const subtitleStyles = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 4,
};

const linkStyle = {
  textDecoration: 'none',
};

const followButtonStyles = {
  padding: '3px 8px 3px 6px',
  height: '100%',
  fontWeight: 400,
  '& .MuiButton-startIcon>*:nth-of-type(1)': {
    fontSize: '15px',
  },
  '& .MuiButton-startIcon': {
    ml: '4px',
    mr: '2px',
  },
};
