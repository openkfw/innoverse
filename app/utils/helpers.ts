import { SxProps } from '@mui/material/styles';

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

export const mergeStyles = (primary: SxProps | undefined, overrides: SxProps | undefined): SxProps => {
  return [primary, ...(Array.isArray(overrides) ? overrides : [overrides])];
};

export function formatDate(dateString: string, locale = 'de-DE') {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return null;
  }

  const date = new Date(dateString);
  const day = date.toLocaleString(locale, { day: 'numeric' });
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });
  return `${day}. ${month} ${year}`;
}

export function getProviderLabel(provider: { name: string; id: string }) {
  return provider.id === 'azure-ad' ? `Mit ***STRING_REMOVED***  Account einloggen` : `Mit ${provider.name.split(' ')[0]} einloggen`;
}
