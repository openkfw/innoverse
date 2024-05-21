import { getProjectFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import getLogger from '@/utils/logger';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { getProjectAuthorIdByProjectId } from '@/utils/requests/project/requests';
import { getBasicSurveyQuestionById } from '@/utils/requests/surveyQuestions/requests';
import { createProjectUpdate } from '@/utils/requests/updates/requests';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

const logger = getLogger();

export class SurveyQuestionLifecycle extends StrapiEntityLifecycle {
  public override async onPublish(entry: StrapiEntry): Promise<void> {
    const surveyId = entry.id.toString();
    await this.notifyFollowers(surveyId);
    await this.createUpdateForNewSurvey(surveyId);
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

  private createUpdateForNewSurvey = async (surveyQuestionId: string) => {
    const surveyQuestion = await getBasicSurveyQuestionById(surveyQuestionId);

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
}
