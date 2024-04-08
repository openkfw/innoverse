import { PushSubscription as WebPushSubscription } from 'web-push';

import { getProjectFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getAllPushSubscriptions, getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import getLogger from '@/utils/logger';

const logger = getLogger();

type NotificationTopic = 'project' | 'opportunity' | 'collaboration-question' | 'survey-question' | 'event' | 'update';
type Resolver = {
  [key: string]: {
    buildPushNotifications: () => Promise<
      {
        subscriptions: WebPushSubscription[];
        userId: string;
        notification: { topic: NotificationTopic; body: string; url?: string };
      }[]
    >;
    shouldNotify: () => boolean;
  };
};

type NotificationResolverResult =
  | {
      shouldNotify: () => boolean;
      buildPushNotifications: (prams?: never) => Promise<
        {
          subscriptions: WebPushSubscription[];
          userId: string;
          notification: { topic: NotificationTopic; body: string; url?: string };
        }[]
      >;
    }
  | {
      shouldNotify: () => false;
      buildPushNotifications: (prams?: never) => [];
    };

const shouldNotifyResolver = (event: string, model: string): boolean => {
  const resolvers: any = {};
  resolvers['entry.create'] = {
    ['project']: false,
    ['opportunity']: false,
    ['collaboration-question']: false,
    ['survey-question']: false,
    ['event']: false,
    ['update']: true, // a create equals a publish for this model
  };
  resolvers['entry.update'] = {
    ['project']: true,
    ['opportunity']: false,
    ['collaboration-question']: false,
    ['survey-question']: false,
    ['event']: false,
    ['update']: true, // an update equals a update & publish for this model
  };
  resolvers['entry.delete'] = {
    ['project']: false,
    ['opportunity']: false,
    ['collaboration-question']: false,
    ['survey-question']: false,
    ['event']: false,
    ['update']: false,
  };
  resolvers['entry.publish'] = {
    ['project']: true,
    ['opportunity']: true,
    ['collaboration-question']: true,
    ['survey-question']: true,
    ['event']: true,
    ['update']: true, // no publish event for this model but set to true just in case
  };
  resolvers['entry.unpublish'] = {
    ['project']: false,
    ['opportunity']: false,
    ['collaboration-question']: false,
    ['survey-question']: false,
    ['event']: true,
    ['update']: false, // no un-publish event for this model but set to false just in case
  };

  if (resolvers[event][model]) {
    return resolvers[event][model];
  } else {
    logger.error('No resolver found for event: ' + event + ' and model: ' + model);
    return false;
  }
};

export const evalPushNotificationRules = async (
  event: string,
  model: string,
  entry: { id: string | number },
): Promise<NotificationResolverResult> => {
  const resolvers: Resolver = {};
  resolvers['project'] = {
    buildPushNotifications: async () => {
      const followers = await getProjectFollowers(dbClient, entry.id.toString());
      // Ignore possible erros...
      return await Promise.all(
        followers.map(async ({ followedBy }) => {
          return {
            subscriptions: await getPushSubscriptionsForUser(dbClient, followedBy),
            userId: followedBy,
            notification: {
              topic: 'project',
              body: 'Ein Projekt, dem du folgst, wurde kürzlich aktualisiert.',
              url: `/projects/${entry.id}`,
            },
          };
        }),
      );
    },
    shouldNotify: () => shouldNotifyResolver(event, model),
  };
  resolvers['opportunity'] = {
    buildPushNotifications: async () => {
      const followers = await getProjectFollowers(dbClient, entry.id.toString());
      // Ignore possible erros...
      return await Promise.all(
        followers.map(async ({ followedBy }) => {
          return {
            subscriptions: await getPushSubscriptionsForUser(dbClient, followedBy),
            userId: followedBy,
            notification: {
              topic: 'opportunity',
              body: 'Eine neue Opportunity wurde kürzlich zu einem Projekt dem du folgst hinzugefügt.',
            },
          };
        }),
      );
    },
    shouldNotify: () => shouldNotifyResolver(event, model),
  };
  resolvers['collaboration-question'] = {
    buildPushNotifications: async () => {
      const followers = await getProjectFollowers(dbClient, entry.id.toString());
      // Ignore possible erros...
      return await Promise.all(
        followers.map(async ({ followedBy }) => {
          return {
            subscriptions: await getPushSubscriptionsForUser(dbClient, followedBy),
            userId: followedBy,
            notification: {
              topic: 'collaboration-question',
              body: 'Eine neue Frage wurde kürzlich zu einem Projekt dem du folgst hinzugefügt.',
            },
          };
        }),
      );
    },
    shouldNotify: () => shouldNotifyResolver(event, model),
  };
  resolvers['survey-question'] = {
    buildPushNotifications: async () => {
      const followers = await getProjectFollowers(dbClient, entry.id.toString());
      // Ignore possible erros...
      return await Promise.all(
        followers.map(async ({ followedBy }) => {
          return {
            subscriptions: await getPushSubscriptionsForUser(dbClient, followedBy),
            userId: followedBy,
            notification: {
              topic: 'survey-question',
              body: 'Eine neue Umfrage wurde kürzlich zu einem Projekt dem du folgst hinzugefügt.',
            },
          };
        }),
      );
    },
    shouldNotify: () => shouldNotifyResolver(event, model),
  };
  resolvers['event'] = {
    buildPushNotifications: async () => {
      const allSubscriptions = await getAllPushSubscriptions(dbClient);
      return allSubscriptions.map((subscription) => {
        return {
          subscriptions: subscription.subscriptions,
          userId: subscription.userId,
          notification: {
            topic: 'event',
            body: `Ein neues Event wurde kürzlich hinzugefügt.`,
          },
        };
      });
    },
    shouldNotify: () => shouldNotifyResolver(event, model),
  };
  resolvers['update'] = {
    buildPushNotifications: async () => {
      const allSubscriptions = await getAllPushSubscriptions(dbClient);
      return allSubscriptions.map((subscription) => {
        return {
          subscriptions: subscription.subscriptions,
          userId: subscription.userId,
          notification: {
            topic: 'update',
            body: `Ein neues Update wurde hinzugefügt.`,
          },
        };
      });
    },
    shouldNotify: () => shouldNotifyResolver(event, model),
  };
  if (resolvers[model]) {
    return resolvers[model];
  } else {
    logger.error('No resolver found for model: ' + model);
    return { shouldNotify: () => false, buildPushNotifications: () => [] };
  }
};
