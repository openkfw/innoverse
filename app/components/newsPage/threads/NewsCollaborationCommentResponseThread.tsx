import { CommentResponse } from '@/common/types';
import { useCollaborationCommentResponseThread } from '@/components/collaboration/comments/CollaborationCommentResponseThread';
import { NewsCollabCommentResponseCard } from '@/components/newsPage/cards/NewsCollabCommentResponseCard';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';

interface NewsCollaborationCommentResponseThreadProps {
  response: CommentResponse;
  onDelete: () => void;
}

// Nested collaboration comment responses are not yet supported
export const NewsCollaborationCommentResponseThread = (props: NewsCollaborationCommentResponseThreadProps) => {
  const { response, onDelete } = props;
  const { fetchResponses, addResponse } = useCollaborationCommentResponseThread();

  return (
    <CommentThread
      comment={{ id: response.id, responseCount: 0, author: response.author }}
      card={<NewsCollabCommentResponseCard response={response} onDelete={onDelete} />}
      fetchResponses={fetchResponses}
      renderResponse={(_response, _idx, _deleteResponse) => <></>}
      addResponse={addResponse}
    />
  );
};
