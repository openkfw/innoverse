import { ResultOf } from 'gql.tada';

import { BasicCollaborationQuestion, CollaborationQuestion, CommentWithResponses, ObjectType } from '@/common/types';
import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import { toDate } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { CollaborationQuestionFragment } from '@/utils/requests/collaborationQuestions/queries';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';

const logger = getLogger();

export const mapToCollaborationQuestions = (
  opportunities: ResultOf<typeof CollaborationQuestionFragment>[],
): CollaborationQuestion[] => {
  const mappedCollaborationQuestions = opportunities?.map(mapToCollaborationQuestion) ?? [];
  return mappedCollaborationQuestions.filter((e) => e !== undefined) as CollaborationQuestion[];
};

export const mapToCollaborationQuestion = (
  questionData: ResultOf<typeof CollaborationQuestionFragment>,
): CollaborationQuestion | undefined => {
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
    };
    return {
      ...question,
      objectType: ObjectType.COLLABORATION_QUESTION,
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
