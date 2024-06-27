import { ResultOf } from 'gql.tada';

import { BasicSurveyQuestion, SurveyQuestion, SurveyVote } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { SurveyQuestionFragment } from '@/utils/requests/surveyQuestions/queries';

export const mapToSurveyQuestion = (
  surveyQuestionData: ResultOf<typeof SurveyQuestionFragment>,
  votes: SurveyVote[],
  userVote?: SurveyVote | undefined,
): SurveyQuestion => {
  const attributes = surveyQuestionData.attributes;
  const responseOptions = attributes.responseOptions.filter((option) => option?.responseOption) as {
    responseOption: string;
  }[];
  const projectName = attributes.project?.data?.attributes.title;
  const projectId = attributes.project?.data?.id;
  return {
    id: surveyQuestionData.id,
    projectId: projectId ?? '',
    projectName: projectName ?? '',
    question: attributes.question,
    responseOptions: responseOptions,
    votes,
    userVote: userVote?.vote,
    updatedAt: toDate(attributes.updatedAt),
    createdAt: toDate(attributes.createdAt),
  };
};

export const mapToBasicSurveyQuestion = (
  surveyQuestionData: ResultOf<typeof SurveyQuestionFragment>,
): BasicSurveyQuestion => {
  const attributes = surveyQuestionData.attributes;

  return {
    id: surveyQuestionData.id,
    question: attributes.question,
    projectId: attributes.project?.data?.id,
    updatedAt: toDate(attributes.updatedAt),
    createdAt: toDate(attributes.createdAt),
  };
};
