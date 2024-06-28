'use client';

import React, { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { AmountOfNews, Filters, ProjectUpdateWithAdditionalData, SortValues } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';
import { getProjectUpdates, getProjectUpdatesPage } from '@/utils/requests/updates/requests';

interface NewsFilterContextInterface {
  news: ProjectUpdateWithAdditionalData[];
  setNews: Dispatch<SetStateAction<ProjectUpdateWithAdditionalData[]>>;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  sort: SortValues;
  setSort: (sort: SortValues) => void;
  refetchNews: (options?: { filters?: Filters; fullRefetch?: boolean }) => void;
  sortNews: () => void;
  isLoading: boolean;
  topics: string[];
  projects: string[];
  amountOfNewsTopic: AmountOfNews;
  amountOfNewsProject: AmountOfNews;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  hasMoreValue: boolean;
  setHasMoreValue: Dispatch<SetStateAction<boolean>>;
}

const defaultState: NewsFilterContextInterface = {
  news: [],
  setNews: () => {},
  filters: { projects: [], topics: [] },
  setFilters: () => {},
  sort: SortValues.DESC,
  setSort: () => {},
  refetchNews: () => {},
  sortNews: () => {},
  isLoading: false,
  topics: [],
  projects: [],
  amountOfNewsTopic: {},
  amountOfNewsProject: {},
  pageNumber: 2,
  setPageNumber: () => {},
  hasMoreValue: true,
  setHasMoreValue: () => {},
};

interface NewsFilterContextProviderProps {
  initiallyLoadedNews: ProjectUpdateWithAdditionalData[];
  allNews: ProjectUpdateWithAdditionalData[];
  children: React.ReactNode;
}

const NewsFilterContext = createContext(defaultState);

export const NewsFilterContextProvider = ({
  children,
  initiallyLoadedNews,
  allNews,
}: NewsFilterContextProviderProps) => {
  const appInsights = useAppInsightsContext();
  const [news, setNews] = useState<ProjectUpdateWithAdditionalData[]>(initiallyLoadedNews);
  const [sort, setSort] = useState<SortValues.ASC | SortValues.DESC>(defaultState.sort);
  const [filters, setFilters] = useState<Filters>(defaultState.filters);
  const [amountOfNewsTopic, setAmountOfNewsTopic] = useState<AmountOfNews>(defaultState.amountOfNewsTopic);
  const [amountOfNewsProject, setAmountOfNewsProject] = useState<AmountOfNews>(defaultState.amountOfNewsProject);
  const [pageNumber, setPageNumber] = useState<number>(defaultState.pageNumber);
  const [hasMoreValue, setHasMoreValue] = useState<boolean>(defaultState.hasMoreValue);
  const [isLoading, setIsLoading] = useState(false);
  const [allUpdates, setAllUpdates] = useState(allNews);

  const refetchNews = async (options?: { filters?: Filters; fullRefetch?: boolean }) => {
    const newFilters = options?.filters;
    try {
      setIsLoading(true);
      const result = await getProjectUpdatesPage({ filters: newFilters || filters, sort, page: 1 });
      if (options?.fullRefetch) {
        const fetchUpdatesRequest = await getProjectUpdates();
        if (fetchUpdatesRequest) setAllUpdates(fetchUpdatesRequest);
      }
      if (result) {
        setNews([...result]);
        setPageNumber(2);
        result.length > 0 ? setHasMoreValue(true) : setHasMoreValue(false);
      }
    } catch (error) {
      errorMessage({ message: m.app_contexts_newsFilterContext_refetchingNewsError() });
      console.error('Error refetching news:', error);
      appInsights.trackException({
        exception: new Error('Error refetching news', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const topics = useMemo(() => {
    const data = allUpdates
      .map((update) => update.topic)
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter((value) => value);

    const mapUpdatesTopics = () => {
      const arr: AmountOfNews = {};
      return allUpdates.reduce((accumulator, value) => {
        accumulator[value.topic] = ++accumulator[value.topic] || 1;
        return accumulator;
      }, arr);
    };
    setAmountOfNewsTopic(mapUpdatesTopics());
    return data;
  }, [allUpdates]);

  const projects = useMemo(() => {
    const data = allUpdates
      .map((update) => update.title)
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter((value) => value);

    const mapUpdatesProjects = () => {
      const arr: AmountOfNews = {};
      return allUpdates.reduce((accumulator, value) => {
        accumulator[value.title] = ++accumulator[value.title] || 1;
        return accumulator;
      }, arr);
    };
    setAmountOfNewsProject(mapUpdatesProjects());
    return data;
  }, [allUpdates]);

  const sortNews = () => {
    if (sort === SortValues.ASC) {
      setSort(SortValues.DESC);
      setNews(news.reverse());
      return;
    }
    setSort(SortValues.ASC);
    setNews(news.reverse());
  };

  const contextObject: NewsFilterContextInterface = {
    news,
    setNews,
    sort,
    setSort,
    filters,
    setFilters,
    refetchNews,
    isLoading,
    sortNews,
    topics,
    projects,
    amountOfNewsTopic,
    amountOfNewsProject,
    pageNumber,
    setPageNumber,
    hasMoreValue,
    setHasMoreValue,
  };

  return <NewsFilterContext.Provider value={contextObject}> {children}</NewsFilterContext.Provider>;
};

export const useNewsFilter = () => useContext(NewsFilterContext);
