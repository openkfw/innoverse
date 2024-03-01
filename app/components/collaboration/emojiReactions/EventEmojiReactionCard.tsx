'use client';
import { useCallback, useEffect, useState } from 'react';

import { errorMessage } from '@/components/common/CustomToast';

import { getCountPerEmojiOnEvent, getReactionForEventAndUser, handleNewReactionOnEvent } from './actions';
import { EmojiReactionCard } from './EmojiReactionCard';
import { CountReaction, Emoji, Reaction } from './emojiReactionTypes';

export interface EventEmojiReactionCardProps {
  eventId: string;
}

export function EventEmojiReactionCard({ eventId }: EventEmojiReactionCardProps) {
  const [userReaction, setUserReaction] = useState<Reaction>();
  const [countOfReactionsByShortCode, setCountOfReactionsByShortCode] = useState<CountReaction[]>([]);

  const fetchReactions = useCallback(async () => {
    try {
      const { data: userReactionFromServer } = await getReactionForEventAndUser({ eventId });
      const { data: countOfReactionsByUpdateAndShortcode } = await getCountPerEmojiOnEvent({ eventId });
      setUserReaction(userReactionFromServer ?? undefined);
      setCountOfReactionsByShortCode(countOfReactionsByUpdateAndShortcode ?? []);
    } catch (error) {
      console.error('Failed to fetch reactions:', error);
      errorMessage({ message: 'Failed to load reactions. Please try again.' });
    }
  }, [eventId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReaction = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await handleNewReactionOnEvent({ emoji: emoji, eventId: eventId, operation: operation });
      await fetchReactions();
    } catch (error) {
      console.error('Failed to handle reaction:', error);
      errorMessage({ message: 'Failed to update reaction. Please try again.' });
    }
  };

  return (
    <EmojiReactionCard
      countOfReactionsByShortCode={countOfReactionsByShortCode}
      userReaction={userReaction}
      handleReaction={handleReaction}
    />
  );
}
