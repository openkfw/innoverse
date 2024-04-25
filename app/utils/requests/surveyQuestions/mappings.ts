import { SurveyQuestion, SurveyVote } from '@/common/types';

type SurveyQuestionData = {
  attributes: {
    responseOptions: ({
      responseOption: string;
    } | null)[];
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
