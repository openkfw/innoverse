import { Comment, CommentLike, CommentWithResponses, ObjectType } from '@/common/types';
import { CommentDB, CommentLikeDB } from '@/repository/db/utils/types';
import { getPromiseResults } from '@/utils/helpers';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';

export const mapToComments = async (comments: CommentDB[], currentUser?: string): Promise<Comment[]> => {
  const getComments = comments.map(async (comment) => {
    return await mapToComment(comment, currentUser);
  });
  return await getPromiseResults(getComments);
};

export const mapToComment = async (comment: CommentDB, currentUser?: string): Promise<Comment> => {
  const author = await getInnoUserByProviderId(comment.author);
  const getLikedBy = comment.likes.map(async (like) => await getInnoUserByProviderId(like.likedBy));
  const likedBy = await getPromiseResults(getLikedBy);
  const isLikedByUser = likedBy.some((user) => user.providerId === currentUser);

  return {
    id: comment.id,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    text: comment.text,
    author,
    objectId: comment.objectId,
    objectType: comment.objectType as ObjectType,
    likedBy: comment.likes.map((likes) => likes.likedBy),
    isLikedByUser,
    ...(comment.anonymous && { anonymous: comment.anonymous }),
    ...(comment.additionalObjectId && { additionalObjectId: comment.additionalObjectId }),
    ...(comment.additionalObjectType &&
      ({ additionalObjectType: comment.additionalObjectType } as { additionalObjectType: ObjectType })),
    ...(comment.parentId && { parentId: comment.parentId }),
    ...(comment.likes && { likes: mapLikes(comment.likes) }),
    commentCount: comment.responses.length,
  };
};

const mapLikes = (likes: CommentLikeDB[]): CommentLike[] => {
  return likes.map((like: CommentLikeDB) => ({
    ...like,
    commentId: like.commentId || '',
  }));
};
