'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { createPost, updatePost } from '@/services/postService';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { validateAndReturn } from '@/utils/validationHelper';

import { PostFormData } from './AddPostForm';
import { handleCreatePostSchema, handleUpdatePostSchema } from './validationSchema';

const logger = getLogger();

const createInnoPlatformError = (userId: string, message: string): InnoPlatformError => {
  return strapiError(`Creating a post by user ${userId}`, { info: message } as RequestError);
};

const getAuthorOrError = async (user: UserSession) => {
  const author = await getInnoUserByProviderId(user.providerId);
  if (!author) {
    const error = createInnoPlatformError(user.providerId, 'InnoUser does not exist');
    logger.error(error);
    return null;
  }
  return author;
};

export const handleCreatePost = withAuth(async (user, body: Omit<PostFormData, 'authorId' | 'author'>) => {
  const validated = validateAndReturn<Omit<PostFormData, 'authorId' | 'author'>>(handleCreatePostSchema, body);
  if (!validated.isValid) return validated.response;
  const author = await getAuthorOrError(user);
  if (!author) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: 'Creating a post failed',
    };
  }
  const newPost = await createPost({ ...body, authorId: author.id as string });
  if (!newPost) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: 'Creating a post failed',
    };
  }
  return {
    status: StatusCodes.OK,
    data: {
      ...newPost,
      author,
    },
  };
});

export const handleUpdatePost = withAuth(async (user, body: { postId: string; comment: string }) => {
  const validated = validateAndReturn<{ comment: string; postId: string }>(handleUpdatePostSchema, body);
  if (!validated.isValid) return validated.response;

  const author = await getAuthorOrError(user);
  if (!author) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: 'Updating a post failed',
    };
  }
  const updatedPost = await updatePost({
    postId: body.postId,
    comment: body.comment,
    user: author,
  });
  if (!updatedPost) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: 'Updating a post failed',
    };
  }
  return {
    status: StatusCodes.OK,
    data: {
      ...updatedPost,
      author,
    },
  };
});
