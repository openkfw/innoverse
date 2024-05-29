import { ResultOf } from 'gql.tada';

import { ImageFormats, User } from '@/common/types';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';
import { clientConfig } from '@/config/client';

export function mapFirstToUser(users: ResultOf<typeof InnoUserFragment>[] | undefined): User | undefined {
  if (!users || !users.length) return undefined;
  const user = users[0];
  return mapToUser(user);
}

export function mapFirstToUserOrThrow(users: ResultOf<typeof InnoUserFragment>[] | undefined): User {
  if (!users || !users.length) throw new Error('Response contained no users');
  const user = users[0];
  return mapToUser(user);
}

export function mapToUser(userData: ResultOf<typeof InnoUserFragment>): User {
  const attributes = userData.attributes;

  return {
    id: userData.id,
    ...attributes,
    role: attributes.role ?? undefined,
    department: attributes.department ?? undefined,
    email: attributes.email ?? undefined,
    providerId: attributes.providerId ?? undefined,
    image: mapToAvatarUrl(attributes.avatar),
  };
}

export function mapToImageUrl(
  image: { data: { attributes: { url: string; formats: unknown } } | null } | null,
): ImageFormats | undefined {
  if (!image?.data) return undefined;
  const formats = image.data.attributes.formats as ImageFormats;
  if (!formats) {
    return undefined;
  }
  const mappedFormats = Object.fromEntries(
    Object.entries(formats).map(([key, value]) => [
      key,
      {
        ...value,
        url: `${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}${value.url}`,
      },
    ]),
  );
  return { ...mappedFormats };
}

export function mapToAvatarUrl(image: { data: { attributes: { url: string } } | null } | null): string | undefined {
  if (!image?.data) return undefined;
  return `${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`;
}
