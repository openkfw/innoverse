import dbClient from '@/repository/db/prisma/prisma';
import { getAllPushSubscriptions } from '@/repository/db/push_subscriptions';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

export class UpdateLifecycle extends StrapiEntityLifecycle {
  public override async onCreate(_: StrapiEntry): Promise<void> {
    await this.notifyAll();
  }

  public override async onUpdate(_: StrapiEntry): Promise<void> {
    await this.notifyAll();
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
  };
}
