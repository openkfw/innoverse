'use client';

import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { ProjectUpdate } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { errorMessage } from '@/components/common/CustomToast';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { UpdateCardContent } from '@/components/common/UpdateCardContent';
import { UpdateCardActions } from '@/components/newsPage/cards/common/NewsUpdateCardActions';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import { deleteProjectUpdate, updateProjectUpdate } from '@/services/updateService';
import * as m from '@/src/paraglide/messages.js';
import { appInsights } from '@/utils/instrumentation/AppInsights';

interface UpdateCardProps {
  update: ProjectUpdate;
  onUpdate: (updatedText: string) => void;
  onDelete: () => void;
  noClamp?: boolean;
}

export const NewsUpdateCard = (props: UpdateCardProps) => {
  const { update, onUpdate, onDelete, noClamp = false } = props;
  const state = useEditingState();
  const interactions = useEditingInteractions();

  const handleUpdate = async (updatedText: string) => {
    try {
      await updateProjectUpdate({ updateId: update.id, comment: updatedText });
      onUpdate(updatedText);
      interactions.onSubmitEdit();
    } catch (error) {
      console.error('Error updating project update:', error);
      errorMessage({ message: m.components_newsPage_cards_newsCard_error_update() });
      appInsights.trackException({
        exception: new Error('Failed to delete project update', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const handleDelete = async () => {
    try {
      deleteProjectUpdate(update.id);
      onDelete();
    } catch (error) {
      console.error('Error deleting project update:', error);
      errorMessage({ message: m.components_newsPage_cards_newsCard_error_delete() });
      appInsights.trackException({
        exception: new Error('Failed to delete project update', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return state.isEditing(update) ? (
    <WriteCommentCard content={update} onSubmit={handleUpdate} onDiscard={interactions.onCancelEdit} />
  ) : (
    <>
      <CommentCardHeader content={update} avatar={{ size: 32 }} />
      <UpdateCardContent update={update} noClamp={noClamp} />
      <UpdateCardActions
        update={update}
        onDelete={handleDelete}
        onEdit={() => interactions.onStartEdit(update)}
        onResponse={() => interactions.onStartResponse(update)}
      />
    </>
  );
};
