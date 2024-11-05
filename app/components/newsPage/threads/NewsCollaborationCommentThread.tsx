import { CollaborationComment, Comment, NewsFeedEntry } from '@/common/types';
import { addProjectCollaborationCommentResponse } from '@/components/collaboration/comments/actions';
import NewsCollabCommentCard from '@/components/newsPage/cards/NewsCollabCommentCard';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { NewsCollaborationCommentResponseThread } from '@/components/newsPage/threads/NewsCollaborationCommentResponseThread';
import { getProjectCollaborationCommentResponses } from '@/utils/requests/collaborationComments/requests';

interface CollaborationCommentThreadProps {
  entry: NewsFeedEntry;
}

export const NewsCollaborationCommentThread = (props: CollaborationCommentThreadProps) => {
  const { entry } = props;
  const comment = entry.item as CollaborationComment;

  const { fetchResponses, addResponse } = useCollaborationCommentThread({ comment });

  return (
    <CommentThread
      comment={{ id: comment.id, responseCount: comment.responseCount, author: comment.author }}
      card={<NewsCollabCommentCard entry={entry} />}
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
