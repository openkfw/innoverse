import { Link } from '@mui/material';

export const parseStringForLinks = (text: string): React.ReactNode | string => {
  const urlRegex = /((?:https?:\/\/)?(?:www\.)?[^\s]+\.[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if ((part.match(urlRegex) && part.startsWith('http')) || part.startsWith('www')) {
      return (
        <Link href={part.startsWith('http') ? part : `http://${part}`} key={index}>
          {part}
        </Link>
      );
    } else {
      return part;
    }
  });
};