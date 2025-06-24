'use server';

import { FormData, request } from 'undici';

import { Mention, UpdateInnoUser, UploadImageResponse, User, UserSession } from '@/common/types';
import { clientConfig } from '@/config/client';
import { serverConfig } from '@/config/server';
import { RequestError } from '@/entities/error';
import { updateEmailPreferencesForUser } from '@/repository/db/email_preferences';
import dbClient from '@/repository/db/prisma/prisma';
import { strapiError } from '@/utils/errors';
import { base64ToBlob, isBase64String } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapFirstToUser, mapFirstToUserOrThrow, mapToUser } from '@/utils/requests/innoUsers/mappings';
import {
  CreateInnoUserMutation,
  UpdateInnoUserMutation,
  UpdateInnoUserUsernameMutation,
} from '@/utils/requests/innoUsers/mutations';
import {
  GetAllInnoUsers,
  GetInnoUsersByIdsQuery,
  GetEmailsByUsernamesQuery,
  GetInnoUserByEmailQuery,
  GetInnoUserByProviderIdQuery,
  GetInnoUserByUsernameQuery,
  GetInnoUsersByProviderIdsQuery,
} from '@/utils/requests/innoUsers/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

const logger = getLogger();

export async function createInnoUser(body: Omit<UserSession, 'image'>, image?: string | null) {
  try {
    const username = await generateUniqueUsername(body.email);

    const uploadedImages = image ? await uploadImage(image, `avatar-${body.name}`) : null;
    const uploadedImage = uploadedImages ? uploadedImages[0] : null;

    const response = await strapiGraphQLFetcher(CreateInnoUserMutation, {
      ...body,
      username,
      avatarId: uploadedImage ? (uploadedImage.id as unknown as string) : null,
    });

    const userData = response.createInnoUser;
    if (!userData) throw new Error('Response contained no user data');
    const createdUser = mapToUser(userData);

    if (createdUser.email)
      await updateEmailPreferencesForUser(dbClient, userData.providerId, {
        email: createdUser.email,
        username,
        weeklyEmail: true,
      });

    return createdUser;
  } catch (err) {
    const error = strapiError('Create Inno User', err as RequestError, body.name);
    logger.error(error);
    throw error;
  }
}

export async function updateInnoUser(body: UpdateInnoUser) {
  try {
    const handleResponse = async (body: Omit<UpdateInnoUser, 'name' | 'image'>) => {
      const response = await strapiGraphQLFetcher(UpdateInnoUserMutation, body);
      const userData = response.updateInnoUser;
      if (!userData) throw new Error('Response contained no user data');
      return mapToUser(userData);
    };
    const { image: userImage } = body;
    const updateUserBody = { id: body.id, role: body.role, department: body.department };

    // If userImage is null and avatar existed, delete the avatar
    if (userImage === null && body.oldImageId) {
      await deleteFileImage(body.oldImageId);
      return await handleResponse({
        ...updateUserBody,
        avatarId: null,
      });
    }

    // If userImage is a defined base64 string, upload as avatar
    if (userImage && isBase64String(userImage)) {
      if (body.oldImageId) {
        await deleteFileImage(body.oldImageId);
      }
      const blobUserImage = await base64ToBlob(userImage);
      const uploadedImages = await uploadFileImage(blobUserImage, `avatar-${body.name}`);
      const uploadedImage = uploadedImages ? uploadedImages[0] : null;
      return await handleResponse({
        ...updateUserBody,
        avatarId: uploadedImage && (uploadedImage.id as string),
      });
    }
    // If image is unchanged, update only other user info
    return await handleResponse(body);
  } catch (err) {
    const error = strapiError('Update Inno User', err as RequestError, body.name);
    logger.error(error);
    throw error;
  }
}

export async function getInnoUserByEmail(email: string) {
  try {
    const response = await strapiGraphQLFetcher(GetInnoUserByEmailQuery, { email });
    const user = mapFirstToUser(response.innoUsers);
    return user;
  } catch (err) {
    const error = strapiError('Getting Inno user by email', err as RequestError, email);
    logger.error(error);
    throw error;
  }
}

export async function getInnoUserByProviderId(providerId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetInnoUserByProviderIdQuery, { providerId });
    const user = mapFirstToUserOrThrow(response.innoUsers);
    return user;
  } catch (err) {
    const error = strapiError('Getting Inno user by providerId', err as RequestError, providerId);
    logger.error(error);
    throw error;
  }
}

export async function getInnoUsersByProviderIds(providerIds: string[]) {
  try {
    const response = await strapiGraphQLFetcher(GetInnoUsersByProviderIdsQuery, { providerIds });
    return response.innoUsers?.map(mapToUser) ?? [];
  } catch (err) {
    const error = strapiError('Getting Inno user by providerId', err as RequestError, providerIds.join(', '));
    logger.error(error);
    throw error;
  }
}

export async function getEmailsByUsernames(usernames: string[]): Promise<string[]> {
  try {
    const response = await strapiGraphQLFetcher(GetEmailsByUsernamesQuery, { usernames });

    const emails = response.innoUsers
      ?.map((user) => user.email)
      .filter((email): email is string => email !== null && email !== undefined);

    return emails ?? [];
  } catch (err) {
    const error = strapiError('Getting Emails by username', err as RequestError, usernames.join(', '));
    logger.error(error);
    throw err;
  }
}

export async function getInnoUserByUsername(username: string): Promise<User | null> {
  try {
    const response = await strapiGraphQLFetcher(GetInnoUserByUsernameQuery, { username });
    const user = mapFirstToUser(response?.innoUsers);
    return user || null;
  } catch (err) {
    const error = strapiError('Getting Inno user by username', err as RequestError, username);
    logger.error(error);
    throw error;
  }
}

async function getAllInnoUserNames() {
  try {
    const response = await getAllInnoUsers();
    if (!response) {
      throw new Error('No users data available');
    }
    const users = response.map((user) => ({ username: user.username }));
    return users;
  } catch (err) {
    const error = strapiError('Getting All Inno users', err as RequestError);
    logger.error(error);
    throw err;
  }
}

export async function getAllInnoUsers() {
  try {
    const response = await strapiGraphQLFetcher(GetAllInnoUsers, { limit: 1000 });
    if (!response.innoUsers) {
      throw new Error('No users data available');
    }

    return response.innoUsers;
  } catch (err) {
    const error = strapiError('Getting All Inno users', err as RequestError);
    logger.error(error);
    throw err;
  }
}

export async function createInnoUserIfNotExist(body: Omit<UserSession, 'image'>, image?: string | null) {
  try {
    if (!body.email) throw new Error('User session does not contain email');

    const user = await getInnoUserByEmail(body.email);

    if (user) {
      if (!user.username || user.username.trim() === '') {
        const username = await generateUniqueUsername(body.email);
        await updateInnoUserUsername(user.id!, username);
        user.username = username;
      }
      return user;
    } else {
      return await createInnoUser(body, image);
    }
  } catch (err) {
    const error = strapiError('Trying to create or update an InnoUser', err as RequestError, body.name);
    logger.error(error);
    throw err;
  }
}

export async function updateInnoUserUsername(userId: string, username: string) {
  try {
    const response = await strapiGraphQLFetcher(UpdateInnoUserUsernameMutation, {
      id: userId,
      username,
    });

    const updatedUserData = response.updateInnoUser;
    if (!updatedUserData) throw new Error('Failed to update user username');

    return mapToUser(updatedUserData);
  } catch (err) {
    const error = strapiError('Updating Inno user username', err as RequestError, userId);
    logger.error(error);
    throw err;
  }
}

async function generateUniqueUsername(email: string): Promise<string> {
  const baseUsername = email.split('@')[0];
  let username = baseUsername;
  let count = 1;

  while (true) {
    try {
      const response = await strapiGraphQLFetcher(GetInnoUserByUsernameQuery, { username });
      if (!response?.innoUsers.length) break;

      username = `${baseUsername}${count}`;
      count++;
    } catch (err) {
      logger.error('Error checking username existence');
      throw err;
    }
  }

  return username;
}

async function uploadImage(imageUrl: string, fileName: string) {
  return await fetch(imageUrl)
    .catch((error) => {
      logger.error('Error while fetching image:', error);
      throw error;
    })
    .then((response) => {
      return response.blob();
    })
    .then(async function (myBlob) {
      const formData = new FormData();
      formData.append('files', myBlob, fileName);
      formData.append('ref', 'api::event.event');
      formData.append('field', 'image');
      return await request(`${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serverConfig.STRAPI_TOKEN}`,
        },
        body: formData,
      })
        .catch((uploadError) => {
          const error = strapiError('Failed to upload the image', uploadError as RequestError);
          logger.error(error);
          throw error;
        })
        .then((response) => {
          return response.body.json();
        })
        .then((result) => {
          return result as UploadImageResponse[];
        });
    });
}

export async function deleteFileImage(imageId: string) {
  return await fetch(`${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload/files/${imageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${serverConfig.STRAPI_TOKEN}`,
    },
  })
    .catch((uploadError) => {
      const error = strapiError('Deleting image', uploadError as RequestError, imageId);
      logger.error(error);
      throw error;
    })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    });
}

export async function fetchMentionData(search: string): Promise<Mention[]> {
  try {
    const data = await getAllInnoUserNames();

    const formattedData = data.map((user) => ({ username: user.username }));
    return formattedData.filter((user) => user.username?.toLowerCase().includes(search.toLowerCase()));
  } catch (error) {
    logger.error('Fetching mention data failed:', error);
    throw error;
  }
}

export async function fetchEmailsByUsernames(usernames: string[]): Promise<string[]> {
  try {
    const emails = await getEmailsByUsernames(usernames);
    return emails;
  } catch (error) {
    logger.error('Failed to fetch emails by usernames:', error);
    throw error;
  }
}

export async function fetchUserByUsername(username: string): Promise<User | null> {
  try {
    const userData = await getInnoUserByUsername(username);
    return userData;
  } catch (error) {
    logger.error('Failed to fetch user by username:', error);
    return null;
  }
}

export async function uploadFileImage(image: Blob, fileName: string) {
  const formData = new FormData();
  formData.append('files', image, fileName);
  formData.append('ref', 'api::event.event');
  formData.append('field', 'image');

  return await request(`${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serverConfig.STRAPI_TOKEN}`,
    },
    body: formData,
  })
    .catch((uploadError) => {
      const error = strapiError('Failed to upload the image', uploadError as RequestError);
      logger.error(error);
      throw error;
    })
    .then((response) => {
      return response.body.json();
    })
    .then((result) => {
      return result as UploadImageResponse[];
    });
}

export async function getInnoUsersByIds(ids: string[]): Promise<User[]> {
  try {
    const response = await strapiGraphQLFetcher(GetInnoUsersByIdsQuery, { ids });
    const users = response.innoUsers.map(mapToUser);
    return users;
  } catch (error) {
    logger.error('Failed to fetch users by ids:', error);
    throw error;
  }
}
