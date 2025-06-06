import { EmailPreferences, Prisma, PrismaClient } from '@prisma/client';

export type EmailPreferencesCreatePayload = Omit<EmailPreferences, 'id' | 'createdAt' | 'updatedAt'>;

export const getEmailPreferencesForUser = async (client: PrismaClient, userId: string) =>
  client.emailPreferences.findUnique({ where: { userId } });

export const updateEmailPreferencesForUser = async (
  client: PrismaClient,
  userId: string,
  payload: Prisma.EmailPreferencesUpdateInput,
) =>
  client.emailPreferences.update({
    where: { userId },
    data: payload,
  });

export const createEmailPreferencesForUser = async (client: PrismaClient, data: EmailPreferencesCreatePayload) =>
  client.emailPreferences.create({ data });

export const createEmailPreferencesForUsers = async (client: PrismaClient, data: EmailPreferencesCreatePayload[]) =>
  client.emailPreferences.createMany({ data });

export const emailPreferencesCount = async (client: PrismaClient) => client.emailPreferences.count();

export const collectWeeklyNotificationEmails = async (client: PrismaClient) =>
  client.emailPreferences.findMany({
    where: { weeklyEmail: true },
    select: { userId: true, email: true, username: true },
  });
