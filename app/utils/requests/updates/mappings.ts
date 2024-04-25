import { ResultOf } from 'gql.tada';

import { ProjectUpdate } from '@/common/types';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { ProjectUpdateFragment } from '@/utils/requests/updates/queries';

export function mapToProjectUpdate(updateData: ResultOf<typeof ProjectUpdateFragment>): ProjectUpdate {
  const attributes = updateData.attributes;
  const author = attributes.author?.data;
  const project = attributes.project?.data;

  if (!author) throw 'Update  contained no author';

  return {
    id: updateData.id,
    projectId: project?.id ?? '',
    title: project?.attributes.title ?? '',
    comment: attributes.comment,
    updatedAt: attributes.updatedAt?.toString() ?? '',
    topic: attributes.topic as string,
    author: mapToUser(author),
  };
}
