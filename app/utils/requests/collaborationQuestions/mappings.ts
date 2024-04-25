import { ResultOf } from 'gql.tada';

import { CollaborationQuestion } from '@/common/types';
import { Comment } from '@/common/types';
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
  };
};
