import { PrismaClient } from '@prisma/client';

export async function getSurveyVotes(client: PrismaClient, surveyQuestionId: string) {
  return client.surveyVote.findMany({
    where: {
      surveyQuestionId,
    },
  });
}

export async function handleSurveyQuestionVote(
  client: PrismaClient,
  projectId: string,
  surveyQuestionId: string,
  votedBy: string,
  vote: string,
) {
  return client.$transaction(async (tx) => {
    const result = await tx.surveyVote.findFirst({
      where: { projectId, surveyQuestionId, votedBy },
      select: {
        votedBy: true,
        vote: true,
      },
    });

    if (result?.votedBy) {
      await tx.surveyVote.deleteMany({
        where: {
          projectId,
          surveyQuestionId,
          votedBy,
        },
      });
    }

    if (result?.vote !== vote) {
      return await tx.surveyVote.create({
        data: {
          projectId,
          surveyQuestionId,
          votedBy,
          vote,
        },
      });
    }
  });
}

export async function getSuveyQuestionAndUserVote(client: PrismaClient, surveyQuestionId: string, votedBy: string) {
  return client.surveyVote.findFirst({
    where: {
      surveyQuestionId,
      votedBy,
    },
  });
}
