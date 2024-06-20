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
import { getProjectTitleById, getProjectTitleByIds } from '@/utils/requests/project/requests';
import { findReactedByUser, findSurveyUserVote, isFollowedByUser } from '@/utils/requests/requests';

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

export const mapRedisNewsFeedEntries = async (redisFeedEntries: RedisNewsFeedEntry[]) => {
  const projectIds = redisFeedEntries
    .map((entry) => entry.item.projectId)
    .filter((projectId): projectId is string => !!projectId);

  const projects = (await getProjectTitleByIds(projectIds)) ?? [];

  const mapItems = redisFeedEntries.map(async (entry) => {
    const projectTitle = projects.find((project) => project.id === entry.item.projectId);
    return await mapRedisItem(entry, projectTitle?.title);
  });

  return await getPromiseResults(mapItems);
};

export const mapRedisNewsFeedEntry = async (redisFeedEntry: RedisNewsFeedEntry) => {
  const projectId = redisFeedEntry.item.projectId;
  const projectTitle = projectId && (await getProjectTitleById(projectId));
  const mappedItem = await mapRedisItem(redisFeedEntry, projectTitle);
  return mappedItem as NewsFeedEntry;
};

const mapItem = async (redisFeedEntry: RedisNewsFeedEntry, projectTitle?: string) => {
  const { type, item } = redisFeedEntry;
  const { data: followedByUser } = await isFollowedByUser({ objectType: MappedRedisType[type], objectId: item.id });
  const { data: reactionForUser } = await findReactedByUser({ objectType: MappedRedisType[type], objectId: item.id });
  const projectId = type === NewsType.PROJECT ? item.id : item.projectId;
  if (type === NewsType.SURVEY_QUESTION) {
    const { data: userVote } = await findSurveyUserVote({ objectId: item.id });
    return mapObjectWithReactions({
      ...item,
      projectName: projectTitle ?? '',
      userVote: userVote?.vote ?? null,
      followedByUser: followedByUser ?? false,
      reactionForUser: reactionForUser ? mapReaction(reactionForUser) : null,
      createdAt: unixTimestampToDate(item.createdAt),
      updatedAt: unixTimestampToDate(item.updatedAt),
    });
  }
  return mapObjectWithReactions({
    ...item,
    projectName: projectTitle ?? '',
    followedByUser: followedByUser ?? false,
    reactionForUser: reactionForUser ? mapReaction(reactionForUser) : null,
    updatedAt: unixTimestampToDate(item.updatedAt),
    projectId: projectId,
  }) as NewsFeedEntry['item'];
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

export const mapRedisItem = async (entry: RedisNewsFeedEntry, projectTitle?: string): Promise<NewsFeedEntry> => {
  const mappedItem = await mapItem(entry, projectTitle);
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
