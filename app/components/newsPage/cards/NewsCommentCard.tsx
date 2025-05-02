import { useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Stack from '@mui/material/Stack';

import { useUser } from '@/app/contexts/user-context';
import { CommonCommentProps, ObjectType } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { errorMessage } from '@/components/common/CustomToast';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { LikeControl } from '@/components/common/editing/controls/LikeControl';
import { ResponseControls } from '@/components/common/editing/controls/ResponseControl';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { useRespondingInteractions } from '@/components/common/editing/responding-context';
import { TextCard } from '@/components/common/TextCard';
import { removeUserComment, updateUserComment } from '@/components/newsPage/cards/actions';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import * as m from '@/src/paraglide/messages.js';
import { appInsights } from '@/utils/instrumentation/AppInsights';

import { addCommentLike, deleteCommentLike } from '../threads/actions';

interface NewsCommentCardProps {
  comment: CommonCommentProps;
  objectType: ObjectType;
  displayResponseControls: boolean;
  onDelete: (commentId: string) => void;
  onUpdate: (text: string) => void;
}

export const NewsCommentCard = (props: NewsCommentCardProps) => {
  const {
    comment,
    displayEditingControls,
    displayResponseControls,
    isEditing,
    startEdit,
    startResponse,
    cancelEdit,
    updateComment,
    deleteComment,
    handleLike,
    isCommentLiked,
    commentLikeCount,
  } = useNewsCommentCard(props);

  return isEditing ? (
    <WriteCommentCard content={comment} onSubmit={updateComment} onDiscard={cancelEdit} />
  ) : (
    <TextCard
      text={comment.text}
      header={<CommentCardHeader content={comment} avatar={{ size: 24 }} />}
      footer={
        <Stack direction={'row'} sx={{ mt: 0 }} style={{ marginTop: '8px', marginLeft: '-8px', gap: 16 }}>
          <LikeControl onLike={handleLike} isSelected={isCommentLiked} likeNumber={commentLikeCount} />
          {displayResponseControls && <ResponseControls onResponse={startResponse} />}
          {displayEditingControls && <EditControls onEdit={startEdit} onDelete={deleteComment} />}
        </Stack>
      }
      contentSx={{ marginLeft: 4 }}
    />
  );
};

export const useNewsCommentCard = (props: NewsCommentCardProps) => {
  const { comment, objectType, displayResponseControls, onUpdate } = props;
  const [isCommentLiked, setIsCommentLiked] = useState<boolean>(comment.isLikedByUser || false);
  const [commentLikeCount, setCommentLikeCount] = useState<number>(comment?.likes?.length || 0);

  const state = useEditingState();
  const editingInteractions = useEditingInteractions();
  const respondingInteractions = useRespondingInteractions();
  const { user } = useUser();

  const userIsAuthor = user?.providerId === comment.author?.providerId;

  const handleLike = async () => {
    if (isCommentLiked) {
      setIsCommentLiked(false);
      deleteCommentLike(comment.id);
      setCommentLikeCount(commentLikeCount - 1);
    } else {
      setIsCommentLiked(true);
      addCommentLike(comment.id);
      setCommentLikeCount(commentLikeCount + 1);
    }
  };

  const handleDelete = async () => {
    try {
      await removeUserComment({ commentId: comment.id, objectType });
      props.onDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      errorMessage({ message: m.components_newsPage_cards_commentCard_error_delete() });
      appInsights.trackException({
        exception: new Error('Failed to delete comment', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const handleUpdate = async (updatedText: string) => {
    try {
      await updateUserComment({ commentId: comment.id, content: updatedText, objectType });
      onUpdate(updatedText);
      editingInteractions.onSubmit();
    } catch (error) {
      console.error('Error updating comment:', error);
      errorMessage({ message: m.components_newsPage_cards_commentCard_error_update() });
      appInsights.trackException({
        exception: new Error('Failed to update comment', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return {
    comment,
    displayEditingControls: userIsAuthor,
    displayResponseControls,
    isEditing: state.isEditing(comment),
    startEdit: () => editingInteractions.onStart(comment),
    startResponse: () => respondingInteractions.onStart(comment, 'comment'),
    cancelEdit: editingInteractions.onCancel,
    updateComment: handleUpdate,
    deleteComment: handleDelete,
    handleLike,
    isCommentLiked,
    commentLikeCount,
  };
};
