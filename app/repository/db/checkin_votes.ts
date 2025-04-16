import { PrismaClient } from '@prisma/client';

export async function getCheckinVotes(client: PrismaClient, checkinQuestionId: string) {
  return client.checkinVote.findMany({
    where: {
      checkinQuestionId,
    },
  });
}

export async function isCheckinQuestionVotedByToday(client: PrismaClient, checkinQuestionId: string, votedBy: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const vote = await client.checkinVote.findFirst({
    where: {
      checkinQuestionId,
      votedBy,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
  return vote !== null;
}

export async function getCheckinQuestionVoteHistory(client: PrismaClient, checkinQuestionId: string) {
  return client.checkinVote.findMany({
    where: {
      checkinQuestionId,
    },
  });
}

export async function addCheckinVotes(
  client: PrismaClient,
  votes: { checkinQuestionId: string; vote: number; votedBy: string }[],
) {
  return client.checkinVote.createMany({
    data: votes,
    skipDuplicates: true,
  });
}

export async function deleteCheckinVote(client: PrismaClient, checkinQuestionId: string, votedBy: string) {
  return client.checkinVote.deleteMany({
    where: {
      checkinQuestionId,
      votedBy,
    },
  });
}

export async function deleteAllCheckinVotes(client: PrismaClient, checkinQuestionId: string) {
  return client.checkinVote.deleteMany({
    where: {
      checkinQuestionId,
    },
  });
}
