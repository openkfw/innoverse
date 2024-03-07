'use client';
import { useCallback, useEffect, useState } from 'react';

import { getCountPerEmojiOnEvent, getReactionForEventAndUser, handleNewReactionOnEvent } from './actions';
import { EmojiReactionCard } from './EmojiReactionCard';
import { Emoji, Reaction, ReactionCount } from './emojiReactionTypes';

export interface EventEmojiReactionCardProps {
  eventId: string;
}

export function EventEmojiReactionCard({ eventId }: EventEmojiReactionCardProps) {
  const [userReaction, setUserReaction] = useState<Reaction>();
  const [countOfReactions, setCountOfReactions] = useState<ReactionCount[]>([]);

  const fetchReactions = useCallback(async () => {
    const { data: userReactionFromServer } = await getReactionForEventAndUser({ eventId });
    const { data: countOfReactions } = await getCountPerEmojiOnEvent({ eventId });
    setUserReaction(userReactionFromServer ?? undefined);
    setCountOfReactions(countOfReactions ?? []);
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
      countOfReactions={countOfReactions}
      userReaction={userReaction}
      handleReaction={handleReaction}
    />
  );
}
