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

export interface NewsCardReactionsProps {
  entry: NewsFeedEntry;
}

export function NewsCardReactions(props: NewsCardReactionsProps) {
  const [entry, setEntry] = useState<NewsFeedEntry>(props.entry);

  const appInsights = useAppInsightsContext();

  const { applyReaction } = useOptimisticReactions({
    objectId: entry.item.id,
    objectType: entry.type,
    currentState: entry,
    setCurrentState: setEntry,
    applyReactionOffline: applyNewsFeedReactionOffline,
  });

  useEffect(() => {
    setEntry(entry);
  }, [entry]);

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

  const reactionCounts = useMemo(() => aggregateReactions(entry.item.reactions || []), [entry]);

  return (
    <EmojiReactionCard
      countOfReactions={reactionCounts}
      userReaction={entry.item.reactionForUser}
      handleReaction={handleReaction}
    />
  );
}
