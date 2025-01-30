'use server';

import { CollaborationComment, ObjectType, UserSession } from '@/common/types';
import { addCommentToDb, deleteCommentInDb, getCommentResponseCount } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { updateCollaborationCommentInCache } from '@/services/collaborationCommentService';
import getLogger from '@/utils/logger';
import { mapToComment } from '@/utils/requests/comments/mapping';

type AddResponse = {
  user: UserSession;
  text: string;
  comment: CollaborationComment;
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
    objectId: comment.projectId,
    objectType: ObjectType.PROJECT,
    additionalObjectType: ObjectType.COLLABORATION_QUESTION,
    additionalObjectId: comment.question?.id,
    author: user.providerId,
    text,
    parentId: comment.id,
  });
  const commentCount = await getCommentResponseCount(dbClient, comment.id);
  await updateCollaborationCommentInCache({ user, comment: { id: comment.id, commentCount } });
  return await mapToComment(createdResponse);
};

export const deleteCollaborationCommentResponse = async ({ user, response }: DeleteResponse) => {
  const deletedResponse = await deleteCommentInDb(dbClient, response.id);
  if (deletedResponse.parentId) {
    const commentCount = await getCommentResponseCount(dbClient, deletedResponse.parentId);
    await updateCollaborationCommentInCache({ user, comment: { id: deletedResponse.parentId, commentCount } });
  }
};
