import { getProjectFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

export class ProjectLifecycle extends StrapiEntityLifecycle {
  public override async onPublish(entry: StrapiEntry): Promise<void> {
    const projectId = entry.id.toString();
    await this.notifyFollowers(projectId);
  }

  public override async onUpdate(entry: StrapiEntry): Promise<void> {
    const projectId = entry.id.toString();
    await this.notifyFollowers(projectId);
  }

  private notifyFollowers = async (projectId: string) => {
    const notifications = await this.buildNotifications(projectId);
    sendPushNotifications(notifications);
  };

  private buildNotifications = async (projectId: string): Promise<NotificationRequest[]> => {
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
  };
}
