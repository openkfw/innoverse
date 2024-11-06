export const escapeRedisTextSeparators = (str: string) => {
  const separators = '\\,.<>{}[]"\'/:;!@#$%^&*()-+=~ '.split('');
  let escapedString = str;
  separators.forEach((separator) => (escapedString = escapedString.replaceAll(separator, `\\${separator}`)));
  return escapedString;
};
