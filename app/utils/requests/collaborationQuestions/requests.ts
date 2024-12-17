'use server';

import { StatusCodes } from 'http-status-codes';

import { BasicCollaborationQuestion, ObjectType, StartPagination, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { isCommentLikedBy } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getProjectCollaborationComments } from '@/utils/requests/collaborationComments/requests';
import { mapToCollaborationQuestion } from '@/utils/requests/collaborationQuestions/mappings';
import {
  CollaborationQuestionFragment,
  GetCollaborationQuestionByIdQuery,
  GetCollaborationQuestionsByProjectIdQuery,
  GetCollaborationQuestionsCountProjectIdQuery,
  GetPlatformFeedbackCollaborationQuestion,
  GetCollaborationQuestsionsStartingFromQuery,
} from '@/utils/requests/collaborationQuestions/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

import { mapToBasicCollaborationQuestion } from './mappings';
import { ResultOf } from 'gql.tada';
import { ProjectFragment } from '../project/queries';

const logger = getLogger();

export async function getCollaborationQuestionsByProjectId(projectId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuestionsByProjectIdQuery, { projectId });
    const questionsData = response.collaborationQuestions?.nodes ?? [];

    const mapToEntities = questionsData.map(async (questionData) => {
      const getComments = await getProjectCollaborationComments({ projectId, questionId: questionData.documentId });
      const comments = getComments.data ?? [];

      const getCommentsWithLike = comments.map(async (comment) => {
        const { data: isLikedByUser } = await isCollaborationCommentLikedByUser({ commentId: comment.id });
        return { ...comment, isLikedByUser };
      });

      const commentsWithUserLike = await getPromiseResults(getCommentsWithLike);
      return mapToCollaborationQuestion(questionData, commentsWithUserLike);
    });

    const collaborationQuestions = await getPromiseResults(mapToEntities);
    return collaborationQuestions;
  } catch (err) {
    const error = strapiError('Getting all collaboration questions', err as RequestError, projectId);
    logger.error(error);
  }
}

export async function getBasicCollaborationQuestionById(id: string): Promise<BasicCollaborationQuestion | undefined> {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuestionByIdQuery, { documentId: id });
    const data = response.collaborationQuestion as ResultOf<typeof CollaborationQuestionFragment>;
    if (!data) throw new Error('Response contained no collaboration question data');
    const collaborationQuestion = mapToBasicCollaborationQuestion(data);
    return collaborationQuestion;
  } catch (err) {
    const error = strapiError('Getting basic collaboration question by id', err as RequestError, id);
    logger.error(error);
  }
}

export async function getBasicCollaborationQuestionByIdWithAdditionalData(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuestionByIdQuery, { documentId: id });
    const data = response.collaborationQuestion as ResultOf<typeof CollaborationQuestionFragment>;
    if (!data) throw new Error('Response contained no collaboration question data');
    const reactions = await getReactionsForEntity(dbClient, ObjectType.COLLABORATION_QUESTION, id);
    const collaborationQuestion = mapToBasicCollaborationQuestion(data);
    return { ...collaborationQuestion, reactions };
  } catch (err) {
    const error = strapiError(
      'Getting basic collaboration question by id with additional data',
      err as RequestError,
      id,
    );
    logger.error(error);
  }
}

export async function getBasicCollaborationQuestionStartingFromWithAdditionalData({
  from,
  page,
  pageSize,
}: StartPagination) {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuestsionsStartingFromQuery, { from, page, pageSize });
    const data = response.collaborationQuestions?.nodes;
    if (!data) throw new Error('Response contained no collaboration question data');

    const mapQuestions = data.map(async (questionData) => {
      const basicQuestion = mapToBasicCollaborationQuestion(questionData);
      const reactions = await getReactionsForEntity(
        dbClient,
        ObjectType.COLLABORATION_QUESTION,
        questionData.documentId,
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
  }
}

export async function getPlatformFeedbackCollaborationQuestion() {
  try {
    const response = await strapiGraphQLFetcher(GetPlatformFeedbackCollaborationQuestion);
    if (!response.collaborationQuestions?.nodes || !response.collaborationQuestions.nodes.length) return;
    const questionData = response.collaborationQuestions.nodes[0];
    if (!questionData.project) throw new Error('Collaboration question is not linked to a project');
    const project = questionData.project as ResultOf<typeof ProjectFragment>;

    const collaborationQuestion = {
      collaborationQuestionId: questionData.documentId,
      projectId: project.documentId,
    };

    return collaborationQuestion;
  } catch (err) {
    const error = strapiError('Getting platform feedback collaboration question', err as RequestError);
    logger.error(error);
  }
}

export const isCollaborationCommentLikedByUser = withAuth(async (user: UserSession, body: { commentId: string }) => {
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

export const countCollaborationQuestionsForProject = async (projectId: string) => {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuestionsCountProjectIdQuery, {
      projectId,
    });
    const countResult = response.collaborationQuestions?.pageInfo.total;

    return { status: StatusCodes.OK, data: countResult };
  } catch (err) {
    const error = strapiError('Error fetching collaboration questions count for project', err as RequestError);
    logger.error(error);
    throw err;
  }
};
