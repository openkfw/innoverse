'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { SxProps } from '@mui/material/styles';

import { EventWithAdditionalData, ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';
import {
  applyItemReactionOffline,
  useOptimisticReactions,
} from '@/components/collaboration/emojiReactions/optimisticReactions';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';

import { Emoji } from '../emojiReactionTypes';

import { EmojiReactionCard } from './EmojiReactionCard';

export interface EventEmojiReactionCardProps {
  item: EventWithAdditionalData | ProjectUpdateWithAdditionalData;
  type: ObjectType;
  sx?: SxProps;
}

export default function EventEmojiReactionCard({ item, type, sx }: EventEmojiReactionCardProps) {
  const [currentItem, setCurrentItem] = useState(item);
  const { id, reactionForUser, reactionCount } = currentItem;

  const { applyReaction } = useOptimisticReactions({
    objectId: id,
    objectType: type,
    currentState: currentItem,
    setCurrentState: setCurrentItem,
    applyReactionOffline: applyItemReactionOffline,
  });

  const appInsights = useAppInsightsContext();

  const handleReactionOnEvent = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await applyReaction({ emoji, operation });
    } catch (error) {
      console.error('Failed to handle reaction on project event:', error);
      errorMessage({ message: m.components_collaboration_emojiReactions_cards_eventEmojiReactionCard_updateError() });
      appInsights.trackException({
        exception: new Error('Failed to handle reaction on project event:', { cause: error }),
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
