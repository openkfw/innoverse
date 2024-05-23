'use server';

import { Event, EventWithAdditionalData, UserSession } from '@/common/types';
import dbClient from '@/repository/db/prisma/prisma';
import { countNumberOfReactions } from '@/repository/db/reaction';
import { mapToEvents } from '@/utils/requests/events/mappings';
import {
  GetEventsPageQuery,
  GetFutureEventCountQuery,
  GetFutureEventsPageQuery,
  GetPastEventsPageQuery,
  GetUpcomingEventsQuery,
} from '@/utils/requests/events/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { findReactionByUser } from '@/utils/requests/updates/requests';
import { strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { withAuth } from '@/utils/auth';
import { eventSchema } from '@/components/project-details/events/validationSchema';
import { validateParams } from '@/utils/validationHelper';
import { StatusCodes } from 'http-status-codes';

const logger = getLogger();

export async function getUpcomingEvents() {
  try {
    const now = new Date();
    const response = await strapiGraphQLFetcher(GetUpcomingEventsQuery, { now });
    const events = mapToEvents(response.events?.data);
    return events;
  } catch (err) {
    const error = strapiError('Getting upcoming events', err as Error);
    logger.error(error);
  }
}

export async function getCountOfFutureEvents(projectId: string) {
  try {
    const now = new Date();
    const response = await strapiGraphQLFetcher(GetFutureEventCountQuery, { projectId, now });
    return (response.events && response.events?.meta.pagination.total) ?? 0;
  } catch (err) {
    const error = strapiError('Getting count of future events', err as Error);
    logger.error(error);
  }
}

export async function getProjectEventsPage(
  projectId: string,
  pageSize: number,
  page: number,
  timeframe: 'past' | 'future' | 'all' = 'all',
) {
  try {
    const response = await requestEventsPage(projectId, timeframe, page, pageSize);
    const events = mapToEvents(response.events?.data);
    return events;
  } catch (err) {
    const error = strapiError('Getting all events', err as Error);
    logger.error(error);
  }
}

const requestEventsPage = async (
  projectId: string,
  timeframe: 'past' | 'future' | 'all',
  page: number,
  pageSize: number,
) => {
  switch (timeframe) {
    case 'future':
      return await strapiGraphQLFetcher(GetFutureEventsPageQuery, { projectId, now: new Date(), page, pageSize });
    case 'past':
      return await strapiGraphQLFetcher(GetPastEventsPageQuery, { projectId, now: new Date(), page, pageSize });
    case 'all':
      return await strapiGraphQLFetcher(GetEventsPageQuery, { projectId, page, pageSize });
  }
};

export async function getEventsWithAdditionalData(events: Event[]) {
  const getAdditionalData = events.map(getEventWithAdditionalData);
  const eventsWithAdditionalData = await getPromiseResults(getAdditionalData);
  return eventsWithAdditionalData;
}

export async function getEventWithAdditionalData(event: Event): Promise<EventWithAdditionalData> {
  const { data: reactionForUser } = await findReactionByUser({ objectType: 'EVENT', objectId: event.id });
  const reactionCountResult = await countNumberOfReactions(dbClient, 'EVENT', event.id);

  const reactionCount = reactionCountResult.map((r) => ({
    count: r._count.shortCode,
    emoji: {
      shortCode: r.shortCode,
      nativeSymbol: r.nativeSymbol,
    },
  }));

  return {
    ...event,
    reactionForUser: reactionForUser || undefined,
    reactionCount,
  };
}

export const countFutureEventsForProject = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const validatedParams = validateParams(eventSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
    }

    const countResult = await getCountOfFutureEvents(body.projectId);
    return { status: StatusCodes.OK, data: countResult };
  } catch (err) {
    const error = strapiError('Error fetching future events count for project', err as Error);
    logger.error(error);
    throw err;
  }
});
