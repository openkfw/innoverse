import { Follow as PrismaFollow, Reaction as PrismaReaction } from '@prisma/client';

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
} from '@/common/types';
import { getPromiseResults, unixTimestampToDate } from '@/utils/helpers';
import {
  findReactedByUser,
  findSurveyUserVote,
  getFollowedByForObjects as getFollowedObjectIds,
  getUserReactionsForObjects,
  isFollowedByUser,
} from '@/utils/requests/requests';

import { NewsType, RedisNewsFeedEntry, RedisReaction } from './models';

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

export const mapRedisNewsFeedEntries = async (redisFeedEntries: RedisNewsFeedEntry[]) => {
  const objects = redisFeedEntries.map((entry) => ({
    objectType: MappedRedisType[entry.type],
    objectId: entry.item.id,
  }));

  const { data: followedObjectIds } = await getFollowedObjectIds({ objects });
  const { data: reactions } = await getUserReactionsForObjects({ objects });

  const objectsWithAdditionalData = redisFeedEntries.map((entry) => ({
    ...entry,
    followedByUser: followedObjectIds?.some((id) => id === entry.item.id) ?? false,
    reaction: reactions?.find((reaction) => reaction.objectId === entry.item.id),
  }));

  const mapObjects = objectsWithAdditionalData.map(mapRedisItem);
  return await getPromiseResults(mapObjects);
};

export const mapRedisNewsFeedEntry = async (redisFeedEntry: RedisNewsFeedEntry) => {
  const object = { objectId: redisFeedEntry.item.id, objectType: MappedRedisType[redisFeedEntry.type] };
  const { data: isFollowedBy } = await isFollowedByUser(object);
  const { data: reactionForUser } = await findReactedByUser(object);
  const objectWithAdditionalData = {
    ...redisFeedEntry,
    followedByUser: isFollowedBy ?? false,
    reaction: reactionForUser ?? undefined,
  };

  const mappedItem = await mapRedisItem(objectWithAdditionalData);
  return mappedItem as NewsFeedEntry;
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

export const mapRedisItem = async (entry: RedisNewsFeedEntryWithAdditionalData): Promise<NewsFeedEntry> => {
  const mappedItem = await mapItem(entry);
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

const mapItem = async (redisFeedEntry: RedisNewsFeedEntryWithAdditionalData) => {
  const { type, item } = redisFeedEntry;
  const projectId = type === NewsType.PROJECT ? item.id : item.projectId;

  if (type === NewsType.SURVEY_QUESTION) {
    const { data: userVote } = await findSurveyUserVote({ objectId: item.id });
    return mapObjectWithReactions({
      ...item,
      userVote: userVote?.vote ?? undefined,
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
