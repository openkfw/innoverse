'use server';

import { StatusCodes } from 'http-status-codes';

import {
  BasicCollaborationQuestion,
  CollaborationQuestion,
  ObjectType,
  StartPagination,
  UserSession,
} from '@/common/types';
import { RequestError } from '@/entities/error';
import { isCommentLikedBy } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import {
  GetCollaborationQuesstionsStartingFromQuery,
  GetCollaborationQuestionByIdQuery,
  GetPlatformFeedbackCollaborationQuestion,
} from '@/utils/requests/collaborationQuestions/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

import { getCommentsByObjectIdWithResponses } from '../comments/requests';

import { mapToBasicCollaborationQuestion } from './mappings';

const logger = getLogger();

export async function getBasicCollaborationQuestionById(id: string): Promise<BasicCollaborationQuestion | undefined> {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuestionByIdQuery, { documentId: id });
    const data = response.collaborationQuestion;
    if (!data) throw new Error('Response contained no collaboration question data');
    const collaborationQuestion = mapToBasicCollaborationQuestion(data);
    return collaborationQuestion;
  } catch (err) {
    const error = strapiError('Getting basic collaboration question by id', err as RequestError, id);
    logger.error(error);
    throw err;
  }
}

export async function getBasicCollaborationQuestionByIdWithAdditionalData(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuestionByIdQuery, { documentId: id });
    const data = response.collaborationQuestion;
    if (!data) throw new Error('Response contained no collaboration question data');
    const reactions = await getReactionsForEntity(dbClient, ObjectType.COLLABORATION_QUESTION, id);
    const collaborationQuestion = mapToBasicCollaborationQuestion(data);
    if (!collaborationQuestion) throw new Error('Mapping collaboration question failed');

    return { ...collaborationQuestion, reactions };
  } catch (err) {
    const error = strapiError(
      'Getting basic collaboration question by id with additional data',
      err as RequestError,
      id,
    );
    logger.error(error);
    throw err;
  }
}

export async function getCollaborationQuestionStartingFromWithAdditionalData({
  from,
  page,
  pageSize,
}: StartPagination) {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuesstionsStartingFromQuery, { from, page, pageSize });
    const data = response.collaborationQuestions;
    if (!data) throw new Error('Response contained no collaboration question data');

    const mapQuestions = data.map(async (questionData) => {
      const basicQuestion = mapToBasicCollaborationQuestion(questionData);
      if (!basicQuestion) throw new Error('Mapping basic collaboration question failed');
      const reactions = await getReactionsForEntity(
        dbClient,
        ObjectType.COLLABORATION_QUESTION,
        questionData?.documentId,
      );
      return { ...basicQuestion, reactions };
    });

    const questions = await Promise.all(mapQuestions);
    return questions;
  } catch (err) {
    const error = strapiError(
      `Getting basic collaboration question starting from ${from.toISOString()} with additional data`,
      err as RequestError,
    );
    logger.error(error);
    throw err;
  }
}

export async function getPlatformFeedbackCollaborationQuestion() {
  try {
    const response = await strapiGraphQLFetcher(GetPlatformFeedbackCollaborationQuestion);
    if (!response.collaborationQuestions || !response.collaborationQuestions.length) return;
    const questionData = response.collaborationQuestions[0];
    if (!questionData.project) throw new Error('Collaboration question is not linked to a project');
    const project = questionData.project;

    const collaborationQuestion = {
      collaborationQuestionId: questionData.documentId,
      projectId: project.documentId,
    };

    return collaborationQuestion;
  } catch (err) {
    const error = strapiError('Getting platform feedback collaboration question', err as RequestError);
    logger.error(error);
    throw err;
  }
}

export const isCommentLikedByUser = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const isLikedBy = await isCommentLikedBy(dbClient, body.commentId, user.providerId);
    return { status: StatusCodes.OK, data: isLikedBy };
  } catch (err) {
    const error: InnoPlatformError = strapiError(
      `Find like for comment with id: ${body.commentId} by user ${user.providerId}`,
      err as RequestError,
      body.commentId,
    );
    logger.error(error);
    throw err;
  }
});

export async function getCollaborationQuestionsWithAdditionalData(collaborationQuestion: CollaborationQuestion[]) {
  const getAdditionalData = collaborationQuestion.map(getCollaborationQuestionWithAdditionalData);
  const collabQuestionsWithAdditionalData = await getPromiseResults(getAdditionalData);
  return collabQuestionsWithAdditionalData;
}

export async function getCollaborationQuestionWithAdditionalData(
  collaborationQuestion: CollaborationQuestion,
): Promise<CollaborationQuestion> {
  try {
    const { comments } = await getCommentsByObjectIdWithResponses(
      collaborationQuestion.id,
      ObjectType.COLLABORATION_QUESTION,
    );
    const getCommentsWithLike = comments.map(async (comment) => {
      const result = await isCommentLikedByUser({ commentId: comment.id });
      const isLikedByUser = result.status === StatusCodes.OK && result.data;
      return { ...comment, isLikedByUser };
    });
    const commentsWithUserLike = await getPromiseResults(getCommentsWithLike);
    return { ...collaborationQuestion, comments: commentsWithUserLike };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting additional data for collaboration question with id: ${collaborationQuestion.id}`,
      err as Error,
      collaborationQuestion.id,
    );
    logger.error(error);
    throw err;
  }
}
