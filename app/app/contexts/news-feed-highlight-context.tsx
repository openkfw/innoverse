'use client';

import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { useNewsFeed } from './news-feed-context';

interface HighlightContext {
  highlightString?: string;
}

const HighlightContext = createContext<HighlightContext>({});

export function NewsFeedHighlightContextProvider(props: PropsWithChildren) {
  const [highlightString, setHighlightString] = useState<string>();
  const { filters } = useNewsFeed();

  useEffect(
    function updateNewsFeedSearchTerm() {
      if (filters.searchString.length !== 1) {
        setHighlightString(filters.searchString);
      }
    },
    [filters.searchString],
  );
  const ctx: HighlightContext = { highlightString };
  return <HighlightContext.Provider value={ctx}>{props.children}</HighlightContext.Provider>;
}

export function useHighlightContext() {
  const ctx = useContext(HighlightContext);
  return ctx;
}
