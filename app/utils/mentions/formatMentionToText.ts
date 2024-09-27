export const formatMentionToText = (text: string) => {
  const mentionRegex = /@\[(.*?)\]\((\d+)\|(.+?)\)/g;
  return text.replace(mentionRegex, '@$1');
};
