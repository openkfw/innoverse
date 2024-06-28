import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';

import { NewsFeedEntry } from '@/common/types';
import { handleFollow, handleRemoveFollower } from '@/components/project-details/likes-follows/actions';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { errorMessage } from '../../../common/CustomToast';
import FollowButtonWithLink from '../../../common/FollowButtonWithLink';

import { NewsCardReactions } from './NewsCardReactions';

interface NewsCardActionsProps {
  entry: NewsFeedEntry;
}

export const NewsCardActions = ({ entry }: NewsCardActionsProps) => {
  const { id, followedByUser } = entry.item;
  const appInsights = useAppInsightsContext();
  const [isFollowed, setIsFollowed] = useState<boolean>(followedByUser ?? false);

  async function toggleFollow() {
    try {
      if (isFollowed) {
        setIsFollowed(false);
        await handleRemoveFollower({ objectId: id, objectType: entry.type });
      } else {
        setIsFollowed(true);
        await handleFollow({ objectId: id, objectType: entry.type });
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      errorMessage({ message: m.components_newsPage_cards_common_newsCardAction_error() });
      appInsights.trackException({
        exception: new Error('Failed to toggle follow status.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  }

  return (
    <CardActions sx={cardActionsStyles}>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} sx={footerStyles}>
          <NewsCardReactions entry={entry} />
          <FollowButtonWithLink isSelected={isFollowed} entry={entry} onIconClick={toggleFollow} />
        </Grid>
      </Grid>
    </CardActions>
  );
};

// News Card Actions Styles
const cardActionsStyles = {
  mt: 'auto',
  p: 0,
  pt: 1,
};

const footerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
    alignItems: 'flex-start',
    marginTop: 3,
    gap: 1,
  },
};
