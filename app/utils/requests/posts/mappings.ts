import { ResultOf } from 'gql.tada';

import { ObjectType, Post } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { PostFragment } from '@/utils/requests/posts/queries';

export async function mapToPosts(posts: ResultOf<typeof PostFragment>[] | undefined) {
  return posts?.map(mapToPost) ?? [];
}

export function mapToPost(postData: ResultOf<typeof PostFragment>): Post {
  const author = postData.author;

  if (!author) {
    throw new Error('Post contained no author');
  }

  return {
    id: postData.documentId,
    comment: postData.comment || '',
    updatedAt: toDate(postData.updatedAt),
    createdAt: toDate(postData.createdAt),
    author: mapToUser(author),
    anonymous: postData.anonymous ?? false,
    objectType: ObjectType.POST,
    likedBy: [],
  };
}
