'use client';

import { useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { NewsFeedEntry, ProjectUpdate } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { errorMessage } from '@/components/common/CustomToast';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { UpdateCardContent } from '@/components/common/UpdateCardContent';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import { updateProjectUpdate } from '@/services/updateService';
import * as m from '@/src/paraglide/messages.js';
import { appInsights } from '@/utils/instrumentation/AppInsights';

import { NewsCardActions } from './common/NewsCardActions';

interface UpdateCardProps {
  noClamp?: boolean;
  entry: NewsFeedEntry;
}

const NewsUpdateCard = (props: UpdateCardProps) => {
  const { entry, noClamp = false } = props;
  const [item, setItem] = useState(entry.item as ProjectUpdate);

  const state = useEditingState();
  const editingInteractions = useEditingInteractions();

  const handleUpdate = async (updatedText: string) => {
    try {
      await updateProjectUpdate({ updateId: item.id, comment: updatedText });
      setItem({ ...item, comment: updatedText });
      editingInteractions.onSubmit();
    } catch (error) {
      console.error('Error updating project update:', error);
      errorMessage({ message: m.components_newsPage_cards_newsCard_error_update() });
      appInsights.trackException({
        exception: new Error('Failed to update project update', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return state.isEditing(item) ? (
    <WriteCommentCard
      content={{
        author: item.author,
        updatedAt: item.updatedAt,
        text: item.comment,
        anonymous: item.anonymous,
      }}
      onSubmit={handleUpdate}
      onDiscard={editingInteractions.onCancel}
    />
  ) : (
    <>
      <CommentCardHeader content={item} avatar={{ size: 32 }} />
      <UpdateCardContent update={item} noClamp={noClamp} />
      <NewsCardActions entry={entry} />
    </>
  );
};

export default NewsUpdateCard;
