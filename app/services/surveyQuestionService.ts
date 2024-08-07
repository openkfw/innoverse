import { SurveyVote as PrismaSurveyVote } from '@prisma/client';

import { ObjectType, SurveyQuestion } from '@/common/types';
import { getFollowedByForEntity, getFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { handleSurveyQuestionVoteInDb } from '@/repository/db/survey_votes';
import getLogger from '@/utils/logger';
import { mapSurveyQuestionToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { NewsType, RedisSurveyQuestion, RedisSurveyVote } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient, RedisTransactionClient } from '@/utils/newsFeed/redis/redisClient';
import { mapRedisSurveyQuestionToRedisNewsFeedEntry } from '@/utils/newsFeed/redis/redisMappings';
import {
  getNewsFeedEntryByKey,
  performRedisTransaction,
  transactionalSaveNewsFeedEntry,
} from '@/utils/newsFeed/redis/redisService';
import { getSurveyQuestionById } from '@/utils/requests/surveyQuestions/requests';

import { notifyFollowers } from '../utils/notification/notificationSender';

const logger = getLogger();

export const handleSurveyQuestionVote = async (surveyQuestion: {
  projectId: string;
  surveyQuestionId: string;
  providerId: string;
  vote: string;
}) => {
  const { operation, vote: surveyVote } = await handleSurveyQuestionVoteInDb(
    dbClient,
    surveyQuestion.projectId,
    surveyQuestion.surveyQuestionId,
    surveyQuestion.providerId,
    surveyQuestion.vote,
  );

  handleSurveyVoteInCache(surveyVote);

  if (operation !== 'deleted') {
    notifySurveyFollowers(surveyQuestion.surveyQuestionId);
  }

  return surveyVote;
};

const handleSurveyVoteInCache = async (surveyQuestion: PrismaSurveyVote) => {
  const { surveyQuestionId, votedBy, vote, id } = surveyQuestion;
  const redisClient = await getRedisClient();
  const newsFeedEntry = await getNewsFeedEntryForSurveyQuestion(redisClient, {
    surveyId: surveyQuestionId,
  });

  if (!newsFeedEntry) {
    return;
  }
  const survey = newsFeedEntry.item as RedisSurveyQuestion;
  await performRedisTransaction(redisClient, async (transactionClient) => {
    const redisVote = survey.votes.find((vote) => vote.votedBy === votedBy);
    if (redisVote) {
      await removeVoteFromCache(transactionClient, survey, redisVote);
    }
    if (redisVote?.vote !== vote) {
      const newVote = { id, votedBy, vote };
      await addVoteToCache(transactionClient, survey, newVote);
    }
  });
};

const addVoteToCache = async (
  transactionClient: RedisTransactionClient,
  survey: RedisSurveyQuestion,
  vote: RedisSurveyVote,
) => {
  survey.votes.push(vote);
  const newsFeedEntry = mapRedisSurveyQuestionToRedisNewsFeedEntry(survey);
  await transactionalSaveNewsFeedEntry(transactionClient, newsFeedEntry);
};

const removeVoteFromCache = async (
  transactionClient: RedisTransactionClient,
  survey: RedisSurveyQuestion,
  vote: RedisSurveyVote,
) => {
  const updatedVotes = survey.votes.filter((surveyVote) => surveyVote.id !== vote.id);
  survey.votes = updatedVotes;
  const newsFeedEntry = mapRedisSurveyQuestionToRedisNewsFeedEntry(survey);
  await transactionalSaveNewsFeedEntry(transactionClient, newsFeedEntry);
};

export const getNewsFeedEntryForSurveyQuestion = async (
  redisClient: RedisClient,
  { surveyId }: { surveyId: string },
) => {
  const redisKey = getRedisKey(surveyId);
  const cacheEntry = await getNewsFeedEntryByKey(redisClient, redisKey);
  return cacheEntry ?? (await createNewsFeedEntryForSurveyQuestionById(surveyId));
};

export const createNewsFeedEntryForSurveyQuestionById = async (objectId: string) => {
  const survey = await getSurveyQuestionById(objectId);

  if (!survey) {
    logger.warn(`Failed to create news feed cache entry for survey question with id '${objectId}'`);
    return null;
  }

  return await createNewsFeedEntryForSurveyQuestion(survey);
};

export const createNewsFeedEntryForSurveyQuestion = async (survey: SurveyQuestion) => {
  const surveyReactions = await getReactionsForEntity(dbClient, ObjectType.SURVEY_QUESTION, survey.id);
  const projectFollowedBy = await getFollowedByForEntity(dbClient, ObjectType.PROJECT, survey.projectId);
  const mappedSProjectFollowedBy = await mapToRedisUsers(projectFollowedBy);
  return mapSurveyQuestionToRedisNewsFeedEntry(survey, surveyReactions, mappedSProjectFollowedBy);
};

const notifySurveyFollowers = async (surveyQuestionId: string) => {
  const followers = await getFollowers(dbClient, ObjectType.SURVEY_QUESTION, surveyQuestionId);
  await notifyFollowers(
    followers,
    'survey-question',
    'Auf eine Umfrage, der du folgst, wurde eine neue Stimme abgegeben.',
    '/news',
  );
};

const getRedisKey = (id: string) => `${NewsType.SURVEY_QUESTION}:${id}`;
