'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { SxProps } from '@mui/material/styles';

import { EventWithAdditionalData } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { getEventWithAdditionalData } from '@/utils/requests/events/requests';

import { handleNewReactionOnEvent } from './actions';
import { EmojiReactionCard } from './EmojiReactionCard';
import { Emoji } from './emojiReactionTypes';

export interface EventEmojiReactionCardProps {
  event: EventWithAdditionalData;
  sx?: SxProps;
}

export default function EventEmojiReactionCard({ event, sx }: EventEmojiReactionCardProps) {
  const [currentEvent, setCurrentEvent] = useState(event);
  const { id, reactionForUser, reactionCount } = currentEvent;
  const appInsights = useAppInsightsContext();

  const handleReaction = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await handleNewReactionOnEvent({ emoji: emoji, eventId: id, operation: operation });
      const eventWithAdditionalData = await getEventWithAdditionalData(event);
      setCurrentEvent(eventWithAdditionalData);
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
      handleReaction={handleReaction}
      sx={sx}
    />
  );
}
