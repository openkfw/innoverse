import { useState } from 'react';

import { Post } from '@/common/types';
import { ItemWithCommentsThread } from '@/components/newsPage/cards/common/threads/ItemWithCommentsThread';
import NewsPostCard from '@/components/newsPage/cards/PostCard';
import { getPostCommentByPostId } from '@/utils/requests/comments/requests';

interface NewsPostThreadProps {
  post: Post;
  onDelete: () => void;
}

export const NewsPostThread = (props: NewsPostThreadProps) => {
  const [post, setPost] = useState(props.post);

  const fetchPostComments = async () => {
    const responses = await getPostCommentByPostId(post.id);
    return responses;
  };

  const handleUpdate = (updatedText: string) => {
    setPost({ ...post, content: updatedText });
  };

  return (
    <ItemWithCommentsThread
      item={{ id: post.id, responseCount: post.responseCount }}
      card={<NewsPostCard post={post} onUpdate={handleUpdate} onDelete={props.onDelete} />}
      fetchResponses={fetchPostComments}
      commentType="POST_COMMENT"
    />
  );
};
