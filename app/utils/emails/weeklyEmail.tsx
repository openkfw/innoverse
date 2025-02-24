import { serverConfig } from '@/config/server';
import { collectWeeklyNotificationEmails } from '@/repository/db/email_preferences';
import dbClient from '@/repository/db/prisma/prisma';
import NotificationEmail from '@/utils/emails/notificationTemplate';
import { generateUnsubscribeUrl, sendEmail } from '@/utils/emails/send';

export async function sendWeeklyEmail() {
  const users = (await collectWeeklyNotificationEmails(dbClient)).filter(
    (user): user is { userId: string; email: string; username: string } => !!user.email && !!user.username,
  );
  console.log('Sending weekly email to', users.length, 'users');
  for (const userBatch of batch(users)) {
    await Promise.all(
      userBatch.map(async (user) => {
        const unsubscribeUrl = await generateUnsubscribeUrl(user.email, user.userId, user.username);
        const emailSettingsUrl = `${serverConfig.NEXTAUTH_URL}/profile`;
        const includeUnsubscribe = { unsubscribeUrl, emailSettingsUrl };
        const lang = 'de'; //TODO: get the user's language
        const posts: { id: number; content: string }[] = []; //TODO: get the posts
        const news: { id: number; content: string }[] = []; //TODO: get the news

        const html = NotificationEmail({ includeUnsubscribe, lang, posts, news });
        const subject = 'Weekly News and Initiatives Notifications';
        const from = `"InnoVerse" <${serverConfig.EMAIL_FROM ?? serverConfig.EMAIL_USER}>`;
        const mailOpts = {
          list: { unsubscribe: { url: unsubscribeUrl, comment: 'Unsubscribe from Email notifications' } },
        };

        return sendEmail(from, user.email, subject, html, mailOpts);
      }),
    );
  }
  console.log('Weekly email sent to', users.length, 'users');
}

function batch<T>(arr: T[], batchSize = 10): T[][] {
  return arr.length ? [arr.slice(0, batchSize), ...batch(arr.slice(batchSize), batchSize)] : [];
}
