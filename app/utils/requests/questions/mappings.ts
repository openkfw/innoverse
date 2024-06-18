import { ResultOf } from 'gql.tada';

import { ProjectQuestion } from '@/common/types';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';
import { toDate } from '@/utils/helpers';

type ProjectQuestionData = {
  attributes: {
    authors: {
      data: ResultOf<typeof InnoUserFragment>[];
    } | null;
    title: string;
    updatedAt: string | Date | null;
  };
  id: string;
};

export const mapToQuestion = (questionData: ProjectQuestionData): ProjectQuestion => {
  return {
    id: questionData.id,
    authors: questionData.attributes.authors?.data.map(mapToUser) ?? [],
    title: questionData.attributes.title,
    updatedAt: toDate(questionData.attributes.updatedAt),
  };
};
