'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { getCollaborationCommentIsUpvotedBy } from '@/repository/db/collaboration_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getProjectCollaborationComments } from '@/utils/requests/collaborationComments/requests';
import {
  mapToBasicCollaborationQuestion,
  mapToCollaborationQuestion,
} from '@/utils/requests/collaborationQuestions/mappings';
import {
  GetCollaborationQuestionByIdQuery,
  GetCollaborationQuestionsByProjectIdQuery,
  GetPlatformFeedbackCollaborationQuestion,
} from '@/utils/requests/collaborationQuestions/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

const logger = getLogger();

export async function getBasicCollaborationQuestionById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuestionByIdQuery, { id });
    const data = response.collaborationQuestion?.data;
    if (!data) throw new Error('Response contained no collaboration question data');
    const collaborationQuestion = mapToBasicCollaborationQuestion(data);
    return collaborationQuestion;
  } catch (err) {
    const error = strapiError('Getting basic collaboration question by id', err as Error, id);
    logger.error(error);
  }
}

export async function getCollaborationQuestionsByProjectId(projectId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetCollaborationQuestionsByProjectIdQuery, { projectId });
    const questionsData = response.collaborationQuestions?.data ?? [];

    const mapToEntities = questionsData.map(async (questionData) => {
      const getComments = await getProjectCollaborationComments({ projectId, questionId: questionData.id });
      const comments = getComments.data ?? [];

      const getCommentsWithUpvote = comments.map(async (comment) => {
        const { data: isUpvotedByUser } = await isCollaborationCommentUpvotedByUser({ commentId: comment.id });
        return { ...comment, isUpvotedByUser };
      });

      const commentsWithUserUpvote = await getPromiseResults(getCommentsWithUpvote);
      return mapToCollaborationQuestion(questionData, commentsWithUserUpvote);
    });

    const collaborationQuestions = await getPromiseResults(mapToEntities);
    return collaborationQuestions;
  } catch (err) {
    const error = strapiError('Getting all collaboration questions', err as Error, projectId);
    logger.error(error);
  }
}

export async function getPlatformFeedbackCollaborationQuestion() {
  try {
    const response = await strapiGraphQLFetcher(GetPlatformFeedbackCollaborationQuestion);
    if (!response.collaborationQuestions?.data || !response.collaborationQuestions.data.length)
      throw new Error('Response contained no collaboration questions');

    const questionData = response.collaborationQuestions.data[0];
    if (!questionData.attributes.project?.data) throw new Error('Collaboration question is not linked to a project');

    const collaborationQuestion = {
      collaborationQuestionId: questionData.id,
      projectId: questionData.attributes.project.data.id,
    };

    return collaborationQuestion;
  } catch (err) {
    const error = strapiError('Getting platform feedback collaboration question', err as Error);
    logger.error(error);
  }
}

export const isCollaborationCommentUpvotedByUser = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const isUpvotedBy = await getCollaborationCommentIsUpvotedBy(dbClient, body.commentId, user.providerId);
    return { status: StatusCodes.OK, data: isUpvotedBy };
  } catch (err) {
    const error: InnoPlatformError = strapiError(
      `Find upvote for comment${body.commentId} by user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    throw err;
  }
});
