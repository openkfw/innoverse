export const mentionRegex = /@\[(.+?)\]/g;

export const formatMentionToText = (text: string) => {
  return text.replace(mentionRegex, '@$1');
};
