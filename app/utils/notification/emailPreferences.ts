import { createEmailPreferencesForUsers, emailPreferencesCount } from '@/repository/db/email_preferences';
import dbClient from '@/repository/db/prisma/prisma';
import getLogger from '@/utils/logger';
import { getAllInnoUsers } from '@/utils/requests/innoUsers/requests';

const logger = getLogger();

export const populateEmailPreferencesForExistingUsers = async () => {
  logger.info('Populating email preferences for existing users');
  if ((await emailPreferencesCount(dbClient)) > 0) return;

  const users = await getAllInnoUsers();

  const emailPreferences = users.map((user) => ({
    userId: user.id,
    email: user.attributes.email,
    username: user.attributes.username,
    weekly: true,
  }));

  await createEmailPreferencesForUsers(dbClient, emailPreferences);
  logger.info('Email preferences populated');
};
