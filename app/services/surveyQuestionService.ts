import getLogger from '@/utils/logger';
import dbClient from '@/repository/db/prisma/prisma';
import { mapSurveyQuestionToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { RedisClient, RedisTransactionClient, getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import {
  getNewsFeedEntryByKey,
  performRedisTransaction,
  transactionalSaveNewsFeedEntry,
} from '@/utils/newsFeed/redis/redisService';
import { getSurveyQuestionById } from '@/utils/requests/surveyQuestions/requests';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { getFollowedByForEntity } from '@/repository/db/follow';
import { NewsType, RedisSurveyQuestion, RedisSurveyVote } from '@/utils/newsFeed/redis/models';
import { ObjectType, SurveyQuestion } from '@/common/types';

const logger = getLogger();

export const handleSurveyVoteInCache = async (surveyQuestion: {
  id: string;
  surveyQuestionId: string;
  votedBy: string;
  createdAt: Date;
  vote: string;
}) => {
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

export const addVoteToCache = async (
  transactionClient: RedisTransactionClient,
  survey: RedisSurveyQuestion,
  vote: RedisSurveyVote,
) => {
  survey.votes.push(vote);
  await transactionalSaveNewsFeedEntry(transactionClient, {
    type: NewsType.SURVEY_QUESTION,
    updatedAt: survey.updatedAt,
    item: survey,
  });
};

export const removeVoteFromCache = async (
  transactionClient: RedisTransactionClient,
  survey: RedisSurveyQuestion,
  vote: RedisSurveyVote,
) => {
  const updatedVotes = survey.votes.filter((surveyVote) => surveyVote.id !== vote.id);
  survey.votes = updatedVotes;
  await transactionalSaveNewsFeedEntry(transactionClient, {
    type: NewsType.SURVEY_QUESTION,
    updatedAt: survey.updatedAt,
    item: survey,
  });
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
  const surveyFollowedBy = await getFollowedByForEntity(dbClient, ObjectType.SURVEY_QUESTION, survey.id);
  const mappedSurveyFollowedBy = await mapToRedisUsers(surveyFollowedBy);
  return mapSurveyQuestionToRedisNewsFeedEntry(survey, surveyReactions, mappedSurveyFollowedBy);
};

const getRedisKey = (id: string) => `${NewsType.SURVEY_QUESTION}:${id}`;
