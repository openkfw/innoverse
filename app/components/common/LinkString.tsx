import Link from '@mui/material/Link';

export const parseStringForLinks = (text: string): React.ReactNode | string => {
  const urlRegex = /((?:https?:\/\/)?(?:www\.|localhost:\d{1,5})?[^\s]+\.[^\s]+|https?:\/\/localhost:\d{1,5}[^\s]*)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if ((part.match(urlRegex) && part.startsWith('http')) || part.startsWith('www')) {
      return (
        <Link href={part.startsWith('http') ? part : `http://${part}`} target="_blank" key={index}>
          {part}
        </Link>
      );
    } else {
      return part;
    }
  });
};
