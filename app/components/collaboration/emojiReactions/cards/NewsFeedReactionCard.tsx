'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { NewsFeedEntry, Reaction } from '@/common/types';
import { EmojiReactionCard } from '@/components/collaboration/emojiReactions/cards/EmojiReactionCard';
import { Emoji, ReactionCount } from '@/components/collaboration/emojiReactions/emojiReactionTypes';
import {
  applyNewsFeedReactionOffline,
  useOptimisticReactions,
} from '@/components/collaboration/emojiReactions/optimisticReactions';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';

export interface NewsFeedReactionCardProps {
  entry: NewsFeedEntry;
}

export function NewsFeedReactionCard(props: NewsFeedReactionCardProps) {
  const { newsFeedEntry, reactionCounts, handleReaction } = useNewsCardReactions(props);

  return (
    <EmojiReactionCard
      countOfReactions={reactionCounts}
      userReaction={newsFeedEntry.item.reactionForUser}
      handleReaction={handleReaction}
    />
  );
}

const useNewsCardReactions = (props: NewsFeedReactionCardProps) => {
  const [newsFeedEntry, setNewsFeedEntry] = useState<NewsFeedEntry>(props.entry);
  const appInsights = useAppInsightsContext();

  const { applyReaction } = useOptimisticReactions({
    objectId: newsFeedEntry.item.id,
    objectType: newsFeedEntry.type,
    currentState: newsFeedEntry,
    setCurrentState: setNewsFeedEntry,
    applyReactionOffline: applyNewsFeedReactionOffline,
  });

  useEffect(() => {
    setNewsFeedEntry(props.entry);
  }, [props.entry]);

  const handleReaction = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await applyReaction({ emoji, operation });
    } catch (error) {
      console.error('Failed to handle reaction on news feed item:', error);
      errorMessage({ message: m.components_newsPage_cards_common_newsFeedItemReactionControl_error() });
      appInsights.trackException({
        exception: new Error('Failed to update reaction on news feed item', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const aggregateReactions = (reactions: Reaction[]): ReactionCount[] => {
    const reactionCounts: Record<string, ReactionCount> = {};
    reactions.forEach((reaction) => {
      const { nativeSymbol, shortCode } = reaction;
      if (!reactionCounts[shortCode]) {
        reactionCounts[shortCode] = { count: 0, emoji: { nativeSymbol, shortCode } };
      }
      reactionCounts[shortCode].count += 1;
    });
    return Object.values(reactionCounts);
  };

  const reactionCounts = useMemo(() => aggregateReactions(newsFeedEntry.item.reactions || []), [newsFeedEntry]);

  return {
    newsFeedEntry,
    reactionCounts,
    handleReaction,
  };
};
