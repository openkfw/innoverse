import { ObjectType } from '@/common/types';
import { getFollowedByForEntity } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getAllPushSubscriptions } from '@/repository/db/push_subscriptions';
import { mapObjectWithReactions } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapEventToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, getNewsFeedEntryByKey, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { getEventByIdWithReactions } from '@/utils/requests/events/requests';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

const logger = getLogger();

export class EventLifecycle extends StrapiEntityLifecycle {
  public override async onUpdate(entry: StrapiEntry): Promise<void> {
    const eventId = entry.id.toString();
    await this.saveEventToCache(eventId, { createIfNew: false });
  }

  public override async onDelete(entry: StrapiEntry): Promise<void> {
    const eventId = entry.id.toString();
    await this.deleteEventFromCache(eventId);
  }

  public override async onPublish(entry: StrapiEntry): Promise<void> {
    const eventId = entry.id.toString();
    await this.notifyAll();
    await this.saveEventToCache(eventId);
  }

  public override async onUnpublish(entry: StrapiEntry): Promise<void> {
    const eventId = entry.id.toString();
    await this.notifyAll();
    await this.deleteEventFromCache(eventId);
  }

  private notifyAll = async () => {
    const notifications = await this.buildNotifications();
    sendPushNotifications(notifications);
  };

  private buildNotifications = async (): Promise<NotificationRequest[]> => {
    const allSubscriptions = await getAllPushSubscriptions(dbClient);
    return allSubscriptions.map((subscription) => {
      return {
        subscriptions: subscription.subscriptions,
        userId: subscription.userId,
        notification: {
          topic: 'event',
          body: `Ein neues Event wurde kürzlich hinzugefügt.`,
          url: '/',
        },
      };
    });
  };

  private saveEventToCache = async (eventId: string, options: { createIfNew: boolean } = { createIfNew: true }) => {
    const event = await getEventByIdWithReactions(eventId);

    if (!event) {
      logger.warn(`Failed to save event with id '${eventId}' to cache`);
      return;
    }

    const redisClient = await getRedisClient();

    if (!options.createIfNew) {
      const redisKey = this.getRedisKey(eventId);
      const cachedEvent = await getNewsFeedEntryByKey(redisClient, redisKey);
      if (!cachedEvent) return;
    }

    const followerIds = await getFollowedByForEntity(dbClient, ObjectType.EVENT, eventId);
    const followers = await mapToRedisUsers(followerIds);
    const eventWithReactions = mapObjectWithReactions(event);
    const newsFeedEntry = await mapEventToRedisNewsFeedEntry(eventWithReactions, event.reactions, followers);
    await saveNewsFeedEntry(redisClient, newsFeedEntry);
  };

  private deleteEventFromCache = async (eventId: string) => {
    const redisClient = await getRedisClient();
    const redisKey = this.getRedisKey(eventId);
    await deleteItemFromRedis(redisClient, redisKey);
  };
}
