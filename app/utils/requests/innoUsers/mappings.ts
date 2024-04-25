import { ResultOf } from 'gql.tada';

import { User } from '@/common/types';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export function mapFirstToUser(users: ResultOf<typeof InnoUserFragment>[] | undefined): User {
  if (!users || !users.length) throw 'Response contained no users';
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
    image: mapToImageUrl(attributes.avatar),
  };
}
export function mapToImageUrl(image: { data: { attributes: { url: string } } | null } | null): string | undefined {
  if (!image?.data) return undefined;
  return `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes?.url}`;
}
