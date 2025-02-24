import { ResultOf } from 'gql.tada';

import { ImageFormats, User } from '@/common/types';
import { clientConfig } from '@/config/client';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

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
  return {
    id: userData.documentId,
    name: userData.name,
    username: userData.username ?? undefined,
    role: userData.role ?? undefined,
    department: userData.department ?? undefined,
    email: userData.email ?? undefined,
    providerId: userData.providerId ?? undefined,
    image: mapToAvatarUrl(userData.avatar),
  };
}

export function mapToImageUrl(image: { url: string; formats: unknown } | null): ImageFormats | undefined {
  if (!image) return undefined;
  const formats = image.formats as ImageFormats;
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

export function mapToAvatarUrl(image: { url: string } | null): string | undefined {
  if (!image) return undefined;
  return `${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.url}`;
}
