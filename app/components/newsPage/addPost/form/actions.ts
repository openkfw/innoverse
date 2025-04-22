'use server';

import { StatusCodes } from 'http-status-codes';

import { createPost, updatePost } from '@/services/postService';
import { withAuth } from '@/utils/auth';
import { getAuthorOrError } from '@/utils/requests/requests';
import { validateAndReturn } from '@/utils/validationHelper';

import { PostFormData } from './AddPostForm';
import { handleCreatePostSchema, handleUpdatePostSchema } from './validationSchema';

export const handlePostCreate = withAuth(async (user, body: Omit<PostFormData, 'authorId' | 'author'>) => {
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

export const handlePostUpdate = withAuth(async (user, body: { itemId: string; comment: string }) => {
  const validated = validateAndReturn<{ comment: string; itemId: string }>(handleUpdatePostSchema, body);
  if (!validated.isValid) return validated.response;

  const author = await getAuthorOrError(user);
  if (!author) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: 'Updating a post failed',
    };
  }
  const updatedPost = await updatePost({
    postId: body.itemId,
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
