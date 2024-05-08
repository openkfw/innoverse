'use server';

import { UserSession } from '@/common/types';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapFirstToUser, mapToUser } from '@/utils/requests/innoUsers/mappings';
import { CreateInnoUserMutation } from '@/utils/requests/innoUsers/mutations';
import { GetInnoUserByEmailQuery, GetInnoUserByProviderIdQuery } from '@/utils/requests/innoUsers/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

const logger = getLogger();

export async function createInnoUser(body: UserSession, image?: string | null) {
  try {
    const uploadedImages = image ? await uploadImage(image, `avatar-${body.name}`) : null;
    const uploadedImage = uploadedImages ? uploadedImages[0] : null;

    const response = await strapiGraphQLFetcher(CreateInnoUserMutation, {
      ...body,
      avatarId: uploadedImage ? uploadedImage.id : null,
    });

    const userData = response.createInnoUser?.data;
    if (!userData) throw 'Response contained no user data';

    const createdUser = mapToUser(userData);
    return createdUser;
  } catch (err) {
    const error = strapiError('Create Inno User', err as Error, body.name);
    logger.error(error);
  }
}

export async function getInnoUserByEmail(email: string) {
  try {
    const response = await strapiGraphQLFetcher(GetInnoUserByEmailQuery, { email });
    const user = mapFirstToUser(response.innoUsers?.data);
    return user;
  } catch (err) {
    const error = strapiError('Getting Inno user by email', err as Error, email);
    logger.error(error);
  }
}

export async function getInnoUserByProviderId(providerId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetInnoUserByProviderIdQuery, { providerId });
    const user = mapFirstToUser(response.innoUsers?.data);
    return user;
  } catch (err) {
    const error = strapiError('Getting Inno user by providerId', err as Error, providerId);
    logger.error(error);
    throw err;
  }
}

export async function createInnoUserIfNotExist(body: UserSession, image?: string | null) {
  try {
    if (body.email) {
      const user = await getInnoUserByEmail(body.email);
      return user ? user : await createInnoUser(body, image);
    }
  } catch (err) {
    const error = strapiError('Trying to create a InnoUser if it does not exist', err as Error, body.name);
    logger.error(error);
  }
}

async function uploadImage(imageUrl: string, fileName: string) {
  return fetch(imageUrl)
    .then((response) => response.blob())
    .then(async function (myBlob) {
      const formData = new FormData();
      formData.append('files', myBlob, fileName);
      formData.append('ref', 'api::event.event');
      formData.append('field', 'image');

      return fetch(`${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          return result;
        });
    });
}