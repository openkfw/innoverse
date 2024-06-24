import { Reaction as PrismaReaction } from '@prisma/client';

import { SxProps } from '@mui/material/styles';

import { ImageFormats, NewsFeedEntry, ObjectType, Reaction } from '@/common/types';

export const sortDateByCreatedAt = <T extends { createdAt: Date }>(array: T[]): T[] => {
  return array.sort((d1: T, d2: T) => d1.createdAt.getTime() - d2.createdAt.getTime());
};

export function getFulfilledResults<T>(results: PromiseSettledResult<T>[]) {
  return results
    .filter((result): result is PromiseFulfilledResult<T> => result.status === 'fulfilled')
    .map((result) => result.value);
}

export async function getPromiseResults<T>(promises: Promise<T>[]) {
  const results = await Promise.allSettled(promises);
  return getFulfilledResults(results);
}

export const groupBy = <T, K extends (string | number | symbol) & keyof T>(array: T[], key: K) => {
  const map = new Map<T[K], T[]>();

  for (const item of array) {
    const value = item[key];
    if (!map.has(value)) {
      map.set(value, []);
    }
    map.get(value)!.push(item);
  }

  const result: { key: T[K]; items: T[] }[] = [];
  map.forEach((items, key) => {
    result.push({ key, items });
  });

  return result;
};

export async function processAsBatch<T, R>(
  items: Array<T>,
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<Array<R>> {
  let results: Array<R> = [];
  for (let start = 0; start < items.length; start += limit) {
    const end = start + limit > items.length ? items.length : start + limit;

    const slicedResults = await Promise.all(items.slice(start, end).map(fn));

    results = [...results, ...slicedResults];
  }

  return results;
}

export const mergeStyles = (primary: SxProps | undefined, overrides: SxProps | undefined): SxProps => {
  return [primary, ...(Array.isArray(overrides) ? overrides : [overrides])];
};

export function formatDate(dateString: string | Date, locale = 'de-DE') {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return null;
  }

  const date = new Date(dateString);
  const day = date.toLocaleString(locale, { day: 'numeric' });
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });
  return `${day}. ${month} ${year}`;
}

export function formatTimestamp(timestamp: number, locale = 'de-DE'): string | null {
  if (!timestamp || isNaN(timestamp)) {
    return null;
  }

  const date = new Date(timestamp);
  const day = date.toLocaleString(locale, { day: 'numeric' });
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });
  return `${day}. ${month} ${year}`;
}

export function getProviderLabel(provider: { name: string; id: string }) {
  return provider.id === 'azure-ad' ? `Mit ***STRING_REMOVED***  Account einloggen` : `Mit ${provider.name.split(' ')[0]} einloggen`;
}

export function getImageByBreakpoint(isSmallScreen: boolean, image?: ImageFormats) {
  if (!image || !image.small || !image.large) {
    return undefined;
  }
  return isSmallScreen ? image.small?.url : image.large?.url;
}

export const mapObjectWithReactions = <T extends { reactions: PrismaReaction[] }>(item: T) => {
  return {
    ...item,
    reactions: item.reactions as Reaction[],
  };
};

export const getNewsTypeProjectName = (entry: NewsFeedEntry) => {
  const { type, item } = entry;
  if (type === ObjectType.PROJECT) {
    return item.title;
  } else if (
    type === ObjectType.EVENT ||
    type === ObjectType.UPDATE ||
    type === ObjectType.SURVEY_QUESTION ||
    type === ObjectType.COLLABORATION_QUESTION
  ) {
    return item.projectName;
  }
  return null;
};

export const getNewsTypeProjectId = (entry: NewsFeedEntry) => {
  const { type, item } = entry;
  if (type === ObjectType.PROJECT) {
    return item.id;
  } else if (
    type === ObjectType.EVENT ||
    type === ObjectType.UPDATE ||
    type === ObjectType.SURVEY_QUESTION ||
    type === ObjectType.COLLABORATION_QUESTION
  ) {
    return item.projectId;
  }
  return null;
};

export const getUnixTimestamp = (date: Date | undefined) =>
  date ? Math.floor(date.getTime() / 1000) : Math.floor(new Date().getTime() / 1000);
export const unixTimestampToDate = (unixTimestamp: number | undefined) =>
  unixTimestamp ? new Date(unixTimestamp * 1000) : new Date();
export const toDate = (date: string | Date | null) => (date ? new Date(date) : new Date());
