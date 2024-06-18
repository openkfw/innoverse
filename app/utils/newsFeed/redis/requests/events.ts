import { getUnixTimestamp } from '@/utils/helpers';
import { RedisProjectEvent } from '@/utils/newsFeed/redis/models';
import { getEventsStartingFrom } from '@/utils/requests/events/requests';

//TODO: validate with zod as we solely rely on the fact that for now Events and RedisProjectEvent are equal.
export const getProjectsEvents = async ({ from }: { from: Date }): Promise<RedisProjectEvent[]> => {
  const events = (await getEventsStartingFrom({ from })) ?? [];
  return events?.map((event) => ({
    ...event,
    updatedAt: getUnixTimestamp(event.updatedAt),
    createdAt: getUnixTimestamp(event.createdAt),
    followedBy: [],
    reactions: [],
  }));
};
