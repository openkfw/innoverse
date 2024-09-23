'use server';

import { StatusCodes } from 'http-status-codes';

import { Event, EventWithAdditionalData, ObjectType, StartPagination, UserSession } from '@/common/types';
import { eventSchema, projectFilterSchema } from '@/components/project-details/events/validationSchema';
import { RequestError } from '@/entities/error';
import dbClient from '@/repository/db/prisma/prisma';
import { countNumberOfReactions, getReactionsForEntity } from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapToEvent, mapToEvents } from '@/utils/requests/events/mappings';
import {
  GetEventByIdQuery,
  GetEventsPageQuery,
  GetEventsStartingFromQuery,
  GetFutureEventCountQuery,
  GetFutureEventsPageQuery,
  GetPastEventsPageQuery,
  GetUpcomingEventsQuery,
} from '@/utils/requests/events/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { findReactionByUser } from '@/utils/requests/updates/requests';
import { validateParams } from '@/utils/validationHelper';

const logger = getLogger();

export async function getEventById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetEventByIdQuery, { id });
    if (!response.event?.data) return null;
    const event = mapToEvent(response.event.data);
    return event;
  } catch (err) {
    const error = strapiError('Getting event by id', err as RequestError, id);
    logger.error(error);
  }
}

export async function getEventByIdWithReactions(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetEventByIdQuery, { id });
    if (!response.event?.data) throw new Error('Response contained no event');
    const event = mapToEvent(response.event.data);
    const reactions = await getReactionsForEntity(dbClient, ObjectType.EVENT, event.id);
    return { ...event, reactions };
  } catch (err) {
    const error = strapiError('Getting project update', err as RequestError);
    logger.error(error);
  }
}

export async function getEventsStartingFrom({ from, page, pageSize }: StartPagination) {
  try {
    const response = await strapiGraphQLFetcher(GetEventsStartingFromQuery, { from, page, pageSize });
    const events = mapToEvents(response.events?.data);
    return events;
  } catch (err) {
    const error = strapiError('Getting upcoming events', err as RequestError);
    logger.error(error);
  }
}

export async function getUpcomingEvents() {
  try {
    const now = new Date();
    const response = await strapiGraphQLFetcher(GetUpcomingEventsQuery, { now });
    const events = mapToEvents(response.events?.data);
    return events;
  } catch (err) {
    const error = strapiError('Getting upcoming events', err as RequestError);
    logger.error(error);
  }
}

export async function getCountOfFutureEvents(projectId: string) {
  try {
    const now = new Date();
    const response = await strapiGraphQLFetcher(GetFutureEventCountQuery, { projectId, now });
    return (response.events && response.events?.meta.pagination.total) ?? 0;
  } catch (err) {
    const error = strapiError('Getting count of future events', err as RequestError);
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
    const error = strapiError('Getting all events', err as RequestError);
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

export async function getEventWithAdditionalData(
  item: Event | EventWithAdditionalData,
): Promise<EventWithAdditionalData> {
  try {
    const { data: reactionForUser } = await findReactionByUser({ objectType: ObjectType.EVENT, objectId: item.id });
    const reactionCountResult = await countNumberOfReactions(dbClient, ObjectType.EVENT, item.id);

    const reactionCount = reactionCountResult.map((r) => ({
      count: r._count.shortCode,
      emoji: {
        shortCode: r.shortCode,
        nativeSymbol: r.nativeSymbol,
      },
    }));

    return {
      ...item,
      reactionForUser: reactionForUser
        ? { ...reactionForUser, objectType: reactionForUser.objectType as ObjectType }
        : null,
      reactionCount,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting additional data for event with id: ${item.id}`,
      err as Error,
      item.id,
    );
    logger.error(error);
    throw err;
  }
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
    const error = strapiError('Error fetching future events count for project', err as RequestError);
    logger.error(error);
    throw err;
  }
});

export const getAllEventsForProjectFilter = withAuth(
  async (
    user: UserSession,
    body: {
      projectId: string;
      amountOfEventsPerPage: number;
      currentPage: number;
      timeframe: 'past' | 'future' | 'all';
    },
  ) => {
    const validatedParams = validateParams(projectFilterSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
    }

    const events = await getProjectEventsPage(
      body.projectId,
      body.amountOfEventsPerPage,
      body.currentPage,
      body.timeframe,
    );
    const eventsWithAdditionalData = await getEventsWithAdditionalData(events ?? []);
    return { status: StatusCodes.OK, data: eventsWithAdditionalData };
  },
);
