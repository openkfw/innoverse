'use server';

import { StatusCodes } from 'http-status-codes';

import { getEvents } from '@/utils/requests';

export const getUpcomingEvents = async () => {
  const today = new Date();
  const events = await getEvents(today);
  return {
    status: StatusCodes.OK,
    data: events,
  };
};
