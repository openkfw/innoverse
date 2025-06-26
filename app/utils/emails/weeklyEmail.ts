'use server';

import { render } from '@react-email/components';

import { ObjectType } from '@/common/types';
import { clientConfig } from '@/config/client';
import { serverConfig } from '@/config/server';
import { collectWeeklyNotificationEmails } from '@/repository/db/email_preferences';
import { getFollowsForUserIds } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import NotificationEmail from '@/utils/emails/notificationTemplate';
import { generateUnsubscribeUrl, sendBulkEmail } from '@/utils/emails/send';
import getLogger from '@/utils/logger';
import { getLatestPostsWithReactions } from '@/utils/requests/posts/requests';
import { getLatestNews } from '@/utils/requests/requests';
import { groupByLocale } from '@/utils/requests/singleTypes/mappings';
import { getEmailBaseTemplates, getWeeklyEmailTemplates } from '@/utils/requests/singleTypes/requests';

const baseImageUrl = clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT;
// TODO: use something else???
const baseUrl = serverConfig.NEXTAUTH_URL;

const logger = getLogger();

export async function sendWeeklyEmail() {
  const baseTemplates = groupByLocale(await getEmailBaseTemplates());
  const weeklyEmailTemplates = groupByLocale(await getWeeklyEmailTemplates());

  if (!baseTemplates || !weeklyEmailTemplates) {
    logger.error('No email templates found');
    return;
  }

  const latestPosts = await getLatestPostsWithReactions(5);

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const allNews = await getLatestNews(lastWeek);

  const users = (await collectWeeklyNotificationEmails(dbClient)).filter(
    (user): user is { [key in keyof typeof user]: NonNullable<(typeof user)[key]> } => !!user.email && !!user.username,
  );

  const follows = await getFollowsForUserIds(
    dbClient,
    ObjectType.PROJECT,
    users.map((user) => user.userId),
  );
  const followsByUserId = follows.reduce<Record<string, string[] | undefined>>((acc, follow) => {
    return { ...acc, [follow.followedBy]: [...(acc[follow.followedBy] ?? []), follow.objectId] };
  }, {});

  logger.info(`Sending weekly email to ${users.length} users`);

  const batches = batch(users, 100).map(async (userBatch) => {
    const emails = userBatch.map(async (user) => {
      const posts = latestPosts.map((post) => ({
        ...post,
        projectFollowed: post.followedBy?.map((follow) => follow.id).includes(user.userId),
        baseUrl,
        baseImageUrl,
      }));

      const news = allNews
        .filter(({ project }) => followsByUserId[user.userId]?.includes(project?.documentId ?? ''))
        .map((newsItem) => ({
          ...newsItem,
          projectFollowed: true,
          baseUrl,
          baseImageUrl,
        }))
        .slice(0, 5);

      const unsubscribeUrl = await generateUnsubscribeUrl(user.email, user.userId, user.username);
      const includeUnsubscribe = { unsubscribeUrl, emailSettingsUrl: `${baseUrl}/profile` };

      const lang = 'de'; //TODO: get the user's language
      const baseTemplate = baseTemplates[lang] ?? baseTemplates['en'];
      const weeklyEmailTemplate = weeklyEmailTemplates[lang] ?? weeklyEmailTemplates['en'];
      const content = {
        ...baseTemplate,
        ...weeklyEmailTemplate,
        lang,
        preview: weeklyEmailTemplate.preview ?? weeklyEmailTemplate.headerSubtitle,
      };
      const html = await NotificationEmail({ baseUrl, baseImageUrl, includeUnsubscribe, content, posts, news });
      const body = await render(html);

      const subject = weeklyEmailTemplate.subject ?? weeklyEmailTemplate.headerTitle;
      const from = serverConfig.NOTIFICATION_EMAIL_FROM;
      const mailOpts = {
        list: { unsubscribe: { url: unsubscribeUrl, comment: baseTemplate.footerUnsubscribe } },
      };

      return { from, to: user.email, subject, body, opts: mailOpts };
    });
    return sendBulkEmail(await Promise.all(emails));
  });
  await Promise.all(batches);
  logger.info(`Weekly email sent to ${users.length} users`);
}

function batch<T>(arr: T[], batchSize = 10): T[][] {
  return arr.length ? [arr.slice(0, batchSize), ...batch(arr.slice(batchSize), batchSize)] : [];
}
