import { CollaborationComment, CollaborationQuestion, Comment, CommentLike, ObjectType } from '@/common/types';
import { CommentDB, CommentLikeDB } from '@/repository/db/utils/types';
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
    ...(comment.additionalObjectId && { additionalObjectId: comment.additionalObjectId }),
    ...(comment.additionalObjectType &&
      ({ additionalObjectType: comment.additionalObjectType } as { additionalObjectType: ObjectType })),

    ...(comment.parentId && { parentId: comment.parentId }),
    ...(comment.likes && { likes: mapLikes(comment.likes) }),
    responseCount: comment.responses.length,
  };
};

export const mapToComments = async (comments: CommentDB[]): Promise<Comment[]> => {
  return await Promise.allSettled(comments.map(async (comment) => await mapToComment(comment))).then((results) =>
    getFulfilledResults(results),
  );
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
    responseCount: comment.responses.length,
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
