import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Stack from '@mui/material/Stack';

import { useUser } from '@/app/contexts/user-context';
import { CommonCommentProps } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { errorMessage } from '@/components/common/CustomToast';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { ResponseControls } from '@/components/common/editing/controls/ResponseControl';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { TextCard } from '@/components/common/TextCard';
import { removeUserComment, updateUserComment } from '@/components/newsPage/cards/actions';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import * as m from '@/src/paraglide/messages.js';
import { appInsights } from '@/utils/instrumentation/AppInsights';

interface NewsCommentCardProps {
  comment: CommonCommentProps;
  commentType: 'NEWS_COMMENT' | 'POST_COMMENT';
  displayResponseControls: boolean;
  onDelete: () => void;
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
  } = useNewsCommentCard(props);

  return isEditing ? (
    <WriteCommentCard content={comment} onSubmit={updateComment} onDiscard={cancelEdit} />
  ) : (
    <TextCard
      text={comment.comment}
      header={<CommentCardHeader content={comment} avatar={{ size: 24 }} />}
      footer={
        <Stack direction={'row'} sx={{ mt: 0 }} style={{ marginTop: '8px', marginLeft: '-8px' }}>
          {displayResponseControls && <ResponseControls onResponse={startResponse} />}
          {displayEditingControls && <EditControls onEdit={startEdit} onDelete={deleteComment} />}
        </Stack>
      }
      contentSx={{ marginLeft: 4 }}
    />
  );
};

const useNewsCommentCard = (props: NewsCommentCardProps) => {
  const { comment, commentType, displayResponseControls, onDelete, onUpdate } = props;

  const state = useEditingState();
  const interactions = useEditingInteractions();
  const { user } = useUser();

  const userIsAuthor = user?.providerId === comment.author.providerId;

  const handleDelete = async () => {
    try {
      await removeUserComment({ commentId: comment.commentId, commentType });
      onDelete();
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
      await updateUserComment({ commentId: comment.commentId, content: updatedText, commentType });
      onUpdate(updatedText);
      interactions.onSubmitEdit();
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
    startEdit: () => interactions.onStartEdit(comment),
    startResponse: () => interactions.onStartResponse(comment),
    cancelEdit: (params: { isDirty: boolean }) => interactions.onCancelEdit(params),
    updateComment: handleUpdate,
    deleteComment: handleDelete,
  };
};
