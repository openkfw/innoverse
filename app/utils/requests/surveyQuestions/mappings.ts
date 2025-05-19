import { ResultOf } from 'gql.tada';

import { BasicSurveyQuestion, ObjectType, SurveyQuestion, SurveyVote } from '@/common/types';
import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import { toDate } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { SurveyQuestionFragment } from '@/utils/requests/surveyQuestions/queries';

const logger = getLogger();

export const mapToBasicSurveyQuestions = (
  surveyQuestions: ResultOf<typeof SurveyQuestionFragment>[] | undefined,
): BasicSurveyQuestion[] => {
  const mappedSurveyQuestions = surveyQuestions?.map(mapToBasicSurveyQuestion) ?? [];
  return mappedSurveyQuestions.filter((e) => e !== undefined) as BasicSurveyQuestion[];
};

export const mapToSurveyQuestion = (
  surveyQuestionData: ResultOf<typeof SurveyQuestionFragment>,
  votes: SurveyVote[],
  userVote?: SurveyVote | undefined,
): SurveyQuestion | undefined => {
  try {
    const responseOptions = surveyQuestionData.responseOptions.filter((option) => option?.responseOption) as {
      responseOption: string;
    }[];
    const project = surveyQuestionData.project;
    if (!project) {
      throw new Error('Survey question contained no project data');
    }
    return {
      id: surveyQuestionData.documentId,
      projectId: project.documentId,
      projectName: project.title,
      question: surveyQuestionData.question,
      responseOptions: responseOptions,
      updatedAt: toDate(surveyQuestionData.updatedAt),
      createdAt: toDate(surveyQuestionData.createdAt),
      objectType: ObjectType.SURVEY_QUESTION,
    };
  } catch (err) {
    const error = strapiError('Mapping survey question', err as RequestError, surveyQuestionData.documentId);
    logger.error(error);
  }
};

export const mapToBasicSurveyQuestion = (
  surveyQuestionData: ResultOf<typeof SurveyQuestionFragment>,
): BasicSurveyQuestion | undefined => {
  const project = surveyQuestionData.project;
  try {
    if (!project) {
      throw new Error('Basic survey question contained no project data');
    }
    return {
      id: surveyQuestionData.documentId,
      question: surveyQuestionData.question,
      projectId: project.documentId,
      projectName: project.title,
      updatedAt: toDate(surveyQuestionData.updatedAt),
      createdAt: toDate(surveyQuestionData.createdAt),
      objectType: ObjectType.SURVEY_QUESTION,
    };
  } catch (err) {
    const error = strapiError('Mapping basic survey question', err as RequestError, surveyQuestionData.documentId);
    logger.error(error);
  }
};
