import { z } from 'zod';

export const handleCollaborationCommentSchema = z
  .object({
    projectId: z.string(),
    questionId: z.string(),
    comment: z.string().min(1),
  })
  .required();

export const getCollaborationCommentResponsesSchema = z
  .object({
    comment: z
      .object({
        id: z.string(),
      })
      .required(),
  })
  .required();

export const handleCollaborationCommentResponseSchema = z
  .object({
    comment: z
      .object({
        id: z.string(),
      })
      .required(),
    response: z.string(),
  })
  .required();

export const getCollaborationCommentsSchema = z
  .object({
    projectId: z.string(),
    questionId: z.string(),
  })
  .required();

export const collaborationCommentUpvotedBySchema = z
  .object({
    commentId: z.string(),
  })
  .required();

export const collaborationCommentResponseUpvotedBySchema = z
  .object({
    commentId: z.string(),
  })
  .required();
