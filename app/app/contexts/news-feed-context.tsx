'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { AmountOfNews, Filters, NewsFeedEntry, ObjectType } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { NewsType } from '@/utils/newsFeed/redis/models';
import { getNewsFeed } from '@/utils/newsFeed/redis/redisService';
import { getProjectTitleByIds } from '@/utils/requests/project/requests';

export enum SortValues {
  DESC = 'desc',
  ASC = 'asc',
}

export type NewsFeedFilters = {
  projectIds: string[];
  types: string[];
};

type ProjectWithTitle = {
  id: string;
  title: string;
};

const countEntriesByType = (entries: NewsFeedEntry[]) => {
  const initial: { [type: string]: number } = {};
  const uniqueTypes = entries.map((entry) => entry.type).filter((value, index, self) => self.indexOf(value) === index);
  const countByType = entries.reduce((entriesByType, entry) => {
    const typeName = entry.type.toString();
    entriesByType[typeName] = entriesByType[typeName] + 1 || 1;
    return entriesByType;
  }, initial);
  return { countByType, types: uniqueTypes };
};

const countEntriesByProjectTitle = async (entries: NewsFeedEntry[]) => {
  const projects = await getProjectsWithTitles(entries);
  const initial: { [projectTitle: string]: number } = {};

  const countByProjectTitle = entries.reduce((countByProjectTitle, entry) => {
    const project = projects.find((project) => project.id === entry.item.projectId);
    if (project) {
      countByProjectTitle[project.title] = countByProjectTitle[project.title] + 1 || 1;
    }
    return countByProjectTitle;
  }, initial);

  return { countByProjectTitle, projects };
};

const getProjectsWithTitles = async (entries: NewsFeedEntry[]) => {
  const projectIds = entries
    .map((entry) => entry.item.projectId)
    .filter((projectId): projectId is string => projectId !== undefined)
    .filter((value, index, self) => self.indexOf(value) === index);

  return (await getProjectTitleByIds(projectIds)) ?? [];
};

const getNewsTypeByString = (type: string) => {
  switch (type) {
    case ObjectType.COLLABORATION_COMMENT:
      return NewsType.COLLABORATION_COMMENT;
    case ObjectType.COLLABORATION_QUESTION:
      return NewsType.COLLABORATION_QUESTION;
    case ObjectType.PROJECT:
      return NewsType.PROJECT;
    case ObjectType.EVENT:
      return NewsType.EVENT;
    case ObjectType.OPPORTUNITY:
      return NewsType.OPPORTUNITY;
    case ObjectType.POST:
      return NewsType.POST;
    case ObjectType.SURVEY_QUESTION:
      return NewsType.SURVEY_QUESTION;
    case ObjectType.UPDATE:
      return NewsType.UPDATE;
    default:
      throw Error(`Unknown new feed object type '${type}'`);
  }
};

interface NewsFeedContextInterface {
  refetchNews: (options?: { filters?: Filters; fullRefetch?: boolean }) => void;
  removeEntry: (entry: NewsFeedEntry) => void;
  feed: NewsFeedEntry[];
  filters: NewsFeedFilters;
  setFilters: (filters: NewsFeedFilters) => void;
  sort: SortValues;
  toggleSort: () => void;
  isLoading: boolean;
  projects?: ProjectWithTitle[];
  types: ObjectType[];
  refetchFeed: () => Promise<void>;
  amountOfEntriesByProjectTitle: {
    [projectTitle: string]: number;
  };
  amountOfEntriesByType: {
    [type: string]: number;
  };
  loadNextPage: () => Promise<void>;
  hasMore: boolean;
}

const defaultState: NewsFeedContextInterface = {
  feed: [],
  sort: SortValues.DESC,
  refetchNews: () => {},
  removeEntry: (_: NewsFeedEntry) => {},
  filters: { projectIds: [], types: [] },
  types: [],
  amountOfEntriesByProjectTitle: {},
  amountOfEntriesByType: {},
  isLoading: false,
  hasMore: true,
  refetchFeed: () => Promise.resolve(),
  toggleSort: () => {},
  setFilters: () => {},
  loadNextPage: () => Promise.resolve(),
};

interface NewsFeedContextProviderProps {
  initiallyLoadedNews: NewsFeedEntry[];
  allNews: NewsFeedEntry[];
  children: React.ReactNode;
}

const NewsFeedContext = createContext(defaultState);

export const NewsFeedContextProvider = ({ children, initiallyLoadedNews, allNews }: NewsFeedContextProviderProps) => {
  const [allNewsFeedEntries, setAllNewsFeedEntries] = useState<NewsFeedEntry[]>(allNews);
  const [newsFeedEntries, setNewsFeedEntries] = useState<NewsFeedEntry[]>(initiallyLoadedNews);
  const [sort, setSort] = useState<SortValues.ASC | SortValues.DESC>(defaultState.sort);
  const [filters, setFilters] = useState<NewsFeedFilters>(defaultState.filters);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [projects, setProjects] = useState<ProjectWithTitle[]>();
  const [types, setTypes] = useState<ObjectType[]>(defaultState.types);

  const [amountOfEntriesByType, setAmountOfEntriesByType] = useState<AmountOfNews>(defaultState.amountOfEntriesByType);
  const [amountOfEntriesByProjectTitle, setAmountOfEntriesByProjectTitle] = useState<AmountOfNews>(
    defaultState.amountOfEntriesByProjectTitle,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(defaultState.hasMore);

  const removeEntry = (entry: NewsFeedEntry) => {
    setAllNewsFeedEntries((prev) => prev.filter((e) => e.item.id !== entry.item.id));
  };

  const appInsights = useAppInsightsContext();

  const refetchFeed = useCallback(
    async (options: { page: number; filters: NewsFeedFilters }) => {
      const filters = options.filters;
      const pageSize = 10;

      try {
        if (options.page === 1) {
          setIsLoading(true);
        }

        const result = await getNewsFeed({
          pagination: {
            page: options.page,
            pageSize: pageSize,
          },
          filterBy: {
            projectIds: filters.projectIds.length ? filters.projectIds : undefined,
            types: filters.types.length ? filters.types.map(getNewsTypeByString) : undefined,
          },
          sortBy: { updatedAt: 'DESC' },
        });

        const entries = options.page > 1 ? [...newsFeedEntries, ...result] : result;
        setNewsFeedEntries(entries);
        setHasMore(result.length >= pageSize);
      } catch (error) {
        errorMessage({ message: 'Error refetching news feed. Please check your connection and try again.' });
        console.error('Error refetching news feed:', error);
        appInsights.trackException({
          exception: new Error('Error refetching news feed', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [appInsights, newsFeedEntries],
  );

  const loadNextPage = async () => {
    if (hasMore) {
      const page = pageNumber + 1;
      setPageNumber(page);
      await refetchFeed({ page, filters });
    }
  };

  const toggleSort = () => {
    setSort((previous) => (previous === SortValues.ASC ? SortValues.DESC : SortValues.ASC));
    const reversed = newsFeedEntries.reverse();
    setNewsFeedEntries(reversed);
  };

  const updateFilters = (filters: NewsFeedFilters) => {
    const page = 1;
    setFilters(filters);
    setPageNumber(page);
    refetchFeed({ page, filters });
  };

  useMemo(async () => {
    const { countByProjectTitle, projects } = await countEntriesByProjectTitle(allNewsFeedEntries);
    setAmountOfEntriesByProjectTitle(countByProjectTitle);
    setProjects(projects);
  }, [allNewsFeedEntries]);

  useMemo(() => {
    const { countByType, types } = countEntriesByType(allNewsFeedEntries);
    setAmountOfEntriesByType(countByType);
    setTypes(types);
  }, [allNewsFeedEntries]);

  const contextObject: NewsFeedContextInterface = {
    feed: newsFeedEntries,
    sort,
    filters,
    projects,
    types,
    amountOfEntriesByProjectTitle,
    amountOfEntriesByType,
    isLoading,
    refetchNews: () => refetchFeed({ filters, page: pageNumber }),
    removeEntry,
    hasMore,
    toggleSort,
    setFilters: updateFilters,
    refetchFeed: () => refetchFeed({ filters, page: pageNumber }),
    loadNextPage,
  };

  return <NewsFeedContext.Provider value={contextObject}> {children}</NewsFeedContext.Provider>;
};

export const useNewsFeed = () => useContext(NewsFeedContext);
