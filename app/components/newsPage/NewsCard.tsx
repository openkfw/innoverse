'use client';

import React, { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import { SxProps, Theme } from '@mui/material/styles';

import { ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import InteractionButton, { InteractionType } from '@/components/common/InteractionButton';
import { LinkWithArrowLeft } from '@/components/common/LinkWithArrowLeft';
import { UpdateCardContent } from '@/components/common/UpdateCardText';
import { handleFollow, handleRemoveFollower } from '@/components/project-details/likes-follows/actions';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import ItemEmojiReactionCard from '../collaboration/emojiReactions/ItemEmojiReactionCard';
import { errorMessage } from '../common/CustomToast';

interface NewsCardProps {
  update: ProjectUpdateWithAdditionalData;
  sx?: SxProps;
  noClamp?: boolean;
}

interface UpdateCardActionsProps {
  update: ProjectUpdateWithAdditionalData;
}

export default function NewsCard(props: NewsCardProps) {
  const { update, sx, noClamp = false } = props;

  return (
    <Card sx={{ ...cardStyles, ...sx } as SxProps<Theme>}>
      <CommentCardHeader content={update} />
      <UpdateCardContent update={update} noClamp={noClamp} />
      <UpdateCardActions update={update} />
    </Card>
  );
}

const UpdateCardActions = (props: UpdateCardActionsProps) => {
  const { update } = props;
  const { title, projectId, followedByUser = false } = update;

  const [isProjectFollowed, setIsProjectFollowed] = useState<boolean>(followedByUser);
  const appInsights = useAppInsightsContext();

  const toggleFollow = async () => {
    try {
      if (isProjectFollowed) {
        setIsProjectFollowed(false);
        await handleRemoveFollower({ objectType: ObjectType.PROJECT, objectId: projectId });
      } else {
        setIsProjectFollowed(true);
        await handleFollow({ objectType: ObjectType.PROJECT, objectId: projectId });
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      errorMessage({ message: m.components_newsPage_newsCard_error() });
      appInsights.trackException({
        exception: new Error('Failed to toggle follow status.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return (
    <CardActions sx={cardActionsStyles}>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={7}>
          <LinkWithArrowLeft title={title} href={`/projects/${projectId}?tab=2`} data-testid="project-link" />
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
          <ItemEmojiReactionCard item={update} type={ObjectType.UPDATE} />
        </Grid>
      </Grid>
    </CardActions>
  );
};

// News Card Styles
const cardStyles = {
  px: 3,
  py: 4,
  borderRadius: '8px',
  marginRight: 3,
  height: '105%',
  background: 'linear-gradient(0deg, rgba(240, 238, 225, 0.30) 0%, rgba(240, 238, 225, 0.30) 100%), #FFF',
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

const cardActionsStyles = {
  mt: 'auto',
  p: 0,
  pt: 1,
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
