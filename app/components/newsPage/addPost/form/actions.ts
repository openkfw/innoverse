'use server';

import { StatusCodes } from 'http-status-codes';

import { User, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { addPost } from '@/services/postService';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { validateParams } from '@/utils/validationHelper';

import { PostFormData } from './AddPostForm';
import { handlePostSchema } from './validationSchema';

const logger = getLogger();

export const handlePost = withAuth(async (user: UserSession, body: Omit<PostFormData, 'authorId' | 'author'>) => {
  const validatedParams = validateParams(handlePostSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const author = (await getInnoUserByProviderId(user.providerId)) as User;
    if (author) {
      const newPost = await addPost({ content: body.content, user, anonymous: body.anonymous });
      if (newPost) {
        return {
          status: StatusCodes.OK,
          data: {
            ...newPost,
            author,
          },
        };
      }
    }
    const error: InnoPlatformError = strapiError(
      `Creating a post by user ${user.providerId}`,
      {
        info: 'InnoUser does not exist',
      } as RequestError,
      body.content,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: 'Creating a project update failed',
    };
  }

  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
    message: validatedParams.message,
  };
});
