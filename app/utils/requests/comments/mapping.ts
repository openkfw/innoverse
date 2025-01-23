import { CollaborationComment, CollaborationQuestion, Comment, CommentLike, ObjectType } from '@/common/types';
import { CommentDB, CommentLikeDB } from '@/repository/db/utils/types';
import { getFulfilledResults } from '@/utils/helpers';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';

export const mapToComment = async (comment: CommentDB, currentUser?: string): Promise<Comment> => {
  const author = await getInnoUserByProviderId(comment.author);
  const likedBy = await Promise.allSettled(
    comment.likes.map(async (like) => await getInnoUserByProviderId(like.likedBy)),
  ).then((results) => getFulfilledResults(results));
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

export const mapToCollborationComment = async (
  comment: CommentDB,
  question?: CollaborationQuestion,
): Promise<CollaborationComment> => {
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
    projectId: comment.objectId,
    likedBy,
    anonymous: comment.anonymous || false,
    question,
    projectName: question?.projectName || '',
    commentCount: comment.responses.length,
  };
};

export const mapToCollborationComments = async (
  comments: CommentDB[],
  question: CollaborationQuestion,
): Promise<CollaborationComment[]> => {
  return await Promise.allSettled(
    comments.map(async (comment) => await mapToCollborationComment(comment, question)),
  ).then((results) => getFulfilledResults(results));
};

const mapLikes = (likes: CommentLikeDB[]): CommentLike[] => {
  return likes.map((like: CommentLikeDB) => ({
    ...like,
    commentId: like.commentId || '',
  }));
};
