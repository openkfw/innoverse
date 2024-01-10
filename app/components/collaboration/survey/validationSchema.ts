import { z } from 'zod';

export const voteSchema = z
  .object({
    surveyQuestionId: z.string(),
  })
  .required();

export const handleSurveyVoteSchema = z
  .object({
    projectId: z.string(),
    surveyQuestionId: z.string(),
    vote: z.string(),
  })
  .required();
