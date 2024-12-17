'use server';

import { UserSession } from '@/common/types';
import {
  addCollaborationCommentResponseToDb,
  deleteCollaborationCommentResponseInDb,
  getCollaborationCommentResponseCount,
} from '@/repository/db/collaboration_comment_response';
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
  const createdResponse = await addCollaborationCommentResponseToDb(dbClient, user.providerId, response, comment.id);
  const commentCount = await getCollaborationCommentResponseCount(dbClient, comment.id);
  await updateCollaborationCommentInCache({ user, comment: { id: comment.id, commentCount } });
  return createdResponse;
};

export const deleteCollaborationCommentResponse = async ({ user, response }: DeleteResponse) => {
  const deletedResponse = await deleteCollaborationCommentResponseInDb(dbClient, response.id);
  const commentCount = await getCollaborationCommentResponseCount(dbClient, deletedResponse.commentId);
  await updateCollaborationCommentInCache({ user, comment: { id: deletedResponse.commentId, commentCount } });
};
