import React from 'react';

import Link from '@mui/material/Link';

import { HighlightText } from '@/utils/highlightText';

export const parseStringForLinks = (text: string): React.ReactNode => {
  const urlRegex = /((?:https?:\/\/)?(?:www\.|localhost:\d{1,5})?[^\s]+\.[^\s]+|https?:\/\/localhost:\d{1,5}[^\s]*)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if ((part.match(urlRegex) && part.startsWith('http')) || part.startsWith('www')) {
      return (
        <Link key={index} href={part.startsWith('http') ? part : `http://${part}`} target="_blank">
          <HighlightText text={part} />
        </Link>
      );
    } else {
      return <HighlightText key={index} text={part} />;
    }
  });
};
