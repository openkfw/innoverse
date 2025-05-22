import { ObjectType, Reaction, User } from '@/common/types';
import dbClient from '@/repository/db/prisma/prisma';
import { addReactionToDb, removeReactionFromDb } from '@/repository/db/reaction';
import { getNewsFeedEntryForCollaborationQuestion } from '@/services/collaborationQuestionService';
import { getNewsFeedEntryForProjectEvent } from '@/services/eventService';
import { getNewsFeedEntryForPost } from '@/services/postService';
import { getNewsFeedEntryForProjectUpdate } from '@/services/updateService';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { RedisReaction } from '@/utils/newsFeed/redis/models';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';

import { redisError } from '../utils/errors';

import { getNewsFeedEntryForProject } from './projectService';
import { getNewsFeedEntryForSurveyQuestion } from './surveyQuestionService';

const logger = getLogger();

type AddReaction = {
  user: User;
  reaction: {
    reactedBy: string;
    shortCode: string;
    nativeSymbol: string;
    objectId: string;
    objectType: ObjectType;
  };
};

type RemoveReaction = {
  user: User;
  reaction: {
    reactedBy: string;
    objectId: string;
    objectType: ObjectType;
  };
};

export const addReaction = async ({ user, reaction }: AddReaction) => {
  try {
    const createdReaction = await addReactionToDb(
      dbClient,
      reaction.reactedBy,
      reaction.objectType,
      reaction.objectId,
      reaction.shortCode,
      reaction.nativeSymbol,
    );
    addReactionToCache({ ...createdReaction, objectType: createdReaction.objectType as ObjectType }, user);
    return createdReaction;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Adding Reaction by user ${reaction.reactedBy} on type ${reaction.objectType} with id: ${reaction.objectId}`,
      err as Error,
      reaction.objectId,
    );
    logger.error(error);
    throw err;
  }
};

export const removeReaction = async ({ user, reaction }: RemoveReaction) => {
  try {
    const removedReaction = await removeReactionFromDb(
      dbClient,
      reaction.reactedBy,
      reaction.objectType,
      reaction.objectId,
    );
    removeReactionFromCache({
      reaction: { ...removedReaction, objectType: removedReaction.objectType as ObjectType },
      user,
    });
    return removedReaction;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Remove Reaction by user ${reaction.reactedBy} on type ${reaction.objectType} with id: ${reaction.objectId}`,
      err as Error,
      reaction.objectId,
    );
    logger.error(error);
    throw err;
  }
};

export const addReactionToCache = async (reaction: Reaction, user: User) => {
  try {
    const redisClient = await getRedisClient();
    const newsFeedEntry = await getItemForEntityWithReactions(reaction, user);

    if (!newsFeedEntry) {
      return;
    }

    const updatedReactions = newsFeedEntry.item.reactions.filter((r: RedisReaction) => r.reactedBy !== user.providerId);
    updatedReactions.push(reaction);
    newsFeedEntry.item.reactions = updatedReactions;
    await saveNewsFeedEntry(redisClient, newsFeedEntry);
  } catch (err) {
    const error: InnoPlatformError = redisError(`Adding reaction to cache by user ${user.providerId}`, err as Error);
    logger.error(error);
    throw err;
  }
};

export const removeReactionFromCache = async ({ reaction, user }: RemoveReaction) => {
  try {
    const redisClient = await getRedisClient();
    const newsFeedEntry = await getItemForEntityWithReactions(reaction, user);

    if (!newsFeedEntry) {
      return;
    }

    const updatedReactions = newsFeedEntry.item.reactions.filter((r: RedisReaction) => r.reactedBy !== user.providerId);
    newsFeedEntry.item.reactions = updatedReactions;
    await saveNewsFeedEntry(redisClient, newsFeedEntry);
  } catch (err) {
    const error: InnoPlatformError = redisError(`Removing reaction to cache by user ${user.providerId}`, err as Error);
    logger.error(error);
    throw err;
  }
};

export const getItemForEntityWithReactions = async (
  reaction: { objectId: string; objectType: ObjectType },
  user: User,
) => {
  const redisClient = await getRedisClient();
  switch (reaction.objectType) {
    case ObjectType.EVENT:
      return await getNewsFeedEntryForProjectEvent(redisClient, reaction.objectId);
    case ObjectType.UPDATE:
      return await getNewsFeedEntryForProjectUpdate(redisClient, reaction.objectId);
    case ObjectType.COLLABORATION_QUESTION:
      return await getNewsFeedEntryForCollaborationQuestion(redisClient, reaction.objectId);
    case ObjectType.POST:
      return await getNewsFeedEntryForPost(redisClient, { user, postId: reaction.objectId });
    case ObjectType.PROJECT:
      return await getNewsFeedEntryForProject(redisClient, { projectId: reaction.objectId });
    case ObjectType.SURVEY_QUESTION:
      return await getNewsFeedEntryForSurveyQuestion(redisClient, { surveyId: reaction.objectId });
    default:
      logger.warn(`Could not add reaction to news feed cache: Unknown object type '${reaction.objectType}'`);
      return null;
  }
};
