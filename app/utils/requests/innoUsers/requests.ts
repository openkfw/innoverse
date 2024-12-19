'use server';

import { UploadImageResponse, UserSession } from '@/common/types';
import { clientConfig } from '@/config/client';
import { serverConfig } from '@/config/server';
import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapFirstToUser, mapFirstToUserOrThrow, mapToUser } from '@/utils/requests/innoUsers/mappings';
import { CreateInnoUserMutation, UpdateInnoUserMutation } from '@/utils/requests/innoUsers/mutations';
import { GetInnoUserByEmailQuery, GetInnoUserByProviderIdQuery } from '@/utils/requests/innoUsers/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { request, FormData } from 'undici';

const logger = getLogger();

export async function createInnoUser(body: Omit<UserSession, 'image'>, image?: string | null) {
  try {
    const uploadedImages = image ? await uploadImage(image, `avatar-${body.name}`) : null;
    const uploadedImage = uploadedImages ? uploadedImages[0] : null;

    const response = await strapiGraphQLFetcher(CreateInnoUserMutation, {
      ...body,
      avatarId: uploadedImage ? (uploadedImage.id as unknown as string) : null,
    });

    const userData = response.createInnoUser?.data;
    if (!userData) throw new Error('Response contained no user data');
    const createdUser = mapToUser(userData);
    return createdUser;
  } catch (err) {
    const error = strapiError('Create Inno User', err as RequestError, body.name);
    logger.error(error);
    throw error;
  }
}

export async function updateInnoUser(body: Omit<UserSession, 'image'> & { id: string; image: FormData | null }) {
  try {
    // TODO: check if the image was changed

    let uploadedImage: UploadImageResponse | null = null;
    if (body.image) {
      const image = body.image.get('image') as string;
      console.log('image', image);
      const uploadedImages = await uploadFileImage(image, `avatar-${body.name}`);
      uploadedImage = uploadedImages ? uploadedImages[0] : null;
    }

    const response = await strapiGraphQLFetcher(UpdateInnoUserMutation, {
      ...body,
      avatarId: uploadedImage ? (uploadedImage.id as unknown as string) : null,
    });

    const userData = response.updateInnoUser?.data;
    if (!userData) throw new Error('Response contained no user data');
    const updatedUser = mapToUser(userData);
    return updatedUser;
  } catch (err) {
    const error = strapiError('Update Inno User', err as RequestError, body.name);
    logger.error(error);
    throw error;
  }
}

export async function getInnoUserByEmail(email: string) {
  try {
    const response = await strapiGraphQLFetcher(GetInnoUserByEmailQuery, { email });
    const user = mapFirstToUser(response.innoUsers?.data);
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
    const user = mapFirstToUserOrThrow(response.innoUsers?.data);
    return user;
  } catch (err) {
    const error = strapiError('Getting Inno user by providerId', err as RequestError, providerId);
    logger.error(error);
    throw error;
  }
}

export async function createInnoUserIfNotExist(body: Omit<UserSession, 'image'>, image?: string | null) {
  try {
    if (!body.email) throw new Error('User session does not contain email');
    const user = await getInnoUserByEmail(body.email);
    return user ? user : await createInnoUser(body, image);
  } catch (err) {
    throw err;
  }
}

async function uploadImage(imageUrl: string, fileName: string) {
  return fetch(imageUrl)
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
      return request(`${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload`, {
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

export async function uploadFileImage(image: string, fileName: string) {
  const formData = new FormData();
  formData.append('file', image, fileName);
  formData.append('ref', 'api::event.event');
  formData.append('field', 'image');
  return request(`${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload`, {
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
