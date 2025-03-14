import { ResultOf } from 'gql.tada';

import { ObjectType, ProjectUpdate } from '@/common/types';
import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import { toDate } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { ProjectUpdateFragment } from '@/utils/requests/updates/queries';

const logger = getLogger();

export async function mapToProjectUpdates(updates: ResultOf<typeof ProjectUpdateFragment>[] | undefined) {
  const mappedUpdates = updates?.map(mapToProjectUpdate) ?? [];
  return mappedUpdates.filter((e) => e !== undefined) as ProjectUpdate[];
}

export function mapToProjectUpdate(updateData: ResultOf<typeof ProjectUpdateFragment>): ProjectUpdate | undefined {
  try {
    const author = updateData.author;
    const project = updateData.project;

    if (!author) {
      throw new Error('Update contained no author');
    }
    if (!project) {
      throw new Error('Update contained no project data');
    }
    return {
      id: updateData.documentId,
      projectId: project.documentId,
      projectName: project.title,
      title: project.title,
      comment: updateData.comment,
      updatedAt: toDate(updateData.updatedAt),
      topic: updateData.topic as string,
      author: mapToUser(author),
      linkToCollaborationTab: updateData.linkToCollaborationTab ?? false,
      anonymous: updateData.anonymous ?? false,
      objectType: ObjectType.UPDATE,
    };
  } catch (err) {
    const error = strapiError('Mapping project update', err as RequestError, updateData.documentId);
    logger.error(error);
  }
}
