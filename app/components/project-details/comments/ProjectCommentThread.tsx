import { CommentWithResponses, ObjectType } from '@/common/types';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';

import { ProjectCommentCard } from './ProjectCommentCard';
import { ProjectCommentResponseThread } from './ProjectCommentResponseThread';

interface CollaborationCommentThreadProps {
  comment: CommentWithResponses;
  projectName?: string;
  onDelete: () => void;
  onUpdate: (comment: CommentWithResponses) => void;
}

export const ProjectCommentThread = (props: CollaborationCommentThreadProps) => {
  const { comment } = props;

  return (
    <CommentThread
      item={comment}
      itemType={ObjectType.PROJECT}
      renderComment={(response, idx, deleteResponse, updateResponse) => (
        <ProjectCommentResponseThread
          key={`${idx}-${response.id}`}
          comment={response}
          onDelete={deleteResponse}
          onUpdate={updateResponse}
        />
      )}
      disableDivider={true}
      indentComments={'3em'}
      card={
        <ProjectCommentCard
          comment={comment}
          projectName={props.projectName}
          onDelete={props.onDelete}
          onUpdate={props.onUpdate}
        />
      }
    />
  );
};
