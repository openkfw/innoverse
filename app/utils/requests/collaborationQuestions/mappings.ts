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
  const attributes = questionData.attributes;
  const question = {
    id: questionData.id,
    authors: attributes.authors?.data.map(mapToUser) ?? [],
    description: attributes.description,
    isPlatformFeedback: attributes.isPlatformFeedback,
    title: attributes.title,
    updatedAt: toDate(attributes.updatedAt),
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
  const attributes = questionData.attributes;
  return {
    id: questionData.id,
    authors: attributes.authors?.data.map(mapToUser) ?? [],
    title: attributes.title,
    description: attributes.description,
    projectId: attributes.project?.data?.id ?? '',
    updatedAt: attributes.updatedAt ? new Date(attributes.updatedAt) : new Date(),
  };
};
