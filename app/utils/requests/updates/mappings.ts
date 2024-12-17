import { ResultOf } from 'gql.tada';

import { ProjectUpdate } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { ProjectUpdateFragment } from '@/utils/requests/updates/queries';

export async function mapToProjectUpdates(updates: ResultOf<typeof ProjectUpdateFragment>[] | undefined) {
  return updates?.map(mapToProjectUpdate) ?? [];
}

export function mapToProjectUpdate(updateData: ResultOf<typeof ProjectUpdateFragment>): ProjectUpdate {
  const author = updateData.author;
  const project = updateData.project;
  const projectName = project?.title;

  if (!author) {
    throw new Error('Update contained no author');
  }

  return {
    id: updateData.documentId,
    projectId: project?.documentId ?? '',
    projectName: projectName ?? '',
    title: project?.title ?? '',
    comment: updateData.comment,
    updatedAt: toDate(updateData.updatedAt),
    topic: updateData.topic as string,
    author: mapToUser(author),
    linkToCollaborationTab: updateData.linkToCollaborationTab ?? false,
    anonymous: updateData.anonymous ?? false,
  };
}
