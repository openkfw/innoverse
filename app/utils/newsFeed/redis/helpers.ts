import { RedisNewsFeedEntry } from './models';

export const escapeRedisTextSeparators = (str: string) => {
  const separators = '\\,.<>{}[]"\'/:;!@#$%^&*()-+=~ '.split('');
  let escapedString = str;
  separators.forEach((separator) => (escapedString = escapedString.replaceAll(separator, `\\${separator}`)));
  return escapedString;
};

export const filterDuplicateEntries = (documents: { id: string; value: RedisNewsFeedEntry }[]) => {
  return documents.filter(
    (value, index, self) => index === self.findIndex((t) => t.value.item.id === value.value.item.id),
  );
};
