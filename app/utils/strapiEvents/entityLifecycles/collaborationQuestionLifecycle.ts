import { ObjectType } from '@/common/types';
import { getFollowedByForEntity, getProjectFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import getLogger from '@/utils/logger';
import { mapCollaborationQuestionToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, getNewsFeedEntryByKey, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { getBasicCollaborationQuestionByIdWithAdditionalData } from '@/utils/requests/collaborationQuestions/requests';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

const logger = getLogger();

export class CollaborationQuestionLifecycle extends StrapiEntityLifecycle {
  public override async onUpdate(entry: StrapiEntry): Promise<void> {
    const questionId = entry.id.toString();
    await this.saveQuestionToCache(questionId, { createIfNew: false });
  }

  public override async onDelete(entry: StrapiEntry): Promise<void> {
    const questionId = entry.id.toString();
    await this.deleteQuestionFromCache(questionId);
  }

  public override async onPublish(entry: StrapiEntry): Promise<void> {
    const questionId = entry.id.toString();
    await this.notifyFollowers(questionId);
    await this.saveQuestionToCache(questionId);
  }

  public override async onUnpublish(entry: StrapiEntry): Promise<void> {
    const questionId = entry.id.toString();
    this.deleteQuestionFromCache(questionId);
  }

  private notifyFollowers = async (questionId: string) => {
    const notifications = await this.buildNotifications(questionId);
    sendPushNotifications(notifications);
  };

  private buildNotifications = async (questionId: string): Promise<NotificationRequest[]> => {
    const followers = await getProjectFollowers(dbClient, questionId);
    // Ignore possible erros...
    return await Promise.all(
      followers.map(async ({ followedBy }) => {
        return {
          subscriptions: await getPushSubscriptionsForUser(dbClient, followedBy),
          userId: followedBy,
          notification: {
            topic: 'collaboration-question',
            body: 'Eine neue Frage wurde kürzlich zu einem Projekt, dem du folgst, hinzugefügt.',
            url: '/',
          },
        };
      }),
    );
  };

  private saveQuestionToCache = async (
    questionId: string,
    options: { createIfNew: boolean } = { createIfNew: true },
  ) => {
    const question = await getBasicCollaborationQuestionByIdWithAdditionalData(questionId);
    if (!question) {
      logger.warn(`Failed to save collaboration question with id '${questionId}' to cache`);
      return;
    }

    const redisClient = await getRedisClient();

    if (!options.createIfNew) {
      const redisKey = this.getRedisKey(questionId);
      const cachedQuestion = await getNewsFeedEntryByKey(redisClient, redisKey);
      if (!cachedQuestion) return;
    }

    const followerIds = await getFollowedByForEntity(dbClient, ObjectType.COLLABORATION_QUESTION, question.id);
    const followers = await mapToRedisUsers(followerIds);
    const newsFeedEntry = mapCollaborationQuestionToRedisNewsFeedEntry(question, question.reactions, followers);
    await saveNewsFeedEntry(redisClient, newsFeedEntry);
  };

  private deleteQuestionFromCache = async (questionId: string) => {
    const redisClient = await getRedisClient();
    const redisKey = this.getRedisKey(questionId);
    await deleteItemFromRedis(redisClient, redisKey);
  };
}
