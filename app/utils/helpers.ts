import { Reaction as PrismaReaction } from '@prisma/client';

import { SxProps } from '@mui/material/styles';

import { ImageFormats, NewsFeedEntry, ObjectType, Reaction } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';

export const sortDateByCreatedAtAsc = <T extends { createdAt: Date }>(array: T[]): T[] => {
  return array.sort((d1: T, d2: T) => d1.createdAt.getTime() - d2.createdAt.getTime());
};

export const sortDateByCreatedAtDesc = <T extends { createdAt: Date }>(array: T[]): T[] => {
  return array.sort((d1: T, d2: T) => d2.createdAt.getTime() - d1.createdAt.getTime());
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

export const fetchPages = async <T>({
  fetcher,
  pageSize = 100,
}: {
  fetcher: (page: number, pageSize: number) => Promise<T[]>;
  pageSize?: number;
}): Promise<T[]> => {
  let pageNumber = 1;
  let itemsOnPage = 0;
  const items: T[] = [];

  while (pageNumber === 1 || itemsOnPage >= pageSize) {
    const page = await fetcher(pageNumber, pageSize);
    items.push(...page);
    itemsOnPage = page.length;
    pageNumber++;
  }

  return items;
};

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

function getFormattedDate(date: Date, locale: string) {
  const day = date.toLocaleString(locale, { day: 'numeric' });
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });

  return `${day}. ${month} ${year}`;
}

export function formatDate(dateString: string | Date, locale = 'de-DE') {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return null;
  }

  const date = new Date(dateString);
  return getFormattedDate(date, locale);
}

export function formatDateWithTimestamp(dateString: string | Date, locale = 'de-DE') {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return null;
  }

  const date = new Date(dateString);
  const formattedDate = getFormattedDate(date, locale);

  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${formattedDate} · ${hour}:${minute}`;
}

export function getProviderLabel(provider: { name: string; id: string }) {
  const providerName = provider.name.split(' ')[0];
  const label = m.app_login_option({ provider: providerName });
  return label;
}

export function getImageByBreakpoint(isSmallScreen: boolean, image?: ImageFormats) {
  if (!image) {
    return undefined;
  }
  if (!image.small?.url || !image.large?.url) {
    return image.thumbnail?.url;
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
    type === ObjectType.COLLABORATION_COMMENT ||
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

export function getUniqueValues<T>(arr: T[]) {
  return Array.from(new Set(arr));
}
