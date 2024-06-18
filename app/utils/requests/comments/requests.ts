'use server';

import { CommentWithResponses, CommonCommentProps } from '@/common/types';
import { getNewsCommentsByUpdateId } from '@/repository/db/news_comment';
import { getNewsCommentsByPostId } from '@/repository/db/post_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { mapToNewsComment, mapToPostComment } from '@/utils/requests/comments/mapping';

export const getNewsCommentProjectUpdateId = async (updateId: string) => {
  const dbComments = await getNewsCommentsByUpdateId(dbClient, updateId);
  const mapComments = dbComments.map(mapToNewsComment);
  const comments = await Promise.all(mapComments);
  const commensWithResponses = setResponses(comments);
  return commensWithResponses;
};

export const getPostCommentByPostId = async (postId: string) => {
  const dbComments = await getNewsCommentsByPostId(dbClient, postId);
  const mapComments = dbComments.map(mapToPostComment);
  const comments = await Promise.all(mapComments);
  const commensWithResponses = setResponses(comments);
  return commensWithResponses;
};

const setResponses = (comments: CommonCommentProps[]) => {
  const rootComments: CommentWithResponses[] = comments
    .filter((comment) => !comment.parentId)
    .map((comment) => ({ ...comment, responses: [] }));

  let queue = rootComments;

  while (queue.length) {
    queue.forEach((comment) => {
      comment.responses = getResponsesForComment(comments, comment);
    });
    queue = queue.flatMap((comment) => comment.responses);
  }

  return rootComments;
};

const getResponsesForComment = (
  comments: CommonCommentProps[],
  rootComment: CommentWithResponses,
): CommentWithResponses[] => {
  return comments
    .filter((comment) => comment.parentId === rootComment.commentId)
    .map((response) => ({ ...response, responses: [] }));
};
