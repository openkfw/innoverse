'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { SxProps } from '@mui/material/styles';

import { EventWithAdditionalData, ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';

import { handleNewReaction } from '../actions';
import { Emoji } from '../emojiReactionTypes';

import { EmojiReactionCard } from './EmojiReactionCard';

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
      errorMessage({ message: m.components_collaboration_emojiReactions_cards_eventEmojiReactionCard_updateError() });
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
