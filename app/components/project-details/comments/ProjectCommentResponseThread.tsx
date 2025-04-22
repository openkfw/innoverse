import { CommentWithResponses, ObjectType } from '@/common/types';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';

import { ProjectCommentResponseCard } from './ProjectCommentResponseCard';

interface CollaborationCommentResponseThreadProps {
  comment: CommentWithResponses;
  onDelete: () => void;
  onUpdate: (comment: CommentWithResponses) => void;
}

export const ProjectCommentResponseThread = (props: CollaborationCommentResponseThreadProps) => {
  const { comment } = props;

  return (
    <CommentThread
      card={<ProjectCommentResponseCard comment={comment} />}
      renderComment={() => <></>}
      item={{
        id: comment.id,
        author: comment.author,
        commentCount: comment.commentCount,
      }}
      itemType={ObjectType.PROJECT}
    />
  );
};
