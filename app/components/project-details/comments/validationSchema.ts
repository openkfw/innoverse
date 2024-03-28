import { z } from 'zod';

export const handleCommentSchema = z
  .object({
    projectId: z.string(),
    comment: z.string(),
  })
  .required();

export const getCommentsSchema = z
  .object({
    projectId: z.string(),
  })
  .required();

export const commentUpvotedBySchema = z
  .object({
    commentId: z.string(),
  })
  .required();

export const updateCommentSchema = z
  .object({
    commentId: z.string(),
    updatedText: z.string(),
  })
  .required();

export const deleteCommentSchema = z
  .object({
    commentId: z.string(),
  })
  .required();
