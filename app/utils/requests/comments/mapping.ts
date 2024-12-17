import { Comment, Like, ObjectType } from '@/common/types';
import { CommentDB, LikeDB } from '@/repository/db/utils/types';
import { getFulfilledResults } from '@/utils/helpers';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';

export const mapToComment = async (comment: CommentDB): Promise<Comment> => {
  const author = await getInnoUserByProviderId(comment.author);
  const likedBy = await Promise.allSettled(
    comment.likes.map(async (like) => await getInnoUserByProviderId(like.likedBy)),
  ).then((results) => getFulfilledResults(results));

  return {
    id: comment.id,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    text: comment.text,
    author,
    objectId: comment.objectId,
    objectType: comment.objectType as ObjectType,
    likedBy,
    ...(comment.anonymous && { anonymous: comment.anonymous }),
    ...(comment.parentId && { parentId: comment.parentId }),
    ...(comment.likes && { likes: mapLikes(comment.likes) }),
    responseCount: comment.responses.length,
  };
};

const mapLikes = (likes: LikeDB[]): Like[] => {
  return likes.map((like: LikeDB) => ({
    ...like,
    objectType: like.objectType as ObjectType,
  }));
};
