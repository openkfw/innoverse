import { StatusCodes } from 'http-status-codes';

import { CommentResponse } from '@/common/types';
import { CollaborationCommentResponseCard } from '@/components/collaboration/comments/CollaborationCommentResponseCard';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';

interface CollaborationCommentResponseThreadProps {
  response: CommentResponse;
  onDelete: () => void;
}

export const CollaborationCommentResponseThread = (props: CollaborationCommentResponseThreadProps) => {
  const { response, onDelete } = props;
  const { fetchComments, addComment } = useCollaborationCommentResponseThread();

  return (
    <CommentThread
      comment={{ id: response.id }}
      card={<CollaborationCommentResponseCard response={response} onDelete={onDelete} />}
      fetchComments={fetchComments}
      renderComment={(_comment, _idx, _deleteComment) => <></>}
      addComment={addComment}
    />
  );
};

export function useCollaborationCommentResponseThread() {
  const fetchComments = async () => {
    const comments: { id: string; createdAt: Date; commentCount: number }[] = [];
    return comments;
  };

  const addComment = async (_response: string) => {
    return { status: StatusCodes.OK, data: { id: '0', createdAt: new Date(), commentCount: 0 } };
  };

  return {
    fetchComments,
    addComment,
  };
}
