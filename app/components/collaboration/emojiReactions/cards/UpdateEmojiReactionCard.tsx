'use client';

import { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';
import { getUpdateWithAdditionalData } from '@/utils/requests/updates/requests';

import { Emoji } from '../emojiReactionTypes';

import { handleReaction } from './actions';
import { EmojiReactionCard } from './EmojiReactionCard';

export interface UpdateEmojiReactionCardProps {
  update: ProjectUpdateWithAdditionalData;
}

export function UpdateEmojiReactionCard(props: UpdateEmojiReactionCardProps) {
  const { update } = props;
  const [currentUpdate, setCurrentUpdate] = useState<ProjectUpdateWithAdditionalData>(update);
  const appInsights = useAppInsightsContext();

  useEffect(() => {
    setCurrentUpdate(update);
  }, [update]);

  const handleReactionOnUpdate = async (emoji: Emoji, operation: 'upsert' | 'delete') => {
    try {
      await handleReaction({ emoji, objectId: update.id, objectType: ObjectType.UPDATE, operation });
      const updateWithAdditionalData = await getUpdateWithAdditionalData(update);
      setCurrentUpdate(updateWithAdditionalData);
    } catch (error) {
      console.error('Failed to handle reaction on the update:', error);
      errorMessage({ message: m.components_collaboration_emojiReactions_cards_updateEmojiReactionCard_updateError() });
      appInsights.trackException({
        exception: new Error('Failed to update reaction on the update', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return (
    <EmojiReactionCard
      countOfReactions={currentUpdate.reactionCount}
      userReaction={currentUpdate.reactionForUser}
      handleReaction={handleReactionOnUpdate}
    />
  );
}
