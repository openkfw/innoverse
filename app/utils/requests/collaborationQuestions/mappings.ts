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
  return {
    id: questionData.documentId,
    authors: questionData.authors?.map(mapToUser) ?? [],
    comments: comments,
    description: questionData.description,
    isPlatformFeedback: questionData.isPlatformFeedback,
    title: questionData.title,
    updatedAt: toDate(questionData.updatedAt),
  };
};

export const mapToBasicCollaborationQuestion = (
  questionData: ResultOf<typeof CollaborationQuestionFragment>,
): BasicCollaborationQuestion => {
  return {
    id: questionData.documentId,
    authors: questionData?.authors?.map(mapToUser) ?? [],
    title: questionData.title,
    description: questionData.description,
    projectId: questionData.project?.documentId ?? '',
    updatedAt: questionData.updatedAt ? new Date(questionData.updatedAt) : new Date(),
  };
};
