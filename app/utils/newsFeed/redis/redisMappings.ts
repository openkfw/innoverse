import { Follow as PrismaFollow, Reaction as PrismaReaction } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import {
  CollaborationComment,
  CollaborationQuestion,
  Event,
  Follow,
  NewsFeedEntry,
  ObjectType,
  Post,
  Project,
  ProjectUpdate,
  Reaction,
  SurveyQuestion,
  UserSession,
} from '@/common/types';
import { withAuth } from '@/utils/auth';
import { unixTimestampToDate } from '@/utils/helpers';

import { NewsType, RedisNewsFeedEntry, RedisReaction, RedisSurveyQuestion } from './models';

export const MappedRedisType: Record<NewsType, ObjectType> = {
  [NewsType.UPDATE]: ObjectType.UPDATE,
  [NewsType.EVENT]: ObjectType.EVENT,
  [NewsType.POST]: ObjectType.POST,
  [NewsType.COLLABORATION_QUESTION]: ObjectType.COLLABORATION_QUESTION,
  [NewsType.SURVEY_QUESTION]: ObjectType.SURVEY_QUESTION,
  [NewsType.OPPORTUNITY]: ObjectType.OPPORTUNITY,
  [NewsType.PROJECT]: ObjectType.PROJECT,
  [NewsType.COLLABORATION_COMMENT]: ObjectType.COLLABORATION_COMMENT,
};

type RedisNewsFeedEntryWithAdditionalData = RedisNewsFeedEntry & {
  reaction?: RedisReaction;
  followedByUser: boolean;
};

export const mapRedisNewsFeedEntries = withAuth(async (user: UserSession, redisFeedEntries: RedisNewsFeedEntry[]) => {
  const entriesWithUserData = redisFeedEntries.map((entry) => ({
    ...entry,
    followedByUser: entry.item.followedBy.some((follow) => follow.providerId === user.providerId),
    reaction: entry.item.reactions.find((reaction) => reaction.reactedBy === user.providerId),
  }));

  const entries = entriesWithUserData.map((entry) => mapRedisItem(entry, user));
  return {
    status: StatusCodes.OK,
    data: entries,
  };
});

export const mapRedisSurveyQuestionToRedisNewsFeedEntry = (surveyQuestion: RedisSurveyQuestion): RedisNewsFeedEntry => {
  return {
    updatedAt: surveyQuestion.updatedAt,
    item: surveyQuestion,
    type: NewsType.SURVEY_QUESTION,
    search: surveyQuestion.question,
  };
};

export const mapReaction = (reaction: PrismaReaction): Reaction => {
  const { id, shortCode, nativeSymbol, objectId, objectType, reactedBy, createdAt } = reaction;
  return {
    id,
    objectId,
    objectType: objectType as ObjectType,
    shortCode,
    nativeSymbol,
    reactedBy,
    createdAt,
  } as Reaction;
};

const mapObjectWithReactions = <T extends { reactions: RedisReaction[] }>(item: T) => {
  return {
    ...item,
    reactions: item.reactions as Reaction[],
  };
};

export const mapFollow = (reaction: PrismaFollow): Follow => {
  const { id, followedBy, objectId, objectType, createdAt } = reaction;
  return {
    id,
    objectId,
    objectType: objectType as ObjectType,
    followedBy,
    createdAt,
  } as Follow;
};

const mapRedisItem = (entry: RedisNewsFeedEntryWithAdditionalData, user: UserSession): NewsFeedEntry => {
  const mappedItem = mapItem(entry, user);
  switch (entry.type) {
    case NewsType.UPDATE:
      return { type: ObjectType.UPDATE, item: mappedItem as ProjectUpdate };
    case NewsType.COLLABORATION_COMMENT:
      return { type: ObjectType.COLLABORATION_COMMENT, item: mappedItem as CollaborationComment };
    case NewsType.COLLABORATION_QUESTION:
      return { type: ObjectType.COLLABORATION_QUESTION, item: mappedItem as CollaborationQuestion };
    case NewsType.EVENT:
      return { type: ObjectType.EVENT, item: mappedItem as Event };
    case NewsType.POST:
      return { type: ObjectType.POST, item: mappedItem as Post };
    case NewsType.PROJECT:
      return { type: ObjectType.PROJECT, item: mappedItem as Project };
    case NewsType.SURVEY_QUESTION:
      return { type: ObjectType.SURVEY_QUESTION, item: mappedItem as SurveyQuestion };
    default:
      return { type: ObjectType.UPDATE, item: mappedItem as ProjectUpdate };
  }
};

const mapItem = (redisFeedEntry: RedisNewsFeedEntryWithAdditionalData, user: UserSession) => {
  const { type, item } = redisFeedEntry;
  const projectId = type === NewsType.PROJECT ? item.id : item.projectId;

  if (type === NewsType.SURVEY_QUESTION) {
    const userVote = item.votes.find((vote) => vote.votedBy === user.providerId);
    return mapObjectWithReactions({
      ...item,
      userVote: userVote?.vote,
      followedByUser: redisFeedEntry.followedByUser,
      reactionForUser: redisFeedEntry.reaction ?? null,
      createdAt: unixTimestampToDate(item.createdAt),
      updatedAt: unixTimestampToDate(item.updatedAt),
      projectId: item.projectId,
    });
  }

  return mapObjectWithReactions({
    ...item,
    followedByUser: redisFeedEntry.followedByUser,
    reactionForUser: redisFeedEntry.reaction ?? null,
    updatedAt: unixTimestampToDate(item.updatedAt),
    projectId: projectId,
  }) as NewsFeedEntry['item'];
};
