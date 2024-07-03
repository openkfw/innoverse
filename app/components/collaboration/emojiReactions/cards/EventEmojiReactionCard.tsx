'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { SxProps } from '@mui/material/styles';

import { EventWithAdditionalData, ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';
import { optimisticUpdateForProjectUpdate } from '@/utils/optimisticUpdateForProjectUpdateWithAdditionalData';

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
    optimisticUpdateForProjectUpdate({
      currentState: currentItem,
      setCurrentState: setCurrentItem,
      performOperation: () => handleNewReaction({ emoji, objectId: id, objectType: type, operation }),
      emoji,
      operation,
      handleError: (error) => {
        errorMessage({ message: m.components_collaboration_emojiReactions_cards_eventEmojiReactionCard_updateError() });
        appInsights.trackException({
          exception: new Error('Failed to update reaction.', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      },
    }).then((additionalData) => {
      if (additionalData) {
        setCurrentItem(item);
      }
    });
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
