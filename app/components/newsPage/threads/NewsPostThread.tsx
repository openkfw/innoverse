import { Post } from '@/common/types';
import NewsPostCard from '@/components/newsPage/cards/NewsPostCard';
import { addUserComment } from '@/components/newsPage/threads/actions';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { NewsCommentThread } from '@/components/newsPage/threads/NewsCommentThread';
import { getPostCommentByPostId } from '@/utils/requests/comments/requests';

interface NewsPostThreadProps {
  post: Post;
}

export const NewsPostThread = (props: NewsPostThreadProps) => {
  const { post } = props;

  const fetchResponses = async () => {
    return await getPostCommentByPostId(post.id);
  };

  const addResponse = async (text: string) => {
    const response = await addUserComment({
      comment: text,
      commentType: 'POST_COMMENT',
      objectId: post.id,
    });
    const data = response.data ? { ...response.data, responseCount: 0, responses: [] } : undefined;
    return { ...response, data };
  };

  return (
    <CommentThread
      comment={post}
      card={<NewsPostCard post={post} />}
      fetchResponses={fetchResponses}
      addResponse={addResponse}
      renderResponse={(response, idx, deleteResponse, updateResponse) => (
        <NewsCommentThread
          key={`${idx}-${response.id}`}
          item={post}
          comment={response}
          commentType="POST_COMMENT"
          level={1}
          onDelete={deleteResponse}
          onUpdate={updateResponse}
        />
      )}
    />
  );
};
