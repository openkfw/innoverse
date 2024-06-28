import { useEffect, useMemo, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { StatusCodes } from 'http-status-codes';

import { NewsFeedEntry, Reaction } from '@/common/types';
import { handleReaction } from '@/components/collaboration/emojiReactions/cards/actions';
import { EmojiReactionCard } from '@/components/collaboration/emojiReactions/cards/EmojiReactionCard';
import { Emoji, ReactionCount } from '@/components/collaboration/emojiReactions/emojiReactionTypes';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';

interface NewsFeedItemReactionControlProps {
  entry: NewsFeedEntry;
}

export function NewsFeedItemReactionControl({ entry }: NewsFeedItemReactionControlProps) {
  const [card, setCard] = useState<NewsFeedEntry>(entry);
  const appInsights = useAppInsightsContext();

  useEffect(() => {
    setCard(entry);
  }, [entry]);

  const handleReactionOnEntry = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      const response = await handleReaction({ emoji, objectId: entry.item.id, objectType: entry.type, operation });
      if (response.status !== StatusCodes.OK || !response.data) return;

      if (operation === 'delete') {
        setCard((card) => {
          const reactionsBefore = (card.item.reactions ?? []).filter((r) => r.id !== reaction.id);
          return {
            type: card.type,
            item: { ...card.item, reactions: reactionsBefore, reactionForUser: undefined },
          } as NewsFeedEntry;
        });

        return;
      }

      const reaction: Reaction = {
        ...response.data,
        objectType: card.type,
      };

      setCard((card) => {
        const reactionsBefore = (card.item.reactions ?? []).filter((r) => r.id !== reaction.id);
        return {
          type: card.type,
          item: { ...card.item, reactions: [...reactionsBefore, reaction], reactionForUser: reaction },
        } as NewsFeedEntry;
      });
    } catch (error) {
      console.error('Failed to handle reaction on the update:', error);
      errorMessage({ message: m.components_newsPage_cards_common_newsFeedItemReactionControl_error() });
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

  const reactionCounts = useMemo(() => aggregateReactions(card.item.reactions || []), [card]);

  return (
    <EmojiReactionCard
      countOfReactions={reactionCounts}
      userReaction={card.item.reactionForUser}
      handleReaction={handleReactionOnEntry}
    />
  );
}
