import { ResultOf } from 'gql.tada';

import { ObjectType, ProjectQuestion } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';
import { ProjectQuestionFragment } from './queries';

type ProjectQuestionData = {
  authors: ResultOf<typeof InnoUserFragment>[] | null;
  title: string;
  updatedAt: string | Date | null;
  documentId: string;
};

export const mapToProjectQuestions = (
  surveyQuestions: ResultOf<typeof ProjectQuestionFragment>[],
): ProjectQuestion[] => {
  const mappedCollaborationQuestions = surveyQuestions?.map(mapToProjectQuestion) ?? [];
  return mappedCollaborationQuestions.filter((e) => e !== undefined);
};

export const mapToProjectQuestion = (questionData: ProjectQuestionData): ProjectQuestion => {
  return {
    id: questionData.documentId,
    projectId: questionData.documentId,
    projectName: questionData.documentId,
    authors: questionData.authors?.map(mapToUser) ?? [],
    title: questionData.title,
    updatedAt: toDate(questionData.updatedAt),
    createdAt: toDate(questionData.updatedAt),
    objectType: ObjectType.PROJECT_QUESTION,
  };
};
