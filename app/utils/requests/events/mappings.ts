import { ResultOf } from 'gql.tada';

import { Event } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { EventFragment } from '@/utils/requests/events/queries';
import { mapToImageUrl, mapToUser } from '@/utils/requests/innoUsers/mappings';

export async function mapToEvents(events: ResultOf<typeof EventFragment>[] | undefined) {
  return events?.map(mapToEvent) ?? [];
}

export function mapToEvent(eventData: ResultOf<typeof EventFragment>): Event {
  const attributes = eventData.attributes;
  const author = attributes.author?.data;
  const projectId = attributes.project?.data?.id;
  const projectName = attributes.project?.data?.attributes.title;
  const endTime = attributes.endTime ?? attributes.startTime;
  const themes = attributes.Themes?.filter((t) => t?.theme).map((t) => t?.theme) as string[];

  return {
    id: eventData.id,
    title: attributes.title,
    projectName,
    description: attributes.description ?? undefined,
    startTime: new Date(attributes.startTime),
    endTime: new Date(endTime),
    author: author && author.attributes ? mapToUser(author) : undefined,
    image: mapToImageUrl(attributes.image),
    themes: themes,
    type: attributes.type ?? undefined,
    location: attributes.location ?? undefined,
    projectId: projectId ?? '',
    updatedAt: toDate(attributes.updatedAt),
  };
}
