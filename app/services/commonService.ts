import { ObjectType, User } from '@/common/types';
import { getFollowedByForEntity } from '@/repository/db/follow';
import { countNewsResponses } from '@/repository/db/news_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { createNewsFeedEntryForComment } from '@/services/collaborationCommentService';
import getLogger from '@/utils/logger';
import {
  mapCollaborationQuestionToRedisNewsFeedEntry,
  mapProjectToRedisNewsFeedEntry,
  mapSurveyQuestionToRedisNewsFeedEntry,
} from '@/utils/newsFeed/redis/mappings';
import {
  mapEventToRedisNewsFeedEntry,
  mapToRedisUsers,
  mapUpdateToRedisNewsFeedEntry,
} from '@/utils/newsFeed/redis/mappings';
import { RedisNewsFeedEntry } from '@/utils/newsFeed/redis/models';
import { RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { getNewsFeedEntryByKey } from '@/utils/newsFeed/redis/redisService';
import { getBasicCollaborationQuestionByIdWithAdditionalData } from '@/utils/requests/collaborationQuestions/requests';
import { getEventById } from '@/utils/requests/events/requests';
import { getProjectById } from '@/utils/requests/project/requests';
import { getSurveyQuestionById } from '@/utils/requests/surveyQuestions/requests';
import { getProjectUpdateById } from '@/utils/requests/updates/requests';

import { createNewsFeedEntryForPost } from './postService';

const logger = getLogger();

export const getNewsFeedEntryForEntity = async (
  redisClient: RedisClient,
  object: { objectId: string; objectType: ObjectType },
  user: User,
) => {
  const redisKey = `${object.objectType}:${object.objectId}`;
  const cacheEntry = await getNewsFeedEntryByKey(redisClient, redisKey);
  return cacheEntry ?? (await createNewsFeedEntryForEntity(object, user));
};

export const createNewsFeedEntryForEntity = async (
  reaction: {
    objectId: string;
    objectType: ObjectType;
  },
  user: User,
): Promise<RedisNewsFeedEntry | null> => {
  switch (reaction.objectType) {
    case ObjectType.EVENT:
      const event = await getEventById(reaction.objectId);
      if (!event) {
        logger.warn(`Failed to create news feed cache entry for event with id '${reaction.objectId}': No event found`);
        return null;
      }
      const eventReactions = await getReactionsForEntity(dbClient, ObjectType.EVENT, reaction.objectId);
      const eventFollowedBy = await mapToRedisUsers(await getFollowedByForEntity(dbClient, ObjectType.EVENT, event.id));
      return mapEventToRedisNewsFeedEntry(event, eventReactions, eventFollowedBy);
    case ObjectType.UPDATE:
      const update = await getProjectUpdateById(reaction.objectId);
      if (!update) {
        logger.warn(
          `Failed to create news feed cache entry for update with id '${reaction.objectId}': No update found`,
        );
        return null;
      }
      const updateReactions = await getReactionsForEntity(dbClient, ObjectType.UPDATE, reaction.objectId);
      const updateFollowedBy = await getFollowedByForEntity(dbClient, ObjectType.UPDATE, update.id);
      const mappedUpdateFollowedBy = await mapToRedisUsers(updateFollowedBy);
      const responseCount = await countNewsResponses(dbClient, update.id);
      return mapUpdateToRedisNewsFeedEntry(update, updateReactions, mappedUpdateFollowedBy, responseCount);
    case ObjectType.COLLABORATION_COMMENT:
      const comment = await createNewsFeedEntryForComment(user, reaction.objectId);
      if (!comment) {
        logger.warn(`Failed to create news feed cache entry for collaboration comment with id '${reaction.objectId}'`);
        return null;
      }
      return comment;
    case ObjectType.COLLABORATION_QUESTION:
      const question = await getBasicCollaborationQuestionByIdWithAdditionalData(reaction.objectId);
      if (!question) {
        logger.warn(
          `Failed to create news feed cache entry for collaboration question with id '${reaction.objectId}': No question found`,
        );
        return null;
      }
      const questionFollowerIds = await getFollowedByForEntity(
        dbClient,
        ObjectType.COLLABORATION_QUESTION,
        question.id,
      );
      const questionFollowers = await mapToRedisUsers(questionFollowerIds);
      return mapCollaborationQuestionToRedisNewsFeedEntry(question, question.reactions, questionFollowers);
    case ObjectType.POST:
      return createNewsFeedEntryForPost(reaction.objectId, user);
    case ObjectType.SURVEY_QUESTION:
      const survey = await getSurveyQuestionById(reaction.objectId);

      if (!survey) {
        logger.warn(`Failed to create news feed cache entry for survey question with id '${reaction.objectId}'`);
        return null;
      }
      const surveyReactions = await getReactionsForEntity(dbClient, ObjectType.SURVEY_QUESTION, reaction.objectId);
      const surveyFollowedBy = await getFollowedByForEntity(dbClient, ObjectType.SURVEY_QUESTION, survey.id);
      const mappedSurveyFollowedBy = await mapToRedisUsers(surveyFollowedBy);
      return mapSurveyQuestionToRedisNewsFeedEntry(survey, surveyReactions, mappedSurveyFollowedBy);
    case ObjectType.PROJECT:
      const project = await getProjectById(reaction.objectId);

      if (!project) {
        logger.warn(`Failed to create news feed cache entry for project with id '${reaction.objectId}'`);
        return null;
      }
      const projectReactions = await getReactionsForEntity(dbClient, ObjectType.PROJECT, reaction.objectId);
      const projectFollowedBy = await getFollowedByForEntity(dbClient, ObjectType.PROJECT, project.id);
      const mappedProjectFollowedBy = await mapToRedisUsers(projectFollowedBy);
      return mapProjectToRedisNewsFeedEntry(project, projectReactions, mappedProjectFollowedBy);
    default:
      logger.warn(`Could not add reaction to news feed cache: Unknown object type '${reaction.objectId}'`);
      return null;
  }
};
