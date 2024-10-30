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

  const { fetchComments, addComment } = useCollaborationCommentThread(props);

  return (
    <CommentThread
      comment={{ id: comment.id, commentCount: comment.commentCount }}
      card={<NewsCollabCommentCard item={comment} onDelete={onDelete} />}
      fetchComments={fetchComments}
      addComment={addComment}
      renderComment={(comment, idx, deleteComment) => (
        <NewsCollaborationCommentResponseThread
          key={`${idx}-${comment.id}`}
          comment={comment}
          onDelete={deleteComment}
        />
      )}
    ></CommentThread>
  );
};

export function useCollaborationCommentThread(props: { comment: Comment | CollaborationComment }) {
  const { comment } = props;

  const fetchComments = async () => {
    const comments = await getProjectCollaborationCommentResponses({ comment });
    return comments.data?.map((comment) => ({ ...comment, commentCount: 0 })) ?? [];
  };

  const addComment = async (response: string) => {
    const result = await addProjectCollaborationCommentResponse({ comment, response });
    const data = result.data ? { ...result.data, commentCount: 0 } : undefined;
    return { ...result, data };
  };

  return {
    fetchComments,
    addComment,
  };
}
