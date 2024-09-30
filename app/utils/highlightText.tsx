import React from 'react';

export const highlightText = (text: string | undefined, searchString?: string): React.ReactNode => {
  if (!text) return;
  if (!searchString) return text;

  const parts = text.split(new RegExp(`(${searchString})`, 'gi'));

  return parts.map((part, index) =>
    part.toLowerCase() === searchString.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: '#FFE95E' }}>
        {part}
      </span>
    ) : (
      part
    ),
  );
};
