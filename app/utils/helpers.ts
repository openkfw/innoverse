export const sortDateByCreatedAt = (array: any) => {
  return array.sort((d1: any, d2: any) => d1.createdAt.getTime() - d2.createdAt.getTime());
};

export function assertFullfilledPromise(item: any) {
  return item.status === 'fulfilled';
}

export function getFulfilledResults(results: any) {
  return results.filter(assertFullfilledPromise).map((res: any) => res.value);
}

export function formatDate(dateString: string, locale = 'de-DE') {
  const date = new Date(dateString);
  const day = date.toLocaleString(locale, { day: 'numeric' });
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });
  return `${day}. ${month} ${year}`;
}
