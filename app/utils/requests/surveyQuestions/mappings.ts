import { ResultOf } from 'gql.tada';

import { BasicSurveyQuestion, SurveyQuestion, SurveyVote } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { SurveyQuestionFragment } from '@/utils/requests/surveyQuestions/queries';
import { ProjectFragment } from '../project/queries';

export const mapToSurveyQuestion = (
  surveyQuestionData: ResultOf<typeof SurveyQuestionFragment>,
  votes: SurveyVote[],
  userVote?: SurveyVote | undefined,
): SurveyQuestion => {
  const responseOptions = surveyQuestionData.responseOptions.filter((option) => option?.responseOption) as {
    responseOption: string;
  }[];
  const projectName = surveyQuestionData.project?.title;
  const projectId = surveyQuestionData.project?.documentId;
  return {
    id: surveyQuestionData.documentId,
    projectId: projectId ?? '',
    projectName: projectName ?? '',
    question: surveyQuestionData.question,
    responseOptions: responseOptions,
    votes,
    userVote: userVote?.vote,
    updatedAt: toDate(surveyQuestionData.updatedAt),
    createdAt: toDate(surveyQuestionData.createdAt),
  };
};

export const mapToBasicSurveyQuestion = (
  surveyQuestionData: ResultOf<typeof SurveyQuestionFragment>,
): BasicSurveyQuestion => {
  const project = surveyQuestionData.project as ResultOf<typeof ProjectFragment>;
  return {
    id: surveyQuestionData.documentId,
    question: surveyQuestionData.question,
    projectId: project.documentId,
    updatedAt: toDate(surveyQuestionData.updatedAt),
    createdAt: toDate(surveyQuestionData.createdAt),
  };
};
