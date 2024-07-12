import { useEffect, useMemo, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { NewsFeedEntry, Reaction } from '@/common/types';
import { getNewsFeedItemWithReactions, handleNewReaction } from '@/components/collaboration/emojiReactions/actions';
import { EmojiReactionCard } from '@/components/collaboration/emojiReactions/cards/EmojiReactionCard';
import { Emoji, ReactionCount } from '@/components/collaboration/emojiReactions/emojiReactionTypes';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';

export interface NewsCardReactionsProps {
  entry: NewsFeedEntry;
}

export function NewsCardReactions(props: NewsCardReactionsProps) {
  const { newsFeedEntry, reactionCounts, handleReaction } = useNewsCardReactions(props);

  return (
    <EmojiReactionCard
      countOfReactions={reactionCounts}
      userReaction={newsFeedEntry.item.reactionForUser}
      handleReaction={handleReaction}
    />
  );
}

const useNewsCardReactions = ({ entry }: NewsCardReactionsProps) => {
  const [newsFeedEntry, setNewsFeedEntry] = useState<NewsFeedEntry>(entry);
  const appInsights = useAppInsightsContext();

  useEffect(() => {
    setNewsFeedEntry(entry);
  }, [entry]);

  const handleReaction = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await handleNewReaction({ emoji, objectId: entry.item.id, objectType: entry.type, operation });
      const { data: newsFeedItem } = await getNewsFeedItemWithReactions({
        objectId: entry.item.id,
        objectType: entry.type,
      });
      if (newsFeedItem) {
        setNewsFeedEntry(newsFeedItem);
      }
    } catch (error) {
      console.error('Failed to handle reaction on the update:', error);
      errorMessage({ message: m.components_newsPage_cards_common_newsCardReaction_error() });
      appInsights.trackException({
        exception: new Error('Failed to update reaction on the update', { cause: error }),
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
    handleReaction,
    reactionCounts,
  };
};
