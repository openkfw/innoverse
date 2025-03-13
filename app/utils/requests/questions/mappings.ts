import { ResultOf } from 'gql.tada';

import { ProjectQuestion } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

type ProjectQuestionData = {
  authors: ResultOf<typeof InnoUserFragment>[] | null;
  title: string;
  updatedAt: string | Date | null;
  documentId: string;
};

export const mapToQuestion = (questionData: ProjectQuestionData): ProjectQuestion => {
  return {
    id: questionData.documentId,
    authors: questionData.authors?.map(mapToUser) ?? [],
    title: questionData.title,
    updatedAt: toDate(questionData.updatedAt),
  };
};
