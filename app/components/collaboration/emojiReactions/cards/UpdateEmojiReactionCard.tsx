'use client';

import { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { EventWithAdditionalData, ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';
import {
  applyItemReactionOffline,
  useOptimisticReactions,
} from '@/components/collaboration/emojiReactions/optimisticReactions';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';

import { Emoji } from '../emojiReactionTypes';

import { EmojiReactionCard } from './EmojiReactionCard';

export interface UpdateEmojiReactionCardProps {
  update: ProjectUpdateWithAdditionalData;
}

export function UpdateEmojiReactionCard(props: UpdateEmojiReactionCardProps) {
  const { update } = props;
  const [currentUpdate, setCurrentUpdate] = useState<ProjectUpdateWithAdditionalData | EventWithAdditionalData>(update);

  const { applyReaction } = useOptimisticReactions({
    objectId: update.id,
    objectType: ObjectType.UPDATE,
    currentState: currentUpdate,
    setCurrentState: setCurrentUpdate,
    applyReactionOffline: applyItemReactionOffline,
  });

  const appInsights = useAppInsightsContext();

  useEffect(() => {
    setCurrentUpdate(update);
  }, [update]);

  async function handleReactionOnUpdate(emoji: Emoji, operation: 'upsert' | 'delete') {
    try {
      await applyReaction({ emoji, operation });
    } catch (error) {
      console.error('Failed to handle reaction on project update:', error);
      errorMessage({
        message: m.components_collaboration_emojiReactions_cards_updateEmojiReactionCard_updateError(),
      });
      appInsights.trackException({
        exception: new Error('Failed to update reaction on project update', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  }

  return (
    <EmojiReactionCard
      countOfReactions={currentUpdate.reactionCount}
      userReaction={currentUpdate.reactionForUser}
      handleReaction={handleReactionOnUpdate}
    />
  );
}
