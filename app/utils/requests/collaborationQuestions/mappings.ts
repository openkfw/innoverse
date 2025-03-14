import { ResultOf } from 'gql.tada';

import { BasicCollaborationQuestion, CollaborationQuestion } from '@/common/types';
import { RequestError } from '@/entities/error';
import { CommentDB } from '@/repository/db/utils/types';
import { strapiError } from '@/utils/errors';
import { toDate } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { CollaborationQuestionFragment } from '@/utils/requests/collaborationQuestions/queries';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';

import { mapToCollaborationComments } from '../comments/mapping';

const logger = getLogger();

export const mapToCollaborationQuestion = async (
  questionData: ResultOf<typeof CollaborationQuestionFragment>,
  dbComments: CommentDB[],
): Promise<CollaborationQuestion | undefined> => {
  try {
    const project = questionData.project;
    if (!project) {
      throw new Error('Collaboration question contained no project data');
    }
    const question = {
      id: questionData.documentId,
      projectId: project.documentId,
      projectName: project.title,
      authors: questionData.authors?.map(mapToUser) ?? [],
      description: questionData.description,
      isPlatformFeedback: questionData.isPlatformFeedback,
      title: questionData.title,
      updatedAt: toDate(questionData.updatedAt),
      comments: [],
    };
    const comments = await mapToCollaborationComments(dbComments, question);
    return {
      ...question,
      comments,
    };
  } catch (err) {
    const error = strapiError('Mapping collaboration question', err as RequestError, questionData.documentId);
    logger.error(error);
  }
};

export const mapToBasicCollaborationQuestion = (
  questionData: ResultOf<typeof CollaborationQuestionFragment>,
): BasicCollaborationQuestion | undefined => {
  try {
    const project = questionData.project;
    if (!project) {
      throw new Error('Basic collaboration question contained no project data');
    }
    return {
      id: questionData.documentId,
      authors: questionData.authors?.map(mapToUser) ?? [],
      title: questionData.title,
      description: questionData.description,
      projectId: project.documentId,
      projectName: project.title,
      updatedAt: questionData.updatedAt ? new Date(questionData.updatedAt) : new Date(),
    };
  } catch (err) {
    const error = strapiError('Mapping basic collaboration question', err as RequestError, questionData.documentId);
    logger.error(error);
  }
};
