'use client';
import { useCallback, useEffect, useState } from 'react';

import { getCountPerEmojiOnUpdate, getReactionForUpdateAndUser, handleNewReactionOnUpdate } from './actions';
import { EmojiReactionCard } from './EmojiReactionCard';
import { Emoji, Reaction, ReactionCount } from './emojiReactionTypes';

export interface UpdateEmojiReactionCardProps {
  updateId: string;
}

export function UpdateEmojiReactionCard({ updateId }: UpdateEmojiReactionCardProps) {
  const [userReaction, setUserReaction] = useState<Reaction>();
  const [countOfReactions, setCountOfReactions] = useState<ReactionCount[]>([]);

  const fetchReactions = useCallback(async () => {
    const { data: userReactionFromServer } = await getReactionForUpdateAndUser({ updateId });
    const { data: countOfReactions } = await getCountPerEmojiOnUpdate({ updateId });
    setUserReaction(userReactionFromServer ?? undefined);
    setCountOfReactions(countOfReactions ?? []);
  }, [updateId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReaction = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    await handleNewReactionOnUpdate({ emoji: emoji, updateId: updateId, operation: operation });
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
