import { useHighlightContext } from '@/app/contexts/news-feed-highlight-context';
import React, { useMemo } from 'react';

export function HighlightText({ text }: { text: string | undefined }) {
  const { highlightString } = useHighlightContext();
  const regex = useMemo(() => new RegExp(`(${highlightString})`, 'gi'), [highlightString]);

  const renderText = (text: string | undefined) => {
    if (!text) return;
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === highlightString?.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: '#FFE95E' }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return <>{renderText(text)}</>;
}
