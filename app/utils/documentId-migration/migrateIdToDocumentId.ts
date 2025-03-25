import { ObjectType } from '@/common/types';
import { updateCommentObjectId } from '@/repository/db/comment';
import { updateFollowObjectId } from '@/repository/db/follow';
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

const isMigrationApplied = (migrationApplied: (boolean | undefined)[]) => {
  return migrationApplied.some((applied) => applied);
};

async function migrateCollection(
  items: {
    documentId: string;
    id: string;
  }[],
  objectType: ObjectType,
) {
  return isMigrationApplied(
    await Promise.all(items.map(async (item) => await migrateIdToDocumentId(item, objectType))),
  );
}

const migrate = async () => {
  const response = await strapiGraphQLFetcher(GetCollectionsIds, { limit: 1000 });
  const { updates, events, surveyQuestions, projects, collaborationQuestions } = response;
  // Migrate Updates
  const migratedUpdates = await migrateCollection(updates, ObjectType.UPDATE);
  // Migrate Events
  const migratedEvents = await migrateCollection(events, ObjectType.EVENT);
  // Migrate Projects
  const migratedProjects = await migrateCollection(projects, ObjectType.PROJECT);
  // Migrate Collaboration questions
  const migratedCollaborationQuestions = await migrateCollection(
    collaborationQuestions,
    ObjectType.COLLABORATION_QUESTION,
  );
  // Migrate Survey questions
  const migratedSurveyQuestions = await migrateCollection(surveyQuestions, ObjectType.SURVEY_QUESTION);

  if (
    migratedUpdates ||
    migratedEvents ||
    migratedProjects ||
    migratedSurveyQuestions ||
    migratedCollaborationQuestions
  ) {
    return true;
  }
  return false;
};

export const migrateIdsToDocumentIds = async () => {
  logger.info('Starting migration of object ids to document ids');
  const migrationApplied = await migrate();
  logger.info('Ending migration of object ids to document ids');
  // Synchronize the news feed cache after the migration
  if (migrationApplied) {
    await synchronizeNewsFeed(0, true);
  }
};

const migrateIdToDocumentId = async (item: { documentId: string; id: string }, objectType: ObjectType) => {
  try {
    let migrationApplied = false;
    const updatedReactions = await updateReactionsId(dbClient, item.id, item.documentId, objectType);
    if (updatedReactions.count > 0) {
      migrationApplied = true;
      logger.info(
        `Successfully updated reactions with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
      );
    }

    const updatedComments = await updateCommentObjectId(dbClient, item.id, item.documentId, objectType);
    if (updatedComments.count > 0) {
      migrationApplied = true;
      logger.info(
        `Successfully updated comments with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
      );
    }

    const updatedFollows = await updateFollowObjectId(dbClient, item.id, item.documentId, objectType);
    if (updatedFollows.count > 0) {
      migrationApplied = true;
      logger.info(
        `Successfully updated follows with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
      );
    }

    const updatedObjectLikes = await updateLikesIds(dbClient, item.id, item.documentId, objectType);
    if (updatedObjectLikes.count > 0) {
      migrationApplied = true;
      logger.info(
        `Successfully updated likes with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
      );
    }

    // Survey Votes exist only for the projects
    if (objectType === ObjectType.PROJECT) {
      const updateSurveyVotes = await updateSurveyVotesIds(dbClient, item.id, item.documentId);
      if (updateSurveyVotes.count > 0) {
        migrationApplied = true;
        logger.info(
          `Successfully updated survey votes with object id: ${item.id} to documentId: ${item.documentId} of type ${objectType}`,
        );
      }
    }
    return migrationApplied;
  } catch (err) {
    logger.error(`Failed to update records with object id: ${item.id}`, err);
  }
};
