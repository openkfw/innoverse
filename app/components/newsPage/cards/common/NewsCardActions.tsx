import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { NewsFeedEntry, ObjectType } from '@/common/types';
import { handleFollow, handleRemoveFollower } from '@/components/project-details/likes-follows/actions';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { NewsFeedReactionCard } from '../../../collaboration/emojiReactions/cards/NewsFeedReactionCard';
import { errorMessage } from '../../../common/CustomToast';
import FollowButtonWithLink from '../../../common/FollowButtonWithLink';

interface NewsCardActionsProps {
  entry: NewsFeedEntry;
}

export const NewsCardActions = ({ entry }: NewsCardActionsProps) => {
  const { id, followedByUser, projectId = '' } = entry.item;

  const newsFeed = useNewsFeed();
  const appInsights = useAppInsightsContext();

  const getItemToFollow = () => ({
    objectId: entry.type === ObjectType.POST ? id : projectId,
    objectType: entry.type === ObjectType.POST ? ObjectType.POST : ObjectType.PROJECT,
  });

  async function toggleFollow() {
    try {
      newsFeed.toggleFollow(entry);
      const itemToFollow = getItemToFollow();
      if (followedByUser) {
        await handleRemoveFollower(itemToFollow);
      } else {
        await handleFollow(itemToFollow);
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
          <NewsFeedReactionCard entry={entry} />
          <FollowButtonWithLink isSelected={followedByUser ?? false} entry={entry} onIconClick={toggleFollow} />
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
