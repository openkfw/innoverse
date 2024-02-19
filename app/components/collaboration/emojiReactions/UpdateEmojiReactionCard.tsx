'use client';
import { useCallback, useEffect, useState } from 'react';

import { getCountPerEmojiOnUpdate, getReactionForUpdateAndUser, handleNewReactionOnUpdate } from './actions';
import { EmojiReactionCard } from './EmojiReactionCard';
import { CountReaction, Emoji, Reaction } from './emojiReactionTypes';

export interface UpdateEmojiReactionCardProps {
  updateId: string;
}

export function UpdateEmojiReactionCard({ updateId }: UpdateEmojiReactionCardProps) {
  const [userReaction, setUserReaction] = useState<Reaction>();
  const [countOfReactionsByShortCode, setCountOfReactionsByShortCode] = useState<CountReaction[]>([]);

  const fetchReactions = useCallback(async () => {
    const { data: userReactionFromServer } = await getReactionForUpdateAndUser({ updateId });
    const { data: countOfReactionsByUpdateAndShortcode } = await getCountPerEmojiOnUpdate({ updateId });
    setUserReaction(userReactionFromServer ?? undefined);
    setCountOfReactionsByShortCode(countOfReactionsByUpdateAndShortcode ?? []);
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
      countOfReactionsByShortCode={countOfReactionsByShortCode}
      userReaction={userReaction}
      handleReaction={handleReaction}
    />
  );
}
