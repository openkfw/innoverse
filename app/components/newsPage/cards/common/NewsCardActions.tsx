import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { NewsFeedEntry, ObjectType } from '@/common/types';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { ResponseControls } from '@/components/common/editing/controls/ResponseControl';
import { useEditingInteractions } from '@/components/common/editing/editing-context';
import { useRespondingInteractions } from '@/components/common/editing/responding-context';
import { handleFollow, handleRemoveFollower } from '@/components/project-details/likes-follows/actions';
import { deletePost } from '@/services/postService';
import { deleteProjectUpdate } from '@/services/updateService';
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

  const { toggleFollow, removeEntry } = useNewsFeed();
  const appInsights = useAppInsightsContext();

  const editingInteractions = useEditingInteractions();
  const respondingInteractions = useRespondingInteractions();

  const getItemToFollow = () => ({
    objectId: entry.type === ObjectType.POST ? id : projectId,
    objectType: entry.type === ObjectType.POST ? ObjectType.POST : ObjectType.PROJECT,
  });

  async function handleToggleFollow() {
    try {
      toggleFollow(entry);
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

  async function handleDelete() {
    try {
      switch (entry.type) {
        case ObjectType.POST:
          await deletePost({ postId: entry.item.id });
          break;
        case ObjectType.UPDATE:
          await deleteProjectUpdate(entry.item.id);
          break;
        default:
          break;
      }

      removeEntry(entry);
    } catch (error) {
      console.error(`Error deleting entry of type ${entry.type}:`, error);
      errorMessage({ message: m.components_newsPage_cards_common_newsCardAction_error() });
      appInsights.trackException({
        exception: new Error(`Failed to delete entry of type ${entry.type}`, { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  }

  return (
    <CardActions sx={cardActionsStyles}>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} sx={footerStyles}>
          <NewsFeedReactionCard entry={entry} />
          <Box sx={actionStyles}>
            <ResponseControls onResponse={() => respondingInteractions.onStart(entry.item, 'comment')} />
            <EditControls onDelete={handleDelete} onEdit={() => editingInteractions.onStart(entry.item)} />
            <FollowButtonWithLink isSelected={followedByUser ?? false} entry={entry} onIconClick={handleToggleFollow} />
          </Box>
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

const actionStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 2,
};
