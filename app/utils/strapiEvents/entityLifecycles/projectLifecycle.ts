import { ObjectType } from '@/common/types';
import { getFollowedByForEntity, getProjectFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { mapObjectWithReactions } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapProjectToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, getNewsFeedEntryByKey, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { getProjectByIdWithReactions } from '@/utils/requests/project/requests';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

const logger = getLogger();
export class ProjectLifecycle extends StrapiEntityLifecycle {
  public override async onUpdate(entry: StrapiEntry): Promise<void> {
    const projectId = entry.documentId.toString();
    await this.notifyFollowers(projectId);
    await this.saveProjectToCache(projectId, { createIfNew: false });
  }

  public override async onPublish(entry: StrapiEntry): Promise<void> {
    const projectId = entry.documentId.toString();
    await this.notifyFollowers(projectId);
    await this.saveProjectToCache(projectId);
  }

  public override async onDelete(entry: StrapiEntry): Promise<void> {
    const projectId = entry.documentId.toString();
    await this.deleteProjectFromCache(projectId);
  }

  public override async onUnpublish(entry: StrapiEntry): Promise<void> {
    const projectId = entry.documentId.toString();
    this.deleteProjectFromCache(projectId);
  }

  private notifyFollowers = async (projectId: string) => {
    const notifications = await this.buildNotifications(projectId);
    sendPushNotifications(notifications);
  };

  private buildNotifications = async (projectId: string): Promise<NotificationRequest[]> => {
    try {
      const followers = await getProjectFollowers(dbClient, projectId);

      // Ignore possible erros...
      return await Promise.all(
        followers.map(async ({ followedBy }) => {
          return {
            subscriptions: await getPushSubscriptionsForUser(dbClient, followedBy),
            userId: followedBy,
            notification: {
              topic: 'project',
              body: 'Ein Projekt, dem du folgst, wurde kürzlich aktualisiert.',
              url: `/projects/${projectId}`,
            },
          };
        }),
      );
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Build notifications for followers of project with id: ${projectId}`,
        err as Error,
        projectId,
      );
      logger.error(error);
      throw err;
    }
  };

  private saveProjectToCache = async (projectId: string, options: { createIfNew: boolean } = { createIfNew: true }) => {
    const project = await getProjectByIdWithReactions(projectId);
    if (!project) {
      logger.warn(`Failed to save project with id '${projectId}' to cache`);
      return;
    }

    const redisClient = await getRedisClient();
    if (!options.createIfNew) {
      const redisKey = this.getRedisKey(projectId);
      const cachedQuestion = await getNewsFeedEntryByKey(redisClient, redisKey);
      if (!cachedQuestion) return;
    }

    const followerIds = await getFollowedByForEntity(dbClient, ObjectType.PROJECT, projectId);
    const followers = await mapToRedisUsers(followerIds);
    const newsFeedEntry = mapProjectToRedisNewsFeedEntry(mapObjectWithReactions(project), project.reactions, followers);
    await saveNewsFeedEntry(redisClient, newsFeedEntry);
  };

  private deleteProjectFromCache = async (projectId: string) => {
    const redisClient = await getRedisClient();
    const redisKey = this.getRedisKey(projectId);
    await deleteItemFromRedis(redisClient, redisKey);
  };
}
