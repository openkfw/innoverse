import { CommentWithResponses, ObjectType } from '@/common/types';
import { CollaborationCommentCard } from '@/components/collaboration/comments/CollaborationCommentCard';
import { CollaborationCommentResponseThread } from '@/components/collaboration/comments/CollaborationCommentResponseThread';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';

interface CollaborationCommentThreadProps {
  comment: CommentWithResponses;
  projectName?: string;
  onDelete: () => void;
}

export const CollaborationCommentThread = (props: CollaborationCommentThreadProps) => {
  const { comment, projectName, onDelete } = props;

  return (
    <CommentThread
      item={comment}
      itemType={ObjectType.COLLABORATION_QUESTION}
      card={<CollaborationCommentCard comment={comment} projectName={projectName} onDelete={onDelete} />}
      renderComment={(response, idx, deleteResponse) => (
        <CollaborationCommentResponseThread
          key={`${idx}-${response.id}`}
          comment={response}
          onDelete={deleteResponse}
        />
      )}
      disableDivider={true}
      indentComments={'3em'}
    />
  );
};
