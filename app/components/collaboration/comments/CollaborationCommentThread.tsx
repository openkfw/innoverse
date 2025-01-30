import { CollaborationComment } from '@/common/types';
import { CollaborationCommentCard } from '@/components/collaboration/comments/CollaborationCommentCard';
import { CollaborationCommentResponseThread } from '@/components/collaboration/comments/CollaborationCommentResponseThread';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { useCollaborationCommentThread } from '@/components/newsPage/threads/NewsCollaborationCommentThread';

interface CollaborationCommentThreadProps {
  comment: CollaborationComment;
  projectName?: string;
  onDelete: () => void;
}

export const CollaborationCommentThread = (props: CollaborationCommentThreadProps) => {
  const { comment, projectName, onDelete } = props;
  const { fetchComments, addComment } = useCollaborationCommentThread(props);

  return (
    <CommentThread
      comment={comment}
      card={<CollaborationCommentCard comment={comment} projectName={projectName} onDelete={onDelete} />}
      fetchComments={fetchComments}
      addComment={addComment}
      renderComment={(response, idx, deleteResponse) => (
        <CollaborationCommentResponseThread
          key={`${idx}-${response.id}`}
          response={response}
          onDelete={deleteResponse}
        />
      )}
      disableDivider={true}
      indentComments={'3em'}
    />
  );
};
