import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { NewsFeedEntry, ObjectType } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import FollowButtonWithLink from '@/components/common/FollowButtonWithLink';
import { handleFollow, handleRemoveFollower } from '@/components/project-details/likes-follows/actions';

interface NewsFeedItemFollowControlProps {
  entry: NewsFeedEntry;
}

export const NewsFeedItemFollowControl = ({ entry }: NewsFeedItemFollowControlProps) => {
  const { item } = entry;
  const [isFollowed, setIsFollowed] = useState<boolean>(item.followedByUser ?? false);
  const appInsights = useAppInsightsContext();

  async function toggleFollow() {
    try {
      if (isFollowed) {
        setIsFollowed(false);
        await handleRemoveFollower({ objectId: item.id, objectType: ObjectType.PROJECT });
      } else {
        setIsFollowed(true);
        await handleFollow({ objectId: item.id, objectType: ObjectType.PROJECT });
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      errorMessage({ message: 'Failed to toggle follow status. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to toggle follow status.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  }

  return <FollowButtonWithLink isSelected={isFollowed} entry={entry} onIconClick={toggleFollow} />;
};
