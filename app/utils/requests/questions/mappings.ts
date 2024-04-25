import { ResultOf } from 'gql.tada';

import { ProjectQuestion } from '@/common/types';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

type ProjectQuestionData = {
  attributes: {
    authors: {
      data: ResultOf<typeof InnoUserFragment>[];
    } | null;
    title: string;
  };
  id: string;
};

export const mapToQuestion = (questionData: ProjectQuestionData): ProjectQuestion => {
  return {
    id: questionData.id,
    authors: questionData.attributes.authors?.data.map(mapToUser) ?? [],
    title: questionData.attributes.title,
  };
};
