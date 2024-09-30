import React from 'react';

import Link from '@mui/material/Link';

import { highlightText } from '@/utils/highlightText';

export const parseStringForLinks = (text: string, searchString?: string): React.ReactNode => {
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
      return highlightText(part, searchString);
    }
  });
};
