'use client';

import { ProjectUpdate } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { UpdateCardContent } from '@/components/common/UpdateCardText';
import { UpdateCardActions } from '@/components/newsPage/cards/common/NewsUpdateCardActions';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import { updateProjectUpdate } from '@/services/updateService';

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
    interactions.onSubmitEdit();
    onUpdate(updatedText);
    await updateProjectUpdate({ updateId: update.id, comment: updatedText });
  };

  return state.isEditing(update) ? (
    <WriteCommentCard content={update} onSubmit={handleUpdate} onDiscard={interactions.onCancelEdit} />
  ) : (
    <>
      <CommentCardHeader content={update} avatar={{ size: 32 }} />
      <UpdateCardContent update={update} noClamp={noClamp} />
      <UpdateCardActions
        update={update}
        onDelete={onDelete}
        onEdit={() => interactions.onStartEdit(update)}
        onResponse={() => interactions.onStartResponse(update)}
      />
    </>
  );
};
