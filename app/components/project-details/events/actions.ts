'use server';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { withAuth } from '@/utils/auth';
import {
  getCountOfFutureEvents,
  getEventsWithAdditionalData,
  getProjectEventsPage,
} from '@/utils/requests/events/requests';
import { validateParams } from '@/utils/validationHelper';

import { eventSchema, projectFilterSchema } from './validationSchema';

export const countFutureEventsForProject = withAuth(async (user: UserSession, body: { projectId: string }) => {
  const validatedParams = validateParams(eventSchema, body);

  if (validatedParams.status !== StatusCodes.OK) {
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  }

  const countResult = await getCountOfFutureEvents(body.projectId);
  return { status: StatusCodes.OK, data: countResult };
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
