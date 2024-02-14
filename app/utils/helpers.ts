export const sortDateByCreatedAt = <T>(array: T[]): T[] => {
  return array.sort((d1: any, d2: any) => d1.createdAt.getTime() - d2.createdAt.getTime());
};

export function assertFullfilledPromise<T>(item: PromiseSettledResult<T>) {
  return item.status === 'fulfilled';
}

export function getFulfilledResults<T>(results: PromiseSettledResult<T>[]) {
  return results
    .filter(assertFullfilledPromise)
    .map((result: PromiseSettledResult<T>) => (result as PromiseFulfilledResult<T>).value);
}

export function getFulfilledPromiseResults<T>(promises: Promise<T>[]) {
  return Promise.allSettled(promises).then((results) => getFulfilledResults(results));
}

export function formatDate(dateString: string, locale = 'de-DE') {
  const date = new Date(dateString);
  const day = date.toLocaleString(locale, { day: 'numeric' });
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });
  return `${day}. ${month} ${year}`;
}
