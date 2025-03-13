import { ResultOf } from 'gql.tada';

import { ObjectType, Post } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { PostFragment } from '@/utils/requests/posts/queries';

export async function mapToPosts(updates: ResultOf<typeof PostFragment>[] | undefined) {
  return updates?.map(mapToPost) ?? [];
}

export function mapToPost(updateData: ResultOf<typeof PostFragment>): Post {
  const attributes = updateData.attributes;
  const author = attributes.author?.data;

  if (!author) {
    throw new Error('Update contained no author');
  }

  return {
    id: updateData.id,
    content: attributes.comment || '',
    updatedAt: toDate(attributes.updatedAt),
    createdAt: toDate(attributes.createdAt),
    author: mapToUser(author),
    anonymous: updateData.attributes.anonymous ?? false,
    objectType: ObjectType.POST,
    likedBy: [],
  };
}
