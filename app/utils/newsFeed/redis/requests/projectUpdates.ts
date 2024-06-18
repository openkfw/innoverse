import { ObjectType, ProjectUpdate } from '@/common/types';
import { getFollowedByForEntity } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { getPromiseResults, getUnixTimestamp } from '@/utils/helpers';
import { RedisProjectUpdate, RedisReaction, RedisUser } from '@/utils/newsFeed/redis/models';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { mapToProjectUpdate } from '@/utils/requests/updates/mappings';
import { GetUpdatesStartingFromQuery } from '@/utils/requests/updates/queries';

import { mapToRedisUsers } from '../mappings';

export const getProjectsUpdates = async ({ from }: { from: Date }): Promise<RedisProjectUpdate[]> => {
  const response = await strapiGraphQLFetcher(GetUpdatesStartingFromQuery, { from });
  const updatesData = response.updates?.data;
  if (!updatesData) throw new Error('Response contained no updates');
  const updates = updatesData.map(mapToProjectUpdate);
  return getPromiseResults(updates.map(mapAdditionalDataToProject));
};

const mapAdditionalDataToProject = async (projectUpdate: ProjectUpdate) => {
  const { id, author, title, comment, topic, projectId, projectStart, linkToCollaborationTab, updatedAt } =
    projectUpdate;
  return {
    id,
    author,
    title,
    comment,
    topic,
    projectId,
    projectStart,
    linkToCollaborationTab,
    updatedAt: getUnixTimestamp(new Date(updatedAt)),
    reactions: await getProjectUpdateReactions(id),
    //comments: Comment[]; TODO
    followedBy: await getProjectUpdateFollowers(id),
    responseCount: projectUpdate.responseCount ?? 0,
  };
};

const getProjectUpdateReactions = async (projectId: string): Promise<RedisReaction[]> => {
  return getReactionsForEntity(dbClient, ObjectType.UPDATE, projectId);
};

const getProjectUpdateFollowers = async (objectId: string): Promise<RedisUser[]> => {
  const followedBy = await getFollowedByForEntity(dbClient, ObjectType.UPDATE, objectId);
  return await mapToRedisUsers(followedBy);
};
