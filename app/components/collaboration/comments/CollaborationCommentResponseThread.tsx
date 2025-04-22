import { CommentWithResponses, ObjectType } from '@/common/types';
import { CollaborationCommentResponseCard } from '@/components/collaboration/comments/CollaborationCommentResponseCard';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';

interface CollaborationCommentResponseThreadProps {
  comment: CommentWithResponses;
  onDelete: () => void;
}

export const CollaborationCommentResponseThread = (props: CollaborationCommentResponseThreadProps) => {
  const { comment, onDelete } = props;

  return (
    <CommentThread
      card={<CollaborationCommentResponseCard comment={comment} onDelete={onDelete} />}
      renderComment={(_comment, _idx, _deleteComment) => <></>}
      item={{
        id: comment.id,
        author: comment.author,
        commentCount: comment.commentCount,
      }}
      itemType={ObjectType.COLLABORATION_QUESTION}
    />
  );
};
