import { BasicSurveyQuestion, SurveyQuestion, SurveyVote } from '@/common/types';

type SurveyQuestionData = {
  id: string;
  attributes: {
    question: string;
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
  surveyQuestionData: SurveyQuestionData,
  votes: SurveyVote[],
  userVote: SurveyVote | undefined,
): SurveyQuestion => {
  const attributes = surveyQuestionData.attributes;
  const responseOptions = attributes.responseOptions.filter((option) => option?.responseOption) as {
    responseOption: string;
  }[];
  return {
    id: surveyQuestionData.id,
    question: attributes.question,
    responseOptions: responseOptions,
    votes,
    userVote: userVote?.vote,
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
