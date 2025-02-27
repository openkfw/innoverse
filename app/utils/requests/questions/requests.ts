'use server';

import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapToQuestion } from '@/utils/requests/questions/mappings';
import { GetQuestionsByProjectIdQuery } from '@/utils/requests/questions/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

const logger = getLogger();

export async function getProjectQuestionsByProjectId(projectId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetQuestionsByProjectIdQuery, { projectId });
    const questions = response.questions.map((question) => mapToQuestion(question)) ?? [];
    return questions;
  } catch (err) {
    const error = strapiError('Getting all project questions', err as RequestError, projectId);
    logger.error(error);
  }
}
