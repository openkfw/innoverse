'use server';

import { Mention, UpdateInnoUser, UploadImageResponse, User, UserSession } from '@/common/types';
import { clientConfig } from '@/config/client';
import { serverConfig } from '@/config/server';
import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapFirstToUser, mapFirstToUserOrThrow, mapToUser } from '@/utils/requests/innoUsers/mappings';
import {
  CreateInnoUserMutation,
  UpdateInnoUserMutation,
  UpdateInnoUserUsernameMutation,
} from '@/utils/requests/innoUsers/mutations';
import {
  GetAllInnoUsers,
  GetEmailsByUsernamesQuery,
  GetInnoUserByEmailQuery,
  GetInnoUserByProviderIdQuery,
  GetInnoUserByUsernameQuery,
  GetInnoUsersByProviderIdsQuery,
} from '@/utils/requests/innoUsers/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { FormData, request } from 'undici';

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
    return createdUser;
  } catch (err) {
    const error = strapiError('Create Inno User', err as RequestError, body.name);
    logger.error(error);
    throw error;
  }
}

export async function updateInnoUser(body: UpdateInnoUser) {
  try {
    const handleResponse = async (body: Omit<UpdateInnoUser, 'name'>) => {
      const response = await strapiGraphQLFetcher(UpdateInnoUserMutation, body);
      const userData = response.updateInnoUser;
      if (!userData) throw new Error('Response contained no user data');
      return mapToUser(userData);
    };
    const userImage = body.image.get('image');

    // if the userImage is null and the avatar was defined before, delete the avatar
    if (userImage === null && body.oldImageId) {
      await deleteFileImage(body.oldImageId);
      return await handleResponse({ ...body, avatarId: null });
    }

    // if the userImage is defined, upload the avatar
    if (userImage instanceof Blob) {
      if (body.oldImageId) {
        await deleteFileImage(body.oldImageId);
      }
      const uploadedImages = await uploadFileImage(userImage as Blob, `avatar-${body.name}`);
      const uploadedImage = uploadedImages ? uploadedImages[0] : null;
      return await handleResponse({ ...body, avatarId: uploadedImage && (uploadedImage.id as string) });
    }

    // if the image is not changed, update other user info
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
    console.error('Error fetching emails by usernames:', err);
    throw err;
  }
}

export async function getInnoUserByUsername(username: string): Promise<User | null> {
  try {
    const response = await strapiGraphQLFetcher(GetInnoUserByUsernameQuery, { username });
    const user = mapFirstToUser(response?.innoUsers);
    return user || null;
  } catch (error) {
    console.error('Error fetching user by username:', error);
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

async function getAllInnoUsers() {
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
    } catch (error) {
      logger.error('Error checking username existence:', error);
      throw error;
    }
  }

  return username;
}

async function uploadImage(imageUrl: string, fileName: string) {
  return await fetch(imageUrl)
    .catch((e) => {
      logger.error('Error while fetching image:', e);
      throw new Error('Error while fetching image');
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
        .catch((e) => {
          logger.error('Error while uploading image:', e);
          throw new Error('Error while uploading image');
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
  return await fetch(`${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload/files/${encodeURIComponent(imageId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${serverConfig.STRAPI_TOKEN}`,
    },
  })
    .catch((e) => {
      logger.error('Error while uploading image:', e);
      throw new Error('Error while uploading image');
    })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result as UploadImageResponse[];
    });
}

export async function fetchMentionData(search: string): Promise<Mention[]> {
  try {
    const data = await getAllInnoUserNames();

    const formattedData = data.map((user) => ({ username: user.username as string }));
    return formattedData.filter((user) => user.username?.toLowerCase().includes(search.toLowerCase()));
  } catch (error) {
    console.error('Failed to load users:', error);
    return [];
  }
}

export async function fetchEmailsByUsernames(usernames: string[]): Promise<string[]> {
  try {
    const emails = await getEmailsByUsernames(usernames);
    return emails;
  } catch (error) {
    console.error('Failed to fetch emails by usernames:', error);
    throw error;
  }
}

export async function fetchUserByUsername(username: string): Promise<User | null> {
  try {
    const userData = await getInnoUserByUsername(username);
    return userData;
  } catch (error) {
    console.error('Failed to fetch user by username:', error);
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
    .catch((e) => {
      logger.error('Error while uploading image:', e);
      throw new Error('Error while uploading image');
    })
    .then((response) => {
      return response.body.json();
    })
    .then((result) => {
      return result as UploadImageResponse[];
    });
}
