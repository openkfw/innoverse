'use server';

import { UserSession } from '@/common/types';
import { clientConfig } from '@/config/client';
import { serverConfig } from '@/config/server';
import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapFirstToUser, mapFirstToUserOrThrow, mapToUser } from '@/utils/requests/innoUsers/mappings';
import { CreateInnoUserMutation } from '@/utils/requests/innoUsers/mutations';
import { GetInnoUserByEmailQuery, GetInnoUserByProviderIdQuery } from '@/utils/requests/innoUsers/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { request, FormData } from 'undici';

const logger = getLogger();

export async function createInnoUser(body: Omit<UserSession, 'image'>, image?: string | null) {
  try {
    logger.debug('Image URL: ' + image);
    const uploadedImages = image ? await uploadImage(image, `avatar-${body.name}`) : null;
    const uploadedImage = uploadedImages ? uploadedImages[0] : null;
    logger.debug('uploadedImage' + JSON.stringify(uploadedImage));
    logger.debug(' imgs: ' + JSON.stringify(uploadedImages));
    const response = await strapiGraphQLFetcher(CreateInnoUserMutation, {
      ...body,
      avatarId: uploadedImage ? uploadedImage.id : null,
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
      logger.debug(response.status);
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
          logger.debug('Image uploading result: ' + JSON.stringify(result));
          return result as any;
        });
    });
}
