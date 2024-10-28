import { ObjectType } from '@/common/types';
import { getFollowedByForEntity } from '@/repository/db/follow';
import { countNewsResponses } from '@/repository/db/news_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { getAllPushSubscriptions } from '@/repository/db/push_subscriptions';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { mapObjectWithReactions } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapToRedisUsers, mapUpdateToRedisNewsFeedEntry } from '@/utils/newsFeed/redis/mappings';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { getRedisNewsCommentsById } from '@/utils/requests/comments/requests';
import { getProjectUpdateByIdWithReactions } from '@/utils/requests/updates/requests';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

const logger = getLogger();

export class UpdateLifecycle extends StrapiEntityLifecycle {
  public override async onCreate(entry: StrapiEntry): Promise<void> {
    const updateId = entry.id.toString();
    await this.notifyAll();
    await this.saveUpdateToCache(updateId);
  }

  public override async onUpdate(entry: StrapiEntry): Promise<void> {
    const updateId = entry.id.toString();
    await this.notifyAll();
    await this.saveUpdateToCache(updateId);
  }

  public override async onDelete(entry: StrapiEntry): Promise<void> {
    const updateId = entry.id.toString();
    await this.notifyAll();
    await this.deleteUpdateFromCache(updateId);
  }

  // Update does not have 'publish' event, but added just to be sure
  public override async onPublish(_: StrapiEntry): Promise<void> {
    await this.notifyAll();
  }

  private notifyAll = async () => {
    const notifications = await this.buildNotifications();
    sendPushNotifications(notifications);
  };

  private buildNotifications = async (): Promise<NotificationRequest[]> => {
    try {
      const allSubscriptions = await getAllPushSubscriptions(dbClient);
      return allSubscriptions.map((subscription) => {
        return {
          subscriptions: subscription.subscriptions,
          userId: subscription.userId,
          notification: {
            topic: 'update',
            body: `Ein neues Update wurde hinzugefügt.`,
            url: '/news',
          },
        };
      });
    } catch (err) {
      const error: InnoPlatformError = dbError(`Build notifications`, err as Error);
      logger.error(error);
      throw err;
    }
  };

  private saveUpdateToCache = async (updateId: string) => {
    try {
      const update = await getProjectUpdateByIdWithReactions(updateId);
      if (!update) {
        logger.warn(`Failed to save project update with id '${updateId}' to cache`);
        return;
      }

      const redisClient = await getRedisClient();
      const followerIds = await getFollowedByForEntity(dbClient, ObjectType.UPDATE, updateId);
      const followers = await mapToRedisUsers(followerIds);
      const updateWithReactions = mapObjectWithReactions(update);
      const responseCount = await countNewsResponses(dbClient, update.id);
      const comments = await getRedisNewsCommentsById(update.id);
      const newsFeedEntry = mapUpdateToRedisNewsFeedEntry(
        updateWithReactions,
        update.reactions,
        followers,
        responseCount,
        comments,
      );
      await saveNewsFeedEntry(redisClient, newsFeedEntry);
    } catch (err) {
      const error: InnoPlatformError = dbError(`Save update to cache with id: ${updateId}`, err as Error, updateId);
      logger.error(error);
      throw err;
    }
  };

  private deleteUpdateFromCache = async (updateId: string) => {
    const redisClient = await getRedisClient();
    const redisKey = this.getRedisKey(updateId);
    await deleteItemFromRedis(redisClient, redisKey);
  };
}
