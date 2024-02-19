'use client';
import { useCallback, useEffect, useState } from 'react';

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
    const { data: userReactionFromServer } = await getReactionForEventAndUser({ eventId });
    const { data: countOfReactionsByUpdateAndShortcode } = await getCountPerEmojiOnEvent({ eventId });
    setUserReaction(userReactionFromServer ?? undefined);
    setCountOfReactionsByShortCode(countOfReactionsByUpdateAndShortcode ?? []);
  }, [eventId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReaction = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    await handleNewReactionOnEvent({ emoji: emoji, eventId: eventId, operation: operation });
    await fetchReactions();
  };

  return (
    <EmojiReactionCard
      countOfReactionsByShortCode={countOfReactionsByShortCode}
      userReaction={userReaction}
      handleReaction={handleReaction}
    />
  );
}
