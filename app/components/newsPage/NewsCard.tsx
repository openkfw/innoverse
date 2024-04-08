'use client';

import React, { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';
import AvatarIcon from '@/components/common/AvatarIcon';
import InteractionButton, { InteractionType } from '@/components/common/InteractionButton';
import { LinkWithArrowLeft } from '@/components/common/LinkWithArrowLeft';
import { handleFollow, handleRemoveFollower, isFollowed } from '@/components/project-details/likes-follows/actions';
import theme from '@/styles/theme';
import { formatDate } from '@/utils/helpers';

import { UpdateEmojiReactionCard } from '../collaboration/emojiReactions/UpdateEmojiReactionCard';
import { errorMessage } from '../common/CustomToast';
import { parseStringForLinks } from '../common/LinkString';
import { StyledTooltip } from '../common/StyledTooltip';
import { TooltipContent } from '../project-details/TooltipContent';

interface NewsCardProps {
  update: ProjectUpdate;
  sx?: SxProps;
  noClamp?: boolean;
}

export default function NewsCard(props: NewsCardProps) {
  const { update, sx, noClamp = false } = props;
  const projectId = update.projectId;
  const { title, comment, author, updatedAt } = update;

  const appInsights = useAppInsightsContext();
  const [isProjectFollowed, setIsProjectFollowed] = useState<boolean>(false);

  const toggleFollow = async () => {
    try {
      if (isProjectFollowed) {
        setIsProjectFollowed(false);
        await handleRemoveFollower({ projectId });
      } else {
        setIsProjectFollowed(true);
        await handleFollow({ projectId });
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      errorMessage({ message: 'Failed to toggle follow status. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to toggle follow status.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  useEffect(() => {
    const setProjectInteraction = async () => {
      try {
        const projectIsFollowed = (await isFollowed({ projectId })).data;
        setIsProjectFollowed(projectIsFollowed ?? false);
      } catch (error) {
        console.error('Error fetching follow status:', error);
        errorMessage({ message: 'Failed to fetch follow status. Please try again later.' });
        appInsights.trackException({
          exception: new Error('Error fetching follow status.', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      }
    };
    setProjectInteraction();
  }, [projectId]);

  return (
    <Card sx={{ ...cardStyles, ...sx } as SxProps<Theme>}>
      <CardHeader
        sx={cardHeaderStyles}
        avatar={
          author && (
            <Box>
              <StyledTooltip arrow key={author.id} title={<TooltipContent teamMember={author} />} placement="bottom">
                <AvatarIcon user={author} size={24} allowAnimation />
              </StyledTooltip>
            </Box>
          )
        }
        title={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {author && (
              <Typography variant="subtitle2" color="secondary.contrastText" sx={{ fontSize: '14px', ml: '16px' }}>
                {author.name}
              </Typography>
            )}

            <Typography variant="caption" color="secondary.contrastText">
              {formatDate(updatedAt)}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={cardContentStyles}>
        <Box sx={titleWrapperStyles}>
          <Typography sx={noClamp ? subtitleStyles : null} color="text.primary" variant="body1">
            {parseStringForLinks(comment)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={cardActionsStyles}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={'8px'}>
          <Grid item xs={7}>
            {projectId ? (
              <LinkWithArrowLeft title={title} href={`/projects/${projectId}`} />
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
  px: 3,
  py: 4,
  borderRadius: '8px',
  marginRight: 3,
  height: '100%',
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
