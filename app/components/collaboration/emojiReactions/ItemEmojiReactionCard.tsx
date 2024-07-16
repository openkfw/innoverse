'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { SxProps } from '@mui/material/styles';

import { EventWithAdditionalData, ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';
import { getEventWithAdditionalData } from '@/utils/requests/events/requests';
import { getUpdateWithAdditionalData } from '@/utils/requests/updates/requests';

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

  const handleReaction = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await handleNewReaction({ emoji: emoji, objectId: id, objectType: type, operation: operation });

      const itemWithReaction = await (async () => {
        switch (type) {
          case ObjectType.EVENT:
            return await getEventWithAdditionalData(item as EventWithAdditionalData);

          case ObjectType.UPDATE:
            return await getUpdateWithAdditionalData(item as ProjectUpdateWithAdditionalData);
          default:
            throw new Error(`Unhandled type: ${type}`);
        }
      })();

      itemWithReaction && setCurrentItem(itemWithReaction);
    } catch (error) {
      console.error('Failed to handle reaction:', error);
      errorMessage({ message: m.components_collaboration_emojiReactions_itemEmojiReactionCard_updateError() });
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
      handleReaction={handleReaction}
      sx={sx}
    />
  );
}
