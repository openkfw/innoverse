'use client';

import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';

import { AmountOfNews, Filters, ProjectUpdate } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { SortValues } from '@/components/newsPage/News';
import { getProjectsUpdates, getProjectsUpdatesFilter } from '@/utils/requests';

interface NewsFilterContextInterface {
  news: ProjectUpdate[];
  setNews: Dispatch<SetStateAction<ProjectUpdate[]>>;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  sort: SortValues.ASC | SortValues.DESC;
  setSort: (sort: SortValues.ASC | SortValues.DESC) => void;
  refetchNews: () => void;
  sortNews: () => void;
  topics: string[];
  projects: string[];
  amountOfNewsTopic: AmountOfNews;
  amountOfNewsProject: AmountOfNews;
}

const defaultState: NewsFilterContextInterface = {
  news: [],
  setNews: () => {},
  filters: { resultsPerPage: 10, projects: [], topics: [] },
  setFilters: () => {},
  sort: SortValues.DESC,
  setSort: () => {},
  refetchNews: () => {},
  sortNews: () => {},
  topics: [],
  projects: [],
  amountOfNewsTopic: {},
  amountOfNewsProject: {},
};

const NewsFilterContext = createContext(defaultState);

export const NewsFilterContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [news, setNews] = useState<ProjectUpdate[]>(defaultState.news);
  const [allNews, setAllNews] = useState<ProjectUpdate[]>(defaultState.news);
  const [sort, setSort] = useState<SortValues.ASC | SortValues.DESC>(defaultState.sort);
  const [filters, setFilters] = useState<Filters>(defaultState.filters);
  const [amountOfNewsTopic, setAmountOfNewsTopic] = useState<AmountOfNews>(defaultState.amountOfNewsTopic);
  const [amountOfNewsProject, setAmountOfNewsProject] = useState<AmountOfNews>(defaultState.amountOfNewsProject);

  const topics = useMemo(() => {
    const data = allNews
      .map((update) => update.topic)
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter((value) => value);

    const mapUpdatesTopics = () => {
      const arr: AmountOfNews = {};
      return allNews.reduce((accumulator, value) => {
        accumulator[value.topic] = ++accumulator[value.topic] || 1;
        return accumulator;
      }, arr);
    };
    setAmountOfNewsTopic(mapUpdatesTopics());
    return data;
  }, [allNews]);

  const projects = useMemo(() => {
    const data = allNews
      .map((update) => update.title)
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter((value) => value);

    const mapUpdatesProjects = () => {
      const arr: AmountOfNews = {};
      return allNews.reduce((accumulator, value) => {
        accumulator[value.title] = ++accumulator[value.title] || 1;
        return accumulator;
      }, arr);
    };
    setAmountOfNewsProject(mapUpdatesProjects());
    return data;
  }, [allNews]);

  const sortNews = () => {
    if (sort === SortValues.ASC) {
      setSort(SortValues.DESC);
      return;
    }
    setSort(SortValues.ASC);
  };

  const refetchNews = async () => {
    try {
      const updates = (await getProjectsUpdatesFilter(sort, filters, 1, filters.resultsPerPage)) as ProjectUpdate[];
      const allUpdates = (await getProjectsUpdates()) as ProjectUpdate[];
      setNews([...updates]);
      setAllNews([...allUpdates]);
    } catch (error) {
      errorMessage({ message: 'Error refetching news. Please check your connection and try again.' });
      console.error('Error refetching news:', error);
    }
  };

  useEffect(() => {
    const setData = async () => {
      try {
        const updates = (await getProjectsUpdatesFilter(sort, filters, 1, filters.resultsPerPage)) as ProjectUpdate[];
        const allUpdates = (await getProjectsUpdates()) as ProjectUpdate[];
        setNews([...updates]);
        setAllNews([...allUpdates]);
      } catch (error) {
        errorMessage({ message: 'Error fetching news updates. Please try again later.' });
        console.error('Error fetching initial news data:', error);
      }
    };
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  };

  return <NewsFilterContext.Provider value={contextObject}> {children}</NewsFilterContext.Provider>;
};

export const useNewsFilter = () => useContext(NewsFilterContext);
