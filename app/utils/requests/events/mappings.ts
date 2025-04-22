import { ResultOf } from 'gql.tada';

import { Event, ObjectType } from '@/common/types';
import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import { toDate } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { EventFragment } from '@/utils/requests/events/queries';
import { mapToImageUrl, mapToUser } from '@/utils/requests/innoUsers/mappings';

const logger = getLogger();

export async function mapToEvents(events: ResultOf<typeof EventFragment>[] | undefined) {
  const mappedEvents = events?.map(mapToEvent) ?? [];
  return mappedEvents.filter((e) => e !== undefined) as Event[];
}

export function mapToEvent(eventData: ResultOf<typeof EventFragment>): Event | undefined {
  try {
    const author = eventData.author;
    const endTime = eventData.endTime ?? eventData.startTime;
    const themes = eventData.Themes?.filter((t) => t?.theme).map((t) => t?.theme) as string[];
    const project = eventData.project;

    if (!project) {
      throw new Error('Event contained no project data');
    }
    return {
      id: eventData.documentId,
      objectType: ObjectType.EVENT,
      title: eventData.title,
      projectId: project.documentId,
      projectName: project.title,
      description: eventData.description ?? undefined,
      startTime: new Date(eventData.startTime),
      endTime: new Date(endTime),
      author: author && author ? mapToUser(author) : undefined,
      image: mapToImageUrl(eventData.image),
      themes: themes,
      type: eventData.type ?? undefined,
      location: eventData.location ?? undefined,
      updatedAt: toDate(eventData.updatedAt),
    };
  } catch (err) {
    const error = strapiError('Mapping event', err as RequestError, eventData.documentId);
    logger.error(error);
  }
}
