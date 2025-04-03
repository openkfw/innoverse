import { PrismaClient } from '@prisma/client';

export async function getCheckinVotes(client: PrismaClient, checkinQuestionId: string) {
  return client.checkinVote.findMany({
    where: {
      checkinQuestionId,
    },
  });
}

export async function getCheckinAndUserVote(client: PrismaClient, checkinQuestionId: string, votedBy: string) {
  return client.checkinVote.findFirst({
    where: {
      checkinQuestionId,
      votedBy,
    },
  });
}

export async function addCheckinVote(client: PrismaClient, checkinQuestionId: string, vote: number, votedBy: string) {
  return client.checkinVote.upsert({
    where: {
      votedBy_checkinQuestionId: {
        checkinQuestionId,
        votedBy,
      },
    },
    update: {
      checkinQuestionId,
      votedBy,
      vote,
    },
    create: {
      checkinQuestionId,
      votedBy,
      vote,
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
