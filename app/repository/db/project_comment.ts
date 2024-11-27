import { PrismaClient } from '@prisma/client';

//todo use the comments.ts instead of these queries
export async function handleCommentUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  return client.$transaction(async (tx) => {
    const result = await tx.projectComment.findFirst({
      where: { id: commentId },
      select: {
        upvotedBy: true,
      },
    });

    const upvotes = result?.upvotedBy.filter((upvote) => upvote !== upvotedBy);
    if (result?.upvotedBy.includes(upvotedBy)) {
      return tx.projectComment.update({
        where: {
          id: commentId,
        },
        data: {
          upvotedBy: upvotes,
        },
      });
    }

    if (result) {
      return tx.projectComment.update({
        where: {
          id: commentId,
        },
        data: {
          upvotedBy: { push: upvotedBy },
        },
      });
    }
  });
}
