import { useEffect, useMemo, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { NewsFeedEntry, Reaction } from '@/common/types';
import { handleReaction } from '@/components/collaboration/emojiReactions/cards/actions';
import { EmojiReactionCard } from '@/components/collaboration/emojiReactions/cards/EmojiReactionCard';
import { Emoji, ReactionCount } from '@/components/collaboration/emojiReactions/emojiReactionTypes';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';
import { optimisticUpdateForNewsFeedEntry } from '@/utils/optimisticUpdateForNewsFeedEntry';

interface NewsFeedItemReactionControlProps {
  entry: NewsFeedEntry;
}

export function NewsFeedItemReactionControl({ entry }: NewsFeedItemReactionControlProps) {
  const [card, setCard] = useState<NewsFeedEntry>(entry);
  const appInsights = useAppInsightsContext();

  useEffect(() => {
    setCard(entry);
  }, [entry]);

  console.log('NewsFeedItemReactionControl');

  const handleReactionOnEntry = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await optimisticUpdateForNewsFeedEntry({
        currentState: card,
        setCurrentState: setCard,
        performOperation: () => handleReaction({ emoji, objectId: entry.item.id, objectType: entry.type, operation }),
        emoji,
        operation,
        handleError: (error) => {
          console.error('Failed to handle reaction on the update:', error);
          errorMessage({ message: m.components_newsPage_cards_common_newsFeedItemReactionControl_error() });
          appInsights.trackException({
            exception: new Error('Failed to update reaction on the update', { cause: error }),
            severityLevel: SeverityLevel.Error,
          });
        },
      });
    } catch (error) {
      console.error('Operation failed:', error);
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

  const reactionCounts = useMemo(() => aggregateReactions(card.item.reactions || []), [card]);

  return (
    <EmojiReactionCard
      countOfReactions={reactionCounts}
      userReaction={card.item.reactionForUser}
      handleReaction={handleReactionOnEntry}
    />
  );
}
