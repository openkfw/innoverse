import { ResultOf } from 'gql.tada';

import { BasicCollaborationQuestion, CollaborationQuestion } from '@/common/types';
import { Comment } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { CollaborationQuestionFragment } from '@/utils/requests/collaborationQuestions/queries';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';

export const mapToCollaborationQuestion = (
  questionData: ResultOf<typeof CollaborationQuestionFragment>,
  comments: Comment[],
): CollaborationQuestion => {
  const attributes = questionData.attributes;
  return {
    id: questionData.id,
    authors: attributes.authors?.data.map(mapToUser) ?? [],
    comments: comments,
    description: attributes.description,
    isPlatformFeedback: attributes.isPlatformFeedback,
    title: attributes.title,
    updatedAt: toDate(attributes.updatedAt),
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
