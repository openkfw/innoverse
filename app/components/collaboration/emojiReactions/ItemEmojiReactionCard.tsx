'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { SxProps } from '@mui/material/styles';

import { EventWithAdditionalData, ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';

import { EmojiReactionCard } from './cards/EmojiReactionCard';
import { handleNewReaction } from './actions';
import { Emoji } from './emojiReactionTypes';

export interface ItemEmojiReactionCardProps {
  item: EventWithAdditionalData | ProjectUpdateWithAdditionalData;
  type: ObjectType;
  sx?: SxProps;
}

export default function ItemEmojiReactionCard({ item, type, sx }: ItemEmojiReactionCardProps) {
  const [currentItem, setCurrentItem] = useState(item);
  const { id, reactionForUser, reactionCount } = currentItem;
  const appInsights = useAppInsightsContext();

  const handleReactionOnEvent = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await handleNewReaction({ emoji: emoji, objectId: id, objectType: type, operation: operation });
      setCurrentItem(item);
    } catch (error) {
      console.error('Failed to handle reaction:', error);
      errorMessage({ message: 'Failed to update reaction. Please try again.' });
      appInsights.trackException({
        exception: new Error('Failed to update reaction.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return (
    <EmojiReactionCard
      countOfReactions={reactionCount}
      userReaction={reactionForUser}
      handleReaction={handleReactionOnEvent}
      sx={sx}
    />
  );
}
