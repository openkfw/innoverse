'use client';
import { useCallback, useEffect, useState } from 'react';

import { errorMessage } from '@/components/common/CustomToast';

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
    try {
      const { data: userReactionFromServer } = await getReactionForUpdateAndUser({ updateId });
    const { data: countOfReactions } = await getCountPerEmojiOnUpdate({ updateId });
    setUserReaction(userReactionFromServer ?? undefined);
    setCountOfReactions(countOfReactions ?? []);
    } catch (error) {
      console.error('Failed to fetch reactions for the update:', error);
      errorMessage({ message: 'Failed to load reactions. Please try again later.' });
    }
  }, [updateId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReaction = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await handleNewReactionOnUpdate({ emoji: emoji, updateId: updateId, operation: operation });
      await fetchReactions();
    } catch (error) {
      console.error('Failed to handle reaction on the update:', error);
      errorMessage({ message: 'Updating your reaction failed. Please try again.' });
    }
  };

  return (
    <EmojiReactionCard
      countOfReactions={countOfReactions}
      userReaction={userReaction}
      handleReaction={handleReaction}
    />
  );
}
