import { z } from 'zod';

export const handleCollaborationCommentSchema = z
  .object({
    projectId: z.string(),
    questionId: z.string(),
    comment: z.string(),
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
