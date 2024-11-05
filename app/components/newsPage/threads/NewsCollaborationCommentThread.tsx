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

  const { fetchComments, addComment } = useCollaborationCommentThread({ comment });

  return (
    <CommentThread
      comment={{ id: comment.id, commentCount: comment.commentCount }}
      card={<NewsCollabCommentCard entry={entry} />}
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
