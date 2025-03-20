import { PrismaClient, SurveyVote } from '@prisma/client';

export async function getSurveyVotes(client: PrismaClient, surveyQuestionId: string) {
  return client.surveyVote.findMany({
    where: {
      surveyQuestionId,
    },
  });
}

export async function findUserSurveyVote(client: PrismaClient, surveyQuestionId: string, votedBy: string) {
  return client.surveyVote.findFirst({
    where: {
      surveyQuestionId,
      votedBy,
    },
  });
}

export async function handleSurveyQuestionVoteInDb(
  client: PrismaClient,
  projectId: string,
  surveyQuestionId: string,
  votedBy: string,
  vote: string,
): Promise<{ operation: 'updated' | 'deleted'; vote: SurveyVote }> {
  return await client.$transaction(async (tx) => {
    let operation: 'updated' | 'deleted' = 'updated';
    let result = await tx.surveyVote.findFirst({
      where: { projectId, surveyQuestionId, votedBy },
    });

    if (result?.votedBy) {
      operation = 'deleted';
      await tx.surveyVote.deleteMany({
        where: {
          projectId,
          surveyQuestionId,
          votedBy,
        },
      });
    }

    if (result?.vote !== vote) {
      operation = 'updated';
      result = await tx.surveyVote.create({
        data: {
          projectId,
          surveyQuestionId,
          votedBy,
          vote,
        },
      });
    }

    return {
      operation: operation,
      vote: result,
    };
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

export const updateSurveyVotesIds = async (client: PrismaClient, id: string, documentId: string) => {
  return await client.surveyVote.updateMany({
    where: {
      projectId: id,
    },
    data: {
      projectId: documentId,
    },
  });
};
