'use client';

import React, { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { AmountOfNews, Filters, ProjectUpdateWithAdditionalData } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { SortValues } from '@/components/newsPage/News';
import { getProjectsUpdatesFilter } from '@/utils/requests';

interface NewsFilterContextInterface {
  news: ProjectUpdateWithAdditionalData[];
  setNews: Dispatch<SetStateAction<ProjectUpdateWithAdditionalData[]>>;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  sort: SortValues.ASC | SortValues.DESC;
  setSort: (sort: SortValues.ASC | SortValues.DESC) => void;
  refetchNews: (filters?: Filters) => void;
  sortNews: () => void;
  topics: string[];
  projects: string[];
  amountOfNewsTopic: AmountOfNews;
  amountOfNewsProject: AmountOfNews;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
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
  topics: [],
  projects: [],
  amountOfNewsTopic: {},
  amountOfNewsProject: {},
  pageNumber: 2,
  setPageNumber: () => {},
};

interface NewsFilterContextProviderProps {
  initialNews: ProjectUpdateWithAdditionalData[];
  allUpdates: ProjectUpdateWithAdditionalData[];
  children: React.ReactNode;
}

const NewsFilterContext = createContext(defaultState);

export const NewsFilterContextProvider = ({ children, initialNews, allUpdates }: NewsFilterContextProviderProps) => {
  const [news, setNews] = useState<ProjectUpdateWithAdditionalData[]>(initialNews);
  const [sort, setSort] = useState<SortValues.ASC | SortValues.DESC>(defaultState.sort);
  const [filters, setFilters] = useState<Filters>(defaultState.filters);
  const [amountOfNewsTopic, setAmountOfNewsTopic] = useState<AmountOfNews>(defaultState.amountOfNewsTopic);
  const [amountOfNewsProject, setAmountOfNewsProject] = useState<AmountOfNews>(defaultState.amountOfNewsProject);
  const [pageNumber, setPageNumber] = useState<number>(defaultState.pageNumber);

  const refetchNews = async (newFilters?: Filters) => {
    try {
      const result = await getProjectsUpdatesFilter(sort, 1, newFilters || filters);
      if (result) {
        setNews([...result]);
        setPageNumber(2);
      }
    } catch (error) {
      errorMessage({ message: 'Error refetching news. Please check your connection and try again.' });
      console.error('Error refetching news:', error);
      appInsights.trackException({
        exception: new Error('Error refetching news', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };
  const appInsights = useAppInsightsContext();

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
    sortNews,
    topics,
    projects,
    amountOfNewsTopic,
    amountOfNewsProject,
    pageNumber,
    setPageNumber,
  };

  return <NewsFilterContext.Provider value={contextObject}> {children}</NewsFilterContext.Provider>;
};

export const useNewsFilter = () => useContext(NewsFilterContext);
