'use server';

import { Comment, ObjectType, UserSession } from '@/common/types';
import { addCommentToDb, deleteCommentInDb, getCommentResponseCount } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { updateCollaborationCommentInCache } from '@/services/collaborationCommentService';
import getLogger from '@/utils/logger';

type AddResponse = {
  user: UserSession;
  text: string;
  comment: Comment;
};

type DeleteResponse = {
  user: UserSession;
  response: {
    id: string;
  };
};

const logger = getLogger();

export const addCollaborationCommentResponse = async ({ user, text, comment }: AddResponse) => {
  const createdResponse = await addCommentToDb({
    client: dbClient,
    objectId: comment.objectId,
    objectType: ObjectType.COMMENT,
    author: user.providerId,
    text,
    parentId: comment.id,
  });
  const responseCount = await getCommentResponseCount(dbClient, comment.id);
  await updateCollaborationCommentInCache({ user, comment: { id: comment.id, responseCount } });
  return createdResponse;
};

export const deleteCollaborationCommentResponse = async ({ user, response }: DeleteResponse) => {
  const deletedResponse = await deleteCommentInDb(dbClient, response.id);
  if (deletedResponse.parentId) {
    const responseCount = await getCommentResponseCount(dbClient, deletedResponse.parentId);
    await updateCollaborationCommentInCache({ user, comment: { id: deletedResponse.parentId, responseCount } });
  } else {
    logger.info('no parentID'); //todo test
  }
};
