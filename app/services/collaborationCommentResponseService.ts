'use server';

import { UserSession } from '@/common/types';
import { addCollaborationCommentResponseToDb } from '@/repository/db/collaboration_comment_response';
import { addCommentToDb, deleteCommentInDb, getCommentResponseCount } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { updateCollaborationCommentInCache } from '@/services/collaborationCommentService';

type AddResponse = {
  user: UserSession;
  response: string;
  comment: {
    id: string;
  };
};

type DeleteResponse = {
  user: UserSession;
  response: {
    id: string;
  };
};

export const addCollaborationCommentResponse = async ({ user, response, comment }: AddResponse) => {
  const createdResponse = await addCommentToDb({client: dbClient, author: user.providerId, response, comment.id});
  const responseCount = await getCommentResponseCount(dbClient, comment.id);
  await updateCollaborationCommentInCache({ user, comment: { id: comment.id, responseCount } });
  return createdResponse;
};

export const deleteCollaborationCommentResponse = async ({ user, response }: DeleteResponse) => {
  const deletedResponse = await deleteCommentInDb(dbClient, response.id);
  const responseCount = await getCommentResponseCount(dbClient, deletedResponse.commentId); //todo replace commentId with parentId
  await updateCollaborationCommentInCache({ user, comment: { id: deletedResponse.commentId, responseCount } });
};
