'use client';

import { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { EventWithAdditionalData, ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';
import { optimisticUpdateForProjectUpdate } from '@/utils/optimisticUpdateForProjectUpdateWithAdditionalData';
import { getUpdateWithAdditionalData } from '@/utils/requests/updates/requests';

import { Emoji } from '../emojiReactionTypes';

import { handleReaction } from './actions';
import { EmojiReactionCard } from './EmojiReactionCard';

export interface UpdateEmojiReactionCardProps {
  update: ProjectUpdateWithAdditionalData;
}

export function UpdateEmojiReactionCard(props: UpdateEmojiReactionCardProps) {
  const appInsights = useAppInsightsContext();
  const { update } = props;
  const [currentUpdate, setCurrentUpdate] = useState<ProjectUpdateWithAdditionalData | EventWithAdditionalData>(update);

  useEffect(() => {
    setCurrentUpdate(update);
  }, [update]);

  async function handleReactionOnUpdate(emoji: Emoji, operation: 'upsert' | 'delete') {
    optimisticUpdateForProjectUpdate({
      currentState: currentUpdate,
      setCurrentState: setCurrentUpdate,
      performOperation: () => handleReaction({ emoji, objectId: update.id, objectType: ObjectType.UPDATE, operation }),
      emoji,
      operation,
      handleError: (error) => {
        console.error('Failed to handle reaction on the update:', error);
        errorMessage({
          message: m.components_collaboration_emojiReactions_cards_updateEmojiReactionCard_updateError(),
        });
        appInsights.trackException({
          exception: new Error('Failed to update reaction on the update', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      },
    }).then((additionalData) => {
      if (additionalData) {
        getUpdateWithAdditionalData(update).then((updateWithAdditionalData) => {
          setCurrentUpdate(updateWithAdditionalData);
        });
      }
    });
  }

  return (
    <EmojiReactionCard
      countOfReactions={currentUpdate.reactionCount}
      userReaction={currentUpdate.reactionForUser}
      handleReaction={handleReactionOnUpdate}
    />
  );
}
