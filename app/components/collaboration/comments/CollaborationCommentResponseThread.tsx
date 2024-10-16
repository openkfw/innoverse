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
  const { fetchResponses, addResponse } = useCollaborationCommentResponseThread();

  return (
    <CommentThread
      comment={{ id: response.id, responseCount: 0, author: response.author }}
      card={<CollaborationCommentResponseCard response={response} onDelete={onDelete} />}
      fetchResponses={fetchResponses}
      renderResponse={(_response, _idx, _deleteResponse) => <></>}
      addResponse={addResponse}
    />
  );
};

export function useCollaborationCommentResponseThread() {
  const fetchResponses = async () => {
    const responses: { id: string; createdAt: Date; responseCount: number }[] = [];
    return responses;
  };

  const addResponse = async (_response: string) => {
    return { status: StatusCodes.OK, data: { id: '0', createdAt: new Date(), responseCount: 0 } };
  };

  return {
    fetchResponses,
    addResponse,
  };
}
