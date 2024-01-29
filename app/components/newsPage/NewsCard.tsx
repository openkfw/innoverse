'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';
import AvatarIcon from '@/components/common/AvatarIcon';
import { formatDate } from '@/utils/helpers';

import EmojiReactionCard from '../collaboration/emojiReactions/EmojiReactionCard';
import InteractionButton, { InteractionType } from '../common/InteractionButton';
import { handleFollow, handleRemoveFollower, isFollowed } from '../project-details/likes-follows/actions';

interface ProjectCardProps {
  update: ProjectUpdate;
}

export default function NewsCard(props: ProjectCardProps) {
  const { update } = props;
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
      setIsProjectFollowed((await isFollowed({ projectId })).data);
    };
    setProjectInteraction();
  }, [projectId]);

  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={cardHeaderStyles}
        avatar={<AvatarIcon user={author} size={24} />}
        title={
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="caption" sx={{ color: 'text.primary' }}>
                {author.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" sx={{ color: 'secondary.contrastText' }}>
                {formatDate(date)}
              </Typography>
            </Grid>
          </Grid>
        }
      />
      <CardContent sx={cardContentStyles}>
        <Box sx={titleWrapperStyles}>
          <Typography sx={subtitleStyles} variant="body1">
            {comment}
          </Typography>
        </Box>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          <Grid item>
            <Link href={`/projects/${projectId}`} style={{ ...linkStyle }}>
              <Stack direction="row" alignItems="center">
                <ArrowForwardIcon sx={{ fontSize: '14px', color: 'secondary.main' }} />
                <Typography variant="subtitle2">{title}</Typography>
              </Stack>
            </Link>
          </Grid>

          <Grid item>
            <InteractionButton
              projectName={title}
              interactionType={InteractionType.PROJECT_FOLLOW}
              onClick={() => toggleFollow()}
            />
          </Grid>
        </Grid>
        <EmojiReactionCard updateId={update.id} />
      </CardContent>
    </Card>
  );
}

// News Card Styles
const cardStyles = {
  paddingY: 4,
  paddingX: '99px',
  borderRadius: '8px',
  marginRight: '24px',
  width: '100%',
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

const titleWrapperStyles = {
  marginTop: 10 / 8,
  marginBotom: 10 / 8,
};

const subtitleStyles = {
  color: 'text.primary',
  fontSize: '16px',
};

const linkStyle = {
  textDecoration: 'none',
  '&:hover': {
    color: 'red',
  },
};
