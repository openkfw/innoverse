import { ResultOf } from 'gql.tada';

import { Event } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { EventFragment } from '@/utils/requests/events/queries';
import { mapToImageUrl, mapToUser } from '@/utils/requests/innoUsers/mappings';

export async function mapToEvents(events: ResultOf<typeof EventFragment>[] | undefined) {
  return events?.map(mapToEvent) ?? [];
}

export function mapToEvent(eventData: ResultOf<typeof EventFragment>): Event {
  const author = eventData.author;
  const project = eventData.project;
  const projectId = project?.documentId;
  const projectName = project?.title;
  const endTime = eventData.endTime ?? eventData.startTime;
  const themes = eventData.Themes?.filter((t) => t?.theme).map((t) => t?.theme) as string[];

  return {
    id: eventData.documentId,
    title: eventData.title,
    projectName,
    description: eventData.description ?? undefined,
    startTime: new Date(eventData.startTime),
    endTime: new Date(endTime),
    author: author && author ? mapToUser(author) : undefined,
    image: mapToImageUrl(eventData.image),
    themes: themes,
    type: eventData.type ?? undefined,
    location: eventData.location ?? undefined,
    projectId: projectId ?? '',
    updatedAt: toDate(eventData.updatedAt),
  };
}
