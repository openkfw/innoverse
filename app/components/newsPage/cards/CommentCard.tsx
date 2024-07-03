import Stack from '@mui/material/Stack';

import { useUser } from '@/app/contexts/user-context';
import { CommonCommentProps, UserSession } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { ResponseControls } from '@/components/common/editing/controls/ResponseControl';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { TextCard } from '@/components/common/TextCard';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import { removeComment, updateComment } from '@/services/commentService';

interface NewsCommentCardProps {
  comment: CommonCommentProps;
  commentType: 'NEWS_COMMENT' | 'POST_COMMENT';
  onUpdate: (updatedText: string) => void;
  onDelete: () => void;
}

export const NewsCommentCard = (props: NewsCommentCardProps) => {
  const { comment, commentType, onUpdate, onDelete } = props;
  const state = useEditingState();
  const interactions = useEditingInteractions();
  const { user } = useUser();
  const userIsAuthor = user?.providerId === comment.author.providerId;

  const handleDelete = async (user: UserSession) => {
    await removeComment({ user, commentId: comment.commentId, commentType });
    onDelete();
  };

  const handleUpdate = async (updatedText: string) => {
    interactions.onSubmitEdit();
    onUpdate(updatedText);
    user && (await updateComment({ author: user, commentId: comment.commentId, content: updatedText, commentType }));
  };

  return state.isEditing(comment) ? (
    <WriteCommentCard content={comment} onSubmit={handleUpdate} onDiscard={interactions.onCancelEdit} />
  ) : (
    <TextCard
      text={comment.comment}
      header={<CommentCardHeader content={comment} avatar={{ size: 24 }} />}
      footer={
        <Stack direction={'row'} sx={{ mt: 0 }} style={{ marginTop: '8px', marginLeft: '-8px' }}>
          <ResponseControls onResponse={() => interactions.onStartResponse(comment)} />
          {userIsAuthor && (
            <EditControls
              onEdit={() => interactions.onStartEdit(comment)}
              onDelete={() => user && handleDelete(user)}
            />
          )}
        </Stack>
      }
    />
  );
};
