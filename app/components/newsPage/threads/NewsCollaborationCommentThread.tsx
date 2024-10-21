import { CollaborationComment, Comment } from '@/common/types';
import { addProjectCollaborationCommentResponse } from '@/components/collaboration/comments/actions';
import NewsCollabCommentCard from '@/components/newsPage/cards/NewsCollabCommentCard';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { NewsCollaborationCommentResponseThread } from '@/components/newsPage/threads/NewsCollaborationCommentResponseThread';
import { getProjectCollaborationCommentResponses } from '@/utils/requests/collaborationComments/requests';

interface CollaborationCommentThreadProps {
  comment: CollaborationComment;
  projectName?: string;
  onDelete: () => void;
}

export const NewsCollaborationCommentThread = (props: CollaborationCommentThreadProps) => {
  const { comment, onDelete } = props;

  const { fetchResponses, addResponse } = useCollaborationCommentThread(props);

  return (
    <CommentThread
      comment={{ id: comment.id, responseCount: comment.responseCount, author: comment.author }}
      card={<NewsCollabCommentCard item={comment} onDelete={onDelete} />}
      fetchResponses={fetchResponses}
      addResponse={addResponse}
      renderResponse={(response, idx, deleteResponse) => (
        <NewsCollaborationCommentResponseThread
          key={`${idx}-${response.id}`}
          response={response}
          onDelete={deleteResponse}
        />
      )}
    ></CommentThread>
  );
};

export function useCollaborationCommentThread(props: { comment: Comment | CollaborationComment }) {
  const { comment } = props;

  const fetchResponses = async () => {
    const responses = await getProjectCollaborationCommentResponses({ comment });
    return responses.data?.map((response) => ({ ...response, responseCount: 0 })) ?? [];
  };

  const addResponse = async (response: string) => {
    const result = await addProjectCollaborationCommentResponse({ comment, response });
    const data = result.data ? { ...result.data, responseCount: 0 } : undefined;
    return { ...result, data };
  };

  return {
    fetchResponses,
    addResponse,
  };
}
