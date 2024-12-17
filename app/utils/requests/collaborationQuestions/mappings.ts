import { ResultOf } from 'gql.tada';

import { BasicCollaborationQuestion, CollaborationQuestion } from '@/common/types';
import { CommentDB } from '@/repository/db/utils/types';
import { toDate } from '@/utils/helpers';
import { CollaborationQuestionFragment } from '@/utils/requests/collaborationQuestions/queries';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';

import { mapToCollborationComments } from '../comments/mapping';

export const mapToCollaborationQuestion = async (
  questionData: ResultOf<typeof CollaborationQuestionFragment>,
  dbComments: CommentDB[],
): Promise<CollaborationQuestion> => {
  const question = {
    id: questionData.documentId,
    authors: questionData.authors?.map(mapToUser) ?? [],
    description: questionData.description,
    isPlatformFeedback: questionData.isPlatformFeedback,
    title: questionData.title,
    updatedAt: toDate(questionData.updatedAt),
    comments: [],
  };
  const comments = await mapToCollborationComments(dbComments, question);
  return {
    ...question,
    comments,
  };
};

export const mapToBasicCollaborationQuestion = (
  questionData: ResultOf<typeof CollaborationQuestionFragment>,
): BasicCollaborationQuestion => {
  return {
    id: questionData.documentId,
    authors: questionData.authors?.map(mapToUser) ?? [],
    title: questionData.title,
    description: questionData.description,
    projectId: questionData.project?.documentId ?? '',
    projectName: questionData.project?.title ?? '',
    updatedAt: questionData.updatedAt ? new Date(questionData.updatedAt) : new Date(),
  };
};
