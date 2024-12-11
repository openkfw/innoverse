import { NewsComment, PostComment } from '@/common/types';
import { NewsCommentDB, PostCommentDB } from '@/repository/db/utils/types';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';

export const mapToPostComment = async (postComment: PostCommentDB): Promise<PostComment> => {
  const comment = postComment.comment;
  const author = await getInnoUserByProviderId(comment.author);

  return {
    id: postComment.id,
    commentId: postComment.commentId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    comment: comment.text,
    author: author,
    upvotedBy: comment.upvotedBy,
    parentId: comment.parent?.id,
    commentCount: comment.responses.length,
    postId: postComment.postId,
  };
};

export const mapToNewsComment = async (newsComment: NewsCommentDB): Promise<NewsComment> => {
  const comment = newsComment.comment;
  const author = await getInnoUserByProviderId(comment.author);

  return {
    id: newsComment.id,
    commentId: newsComment.commentId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    comment: comment.text,
    author: author,
    upvotedBy: comment.upvotedBy,
    parentId: comment.parent?.id,
    commentCount: comment.responses.length,
    newsId: newsComment.newsId,
  };
};
