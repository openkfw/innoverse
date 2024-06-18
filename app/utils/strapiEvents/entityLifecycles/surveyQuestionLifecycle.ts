import { ObjectType } from '@/common/types';
import { getFollowedByForEntity, getProjectFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import { createProjectUpdate } from '@/services/updateService';
import { mapObjectWithReactions } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapSurveyQuestionToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, getNewsFeedEntryByKey, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { getProjectAuthorIdByProjectId } from '@/utils/requests/project/requests';
import {
  getBasicSurveyQuestionById,
  getSurveyQuestionByIdWithReactions,
} from '@/utils/requests/surveyQuestions/requests';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

const logger = getLogger();

export class SurveyQuestionLifecycle extends StrapiEntityLifecycle {
  public override async onPublish(entry: StrapiEntry): Promise<void> {
    const surveyId = entry.id.toString();
    await this.notifyFollowers(surveyId);
    await this.createUpdateForNewSurvey(surveyId);
    await this.saveSurveyQuestionToCache(surveyId);
  }

  public override async onUpdate(entry: StrapiEntry): Promise<void> {
    const surveyId = entry.id.toString();
    await this.saveSurveyQuestionToCache(surveyId, { createIfNew: false });
  }

  public override async onDelete(entry: StrapiEntry): Promise<void> {
    const surveyId = entry.id.toString();
    await this.deleteSurveyQuestionFromCache(surveyId);
  }

  public override async onUnpublish(entry: StrapiEntry): Promise<void> {
    const surveyId = entry.id.toString();
    this.deleteSurveyQuestionFromCache(surveyId);
  }

  private notifyFollowers = async (surveyId: string) => {
    const notifications = await this.buildNotifications(surveyId);
    sendPushNotifications(notifications);
  };

  private buildNotifications = async (surveyId: string): Promise<NotificationRequest[]> => {
    const followers = await getProjectFollowers(dbClient, surveyId);
    // Ignore possible erros...
    return await Promise.all(
      followers.map(async ({ followedBy }) => {
        return {
          subscriptions: await getPushSubscriptionsForUser(dbClient, followedBy),
          userId: followedBy,
          notification: {
            topic: 'survey-question',
            body: 'Eine neue Umfrage wurde kürzlich zu einem Projekt, dem du folgst, hinzugefügt.',
            url: '/',
          },
        };
      }),
    );
  };

  private createUpdateForNewSurvey = async (surveyId: string) => {
    const surveyQuestion = await getBasicSurveyQuestionById(surveyId);

    if (!surveyQuestion) return;

    if (!surveyQuestion.projectId) {
      logger.warn("Can't create project update for published survey as it contains no project");
      return;
    }

    const author = await getProjectAuthorIdByProjectId(surveyQuestion.projectId);
    if (!author) return;

    const update = await createProjectUpdate({
      comment: `Eine neue Umfrage wurde eingestellt: ${surveyQuestion.question}`,
      authorId: author.authorId,
      projectId: surveyQuestion.projectId,
      linkToCollaborationTab: true,
    });

    if (update) {
      logger.info(`Created project update with id ${update.id} for published survey`);
    }
  };

  private saveSurveyQuestionToCache = async (
    surveyId: string,
    options: { createIfNew: boolean } = { createIfNew: true },
  ) => {
    const surveyQuestion = await getSurveyQuestionByIdWithReactions(surveyId);
    if (!surveyQuestion) {
      logger.warn(`Failed to save survey question with id '${surveyId}' to cache`);
      return;
    }

    const redisClient = await getRedisClient();
    if (!options.createIfNew) {
      const redisKey = this.getRedisKey(surveyId);
      const cachedQuestion = await getNewsFeedEntryByKey(redisClient, redisKey);
      if (!cachedQuestion) return;
    }

    const followerIds = await getFollowedByForEntity(dbClient, ObjectType.SURVEY_QUESTION, surveyId);
    const followers = await mapToRedisUsers(followerIds);
    const newsFeedEntry = mapSurveyQuestionToRedisNewsFeedEntry(
      mapObjectWithReactions(surveyQuestion),
      surveyQuestion.reactions,
      followers,
    );
    await saveNewsFeedEntry(redisClient, newsFeedEntry);
  };

  private deleteSurveyQuestionFromCache = async (surveyQuestionId: string) => {
    const redisClient = await getRedisClient();
    const redisKey = this.getRedisKey(surveyQuestionId);
    await deleteItemFromRedis(redisClient, redisKey);
  };
}
