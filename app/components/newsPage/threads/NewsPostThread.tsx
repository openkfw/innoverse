import { NewsFeedEntry, ObjectType, Post } from '@/common/types';
import NewsPostCard from '@/components/newsPage/cards/NewsPostCard';
import { addUserComment } from '@/components/newsPage/threads/actions';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { NewsCommentThread } from '@/components/newsPage/threads/NewsCommentThread';
import { getPostCommentsByPostId } from '@/utils/requests/comments/requests';

interface NewsPostThreadProps {
  entry: NewsFeedEntry;
}

export const NewsPostThread = ({ entry }: NewsPostThreadProps) => {
  const post = entry.item as Post;

  const fetchComments = async () => await getPostCommentsByPostId(post.id);

  const addComment = async (text: string) => {
    const comment = await addUserComment({
      comment: text,
      commentType: 'POST_COMMENT',
      objectId: post.id,
      objectType: ObjectType.POST,
    });
    const data = comment.data ? { ...comment.data, commentCount: 0, comments: [] } : undefined;
    return { ...comment, data };
  };

  return (
    <CommentThread
      comment={post}
      card={<NewsPostCard entry={entry} />}
      fetchComments={fetchComments}
      addComment={addComment}
      renderComment={(comment, idx, deleteComment, updateComment) => (
        <NewsCommentThread
          key={`${idx}-${comment.id}`}
          item={post}
          comment={comment}
          commentType="POST_COMMENT"
          level={1}
          onDelete={deleteComment}
          onUpdate={updateComment}
        />
      )}
    />
  );
};
