import React, { useMemo } from 'react';
import { useHighlightContext } from '@/app/contexts/news-feed-highlight-context';
import { escapeRegexExp } from './helpers';

export function HighlightText({ text }: { text: string | undefined }) {
  const { highlightString } = useHighlightContext();

  const regex = useMemo(() => {
    if (!highlightString) return null;
    const escapedString = escapeRegexExp(highlightString);
    return new RegExp(`(${escapedString})`, 'gi');
  }, [highlightString]);

  if (!text) return null;
  const parts = regex ? text.split(regex) : [text];

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlightString?.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: '#FFE95E' }}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
