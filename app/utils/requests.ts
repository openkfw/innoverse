import { UserSession } from '@/common/types';

import { CreateInnoUserQuery, GetInnoUserByEmailQuery, STRAPI_QUERY, withResponseTransformer } from './queries';

async function uploadImage(imageUrl: string, fileName: string) {
  return fetch(imageUrl)
    .then((response) => response.blob())
    .then(async function (myBlob) {
      const formData = new FormData();
      formData.append('files', myBlob, fileName);
      formData.append('ref', 'api::event.event');
      formData.append('field', 'image');

      return fetch('/api/strapi/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          return result;
        });
    });
}

export async function createInnoUser(body: UserSession) {
  try {
    const uploadedImages = await uploadImage(body.image, `avatar-${body.name}`);
    const uploadedImage = uploadedImages ? uploadedImages[0] : null;

    const requestUser = await fetch('/api/strapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        query: CreateInnoUserQuery,
        variables: { ...body, avatarId: uploadedImage ? uploadedImage.id : null },
      }),
      next: { revalidate: 60 * 2 },
    });
    const resultUser = withResponseTransformer(STRAPI_QUERY.CreateInnoUser, await requestUser.json());

    return {
      ...resultUser,
    };
  } catch (err) {
    console.info(err);
  }
}

export async function getInnoUserByEmail(email: string) {
  try {
    const requestUser = await fetch('/api/strapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        query: GetInnoUserByEmailQuery,
        variables: { email },
      }),
      next: { revalidate: 60 * 2 },
    });
    const resultUser = withResponseTransformer(STRAPI_QUERY.GetInnoUserByEmail, await requestUser.json());

    return {
      ...resultUser,
    };
  } catch (err) {
    console.info(err);
  }
}
