import { CommentResponse } from '@/common/types';
import { useCollaborationCommentResponseThread } from '@/components/collaboration/comments/CollaborationCommentResponseThread';
import { NewsCollabCommentResponseCard } from '@/components/newsPage/cards/NewsCollabCommentResponseCard';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';

interface NewsCollaborationCommentResponseThreadProps {
  comment: CommentResponse;
  onDelete: () => void;
}

// Nested collaboration comment responses are not yet supported
export const NewsCollaborationCommentResponseThread = (props: NewsCollaborationCommentResponseThreadProps) => {
  const { comment, onDelete } = props;
  const { fetchComments, addComment } = useCollaborationCommentResponseThread();

  return (
    <CommentThread
      comment={{ id: comment.id, author: comment.author }}
      card={<NewsCollabCommentResponseCard comment={comment} onDelete={onDelete} />}
      fetchComments={fetchComments}
      renderComment={(_comment, _idx, _deleteComment) => <></>}
      addComment={addComment}
    />
  );
};
