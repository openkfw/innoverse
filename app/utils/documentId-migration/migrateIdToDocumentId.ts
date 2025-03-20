import { ObjectType } from '@/common/types';
import { updateCommentsId } from '@/repository/db/comment';
import { updateFollowsId } from '@/repository/db/follow';
import { updateLikesIds } from '@/repository/db/like';
import dbClient from '@/repository/db/prisma/prisma';
import { updateReactionsId } from '@/repository/db/reaction';
import { updateSurveyVotesIds } from '@/repository/db/survey_votes';
import { graphql } from '@/types/graphql';
import { sync as synchronizeNewsFeed } from '@/utils/newsFeed/newsFeedSync';

import getLogger from '../logger';
import strapiGraphQLFetcher from '../requests/strapiGraphQLFetcher';

const logger = getLogger();

export const GetCollectionsIds = graphql(`
  query GetCollectionsIds($limit: Int) {
    updates(pagination: { limit: $limit }) {
      documentId
      id
    }
    events(pagination: { limit: $limit }) {
      documentId
      id
    }
    surveyQuestions(pagination: { limit: $limit }) {
      documentId
      id
    }
    projects(pagination: { limit: $limit }) {
      documentId
      id
    }
    collaborationQuestions(pagination: { limit: $limit }) {
      documentId
      id
    }
  }
`);

const migrate = async () => {
  const response = await strapiGraphQLFetcher(GetCollectionsIds, { limit: 1000 });
  const { updates, events, surveyQuestions, projects, collaborationQuestions } = response;
  // Migrate Updates
  updates.map(async (item) => {
    await migrateIdToDocumentId(item, ObjectType.UPDATE);
  });

  // Migrate Events
  events.map(async (item) => {
    await migrateIdToDocumentId(item, ObjectType.EVENT);
  });

  // Migrate Projects
  projects.map(async (item) => {
    await migrateIdToDocumentId(item, ObjectType.PROJECT);
  });

  // Migrate Collaboration questions
  collaborationQuestions.map(async (item) => {
    await migrateIdToDocumentId(item, ObjectType.COLLABORATION_QUESTION);
  });

  // Migrate Survey questions
  surveyQuestions.map(async (item) => {
    await migrateIdToDocumentId(item, ObjectType.SURVEY_QUESTION);
  });
};

export const migrateIdsToDocumentIds = async () => {
  logger.info('Starting migration of object ids to document ids');
  await migrate();
  logger.info('Ending migration of object ids to document ids');
  // Synchronize the news feed cache after the migration
  await synchronizeNewsFeed(0, true);
};

const migrateIdToDocumentId = async (item: { documentId: string; id: string }, objectType: ObjectType) => {
  try {
    const updatedReactions = await updateReactionsId(dbClient, item.id, item.documentId, objectType);
    if (updatedReactions.count > 0) {
      logger.info(
        `Successfully updated reactions with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
      );
    }

    const updatedComments = await updateCommentsId(dbClient, item.id, item.documentId, objectType);
    if (updatedComments.count > 0) {
      logger.info(
        `Successfully updated comments with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
      );
    }

    const updatedFollows = await updateFollowsId(dbClient, item.id, item.documentId, objectType);
    if (updatedFollows.count > 0) {
      logger.info(
        `Successfully updated follows with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
      );
    }

    const updatedObjectLikes = await updateLikesIds(dbClient, item.id, item.documentId, objectType);
    if (updatedObjectLikes.count > 0) {
      logger.info(
        `Successfully updated likes with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
      );
    }

    // Survey Votes exist only for the projects
    if (objectType === ObjectType.PROJECT) {
      const updateSurveyVotes = await updateSurveyVotesIds(dbClient, item.id, item.documentId);
      if (updateSurveyVotes.count > 0) {
        logger.info(
          `Successfully updated survey votes with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
        );
      }
    }
  } catch (err) {
    logger.error(`Failed to update records with object id: ${item.id}`, err);
  }
};
