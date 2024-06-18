import { getProjectFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import { createProjectUpdate } from '@/services/updateService';
import getLogger from '@/utils/logger';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { getBasicOpportunityById } from '@/utils/requests/opportunities/requests';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

const logger = getLogger();

export class OpportunityLifecycle extends StrapiEntityLifecycle {
  public override async onPublish(entry: StrapiEntry): Promise<void> {
    const opportunityId = entry.id.toString();
    await this.notifyFollowers(opportunityId);
    await this.createUpdateForNewOpportunity(opportunityId);
  }

  private notifyFollowers = async (opportunityId: string) => {
    const notifications = await this.buildNotifications(opportunityId);
    sendPushNotifications(notifications);
  };

  private buildNotifications = async (opportunityId: string): Promise<NotificationRequest[]> => {
    const followers = await getProjectFollowers(dbClient, opportunityId);
    // Ignore possible erros...
    return await Promise.all(
      followers.map(async ({ followedBy }) => {
        return {
          subscriptions: await getPushSubscriptionsForUser(dbClient, followedBy),
          userId: followedBy,
          notification: {
            topic: 'opportunity',
            body: 'Eine neue Opportunity wurde kürzlich zu einem Projekt, dem du folgst, hinzugefügt.',
            url: '/',
          },
        };
      }),
    );
  };

  private createUpdateForNewOpportunity = async (opportunityId: string) => {
    const opportunity = await getBasicOpportunityById(opportunityId);

    if (!opportunity) return;

    if (!opportunity.projectId) {
      logger.warn("Can't create project update for published opportunity as it contains no project");
      return;
    }

    if (!opportunity.contactPerson) {
      logger.warn("Can't create project update for published opportunity as no contact person is set");
      return;
    }

    // Removing trailing '.' from title
    const title = opportunity.title.endsWith('.')
      ? opportunity.title.slice(0, opportunity.title.length - 1)
      : opportunity.title;

    const update = await createProjectUpdate({
      comment: `Eine neue Opportunity wurde eingestellt: ${title}. ${opportunity.description}`,
      authorId: opportunity.contactPerson.id,
      projectId: opportunity.projectId,
      linkToCollaborationTab: true,
    });

    if (update) {
      logger.info(`Created project update with id ${update.id} for published opportunity`);
    }
  };
}
