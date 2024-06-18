import { BasicSurveyQuestion, SurveyQuestion, SurveyVote } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { ResultOf } from 'gql.tada';
import { SurveyQuestionFragment } from '@/utils/requests/surveyQuestions/queries';

type SurveyQuestionData = {
  id: string;
  attributes: {
    question: string;
    updatedAt: string | Date | null;
    responseOptions: ({
      responseOption: string;
    } | null)[];
  };
};

type BasicSurveyQuestionData = {
  attributes: {
    project: {
      data: {
        id: string;
      } | null;
    } | null;
    question: string;
  };
  id: string;
};

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
  };
};

export const mapToBasicSurveyQuestion = (surveyQuestionData: BasicSurveyQuestionData): BasicSurveyQuestion => {
  const attributes = surveyQuestionData.attributes;

  return {
    id: surveyQuestionData.id,
    question: attributes.question,
    projectId: attributes.project?.data?.id,
  };
};
