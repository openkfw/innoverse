import { ResultOf } from 'gql.tada';

import { ProjectUpdate } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { ProjectUpdateFragment } from '@/utils/requests/updates/queries';

export async function mapToProjectUpdates(updates: ResultOf<typeof ProjectUpdateFragment>[] | undefined) {
  return updates?.map(mapToProjectUpdate) ?? [];
}

export function mapToProjectUpdate(updateData: ResultOf<typeof ProjectUpdateFragment>): ProjectUpdate {
  const attributes = updateData.attributes;
  const author = attributes.author?.data;
  const project = attributes.project?.data;
  const projectName = project?.attributes.title;

  if (!author) {
    throw new Error('Update contained no author');
  }

  return {
    id: updateData.id,
    projectId: project?.id ?? '',
    projectName: projectName ?? '',
    title: project?.attributes.title ?? '',
    comment: attributes.comment,
    updatedAt: toDate(attributes.updatedAt),
    topic: attributes.topic as string,
    author: mapToUser(author),
    linkToCollaborationTab: updateData.attributes.linkToCollaborationTab ?? false,
  };
}
