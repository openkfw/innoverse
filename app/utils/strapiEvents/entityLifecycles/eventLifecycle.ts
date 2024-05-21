import dbClient from '@/repository/db/prisma/prisma';
import { getAllPushSubscriptions } from '@/repository/db/push_subscriptions';
import { NotificationRequest, sendPushNotifications } from '@/utils/notification/notificationSender';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';

export class EventLifecycle extends StrapiEntityLifecycle {
  public override async onPublish(_: StrapiEntry): Promise<void> {
    await this.notifyAll();
  }

  public override async onUnpublish(_: StrapiEntry): Promise<void> {
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
          topic: 'event',
          body: `Ein neues Event wurde kürzlich hinzugefügt.`,
          url: '/',
        },
      };
    });
  };
}
