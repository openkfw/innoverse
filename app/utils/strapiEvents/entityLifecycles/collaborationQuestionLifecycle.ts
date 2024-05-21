import { getProjectFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import getLogger from '@/utils/logger';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { getBasicCollaborationQuestionById } from '@/utils/requests/collaborationQuestions/requests';
import { createProjectUpdate } from '@/utils/requests/updates/requests';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

const logger = getLogger();

export class CollaborationQuestionLifecycle extends StrapiEntityLifecycle {
  public override async onPublish(entry: StrapiEntry): Promise<void> {
    const questionId = entry.id.toString();
    await this.notifyFollowers(questionId);
    await this.createUpdateForNewCollaborationQuestion(questionId);
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

  private createUpdateForNewCollaborationQuestion = async (collaborationQuestId: string) => {
    const collaborationQuestion = await getBasicCollaborationQuestionById(collaborationQuestId);

    if (!collaborationQuestion) return;

    if (!collaborationQuestion.projectId) {
      logger.warn("Can't create project update for published collaboration question as it contains no project");
      return;
    }

    if (!collaborationQuestion.authors.length) {
      logger.warn("Can't create project update for published collaboration question as it contains no author");
      return;
    }

    const author = collaborationQuestion.authors[0];

    // Removing trailing '.' from title
    const title = collaborationQuestion.title.endsWith('.')
      ? collaborationQuestion.title.slice(0, collaborationQuestion.title.length - 1)
      : collaborationQuestion.title;

    const update = await createProjectUpdate({
      comment: `Eine neue Frage wurde eingestellt: ${title}. ${collaborationQuestion.description}`,
      authorId: author.id,
      projectId: collaborationQuestion.projectId,
      linkToCollaborationTab: true,
    });

    if (update) {
      logger.info(`Created project update with id ${update.id} for published collaboration question`);
    }
  };
}
