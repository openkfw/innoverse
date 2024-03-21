import { z } from 'zod';

export const getCollaborationCommentsSchema = z
  .object({
    projectId: z.string(),
    questionId: z.string(),
  })
  .required();

export const addCollaborationCommentSchema = z
  .object({
    projectId: z.string(),
    questionId: z.string(),
    comment: z.string().min(1),
  })
  .required();

export const deleteCollaborationCommentSchema = z
  .object({
    commentId: z.string(),
  })
  .required();

export const updateCollaborationCommentSchema = z
  .object({
    commentId: z.string(),
    updatedText: z.string(),
  })
  .required();

export const collaborationCommentUpvotedBySchema = z
  .object({
    commentId: z.string(),
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

export const addCollaborationCommentResponseSchema = z
  .object({
    comment: z
      .object({
        id: z.string(),
      })
      .required(),
    response: z.string(),
  })
  .required();

export const deleteCollaborationCommentResponseSchema = z
  .object({
    responseId: z.string(),
  })
  .required();

export const updateCollaborationCommentResponseSchema = z
  .object({
    responseId: z.string(),
    updatedText: z.string(),
  })
  .required();

export const collaborationCommentResponseUpvotedBySchema = z
  .object({
    responseId: z.string(),
  })
  .required();
