'use client';

import React, { createContext, useContext, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { InfiniteData, QueryKey, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { AmountOfNews, NewsFeedEntry, ObjectType } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { getNewsTypeByString } from '@/utils/newsFeed/redis/mappings';
import { getNewsFeed } from '@/utils/newsFeed/redis/redisService';

export enum SortValues {
  DESC = 'desc',
  ASC = 'asc',
}

export type NewsFeedFilters = {
  projectIds: string[];
  types: string[];
  searchString: string;
};

type ProjectWithTitle = {
  id: string;
  title: string;
};

interface NewsFeedContextInterface {
  feed: NewsFeedEntry[];
  sort: SortValues;
  filters: NewsFeedFilters;
  isLoading: boolean;
  hasMore: boolean;
  amountOfEntriesByProjectTitle: {
    [projectTitle: string]: number;
  };
  amountOfEntriesByType: {
    [type: string]: number;
  };
  projects?: ProjectWithTitle[];
  types: ObjectType[];
  addEntry: (entry: NewsFeedEntry) => void;
  removeEntry: (entry: NewsFeedEntry) => void;
  refetchFeed: () => void;
  toggleSort: () => void;
  setFilters: (filters: NewsFeedFilters) => void;
  loadNextPage: () => void;
  toggleFollow: (entry: NewsFeedEntry) => void;
}

const defaultState: NewsFeedContextInterface = {
  feed: [],
  sort: SortValues.DESC,
  filters: { projectIds: [], types: [], searchString: '' },
  types: [],
  amountOfEntriesByProjectTitle: {},
  amountOfEntriesByType: {},
  isLoading: false,
  hasMore: true,
  addEntry: () => {},
  removeEntry: () => {},
  refetchFeed: () => {},
  toggleSort: () => {},
  setFilters: () => {},
  loadNextPage: () => {},
  toggleFollow: () => {},
};

interface NewsFeedContextProviderProps {
  initiallyLoadedNewsFeed: NewsFeedEntry[];
  countByProjectTitle: AmountOfNews;
  countByType: AmountOfNews;
  projects: ProjectWithTitle[];
  types: ObjectType[];
  children: React.ReactNode;
}

const NewsFeedContext = createContext(defaultState);

export const NewsFeedContextProvider = ({ children, ...props }: NewsFeedContextProviderProps) => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<NewsFeedFilters>(defaultState.filters);
  const [sort, setSort] = useState<SortValues>(defaultState.sort);
  const appInsights = useAppInsightsContext();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery<
    NewsFeedEntry[],
    Error,
    InfiniteData<NewsFeedEntry[]>,
    QueryKey,
    number
  >({
    queryKey: ['newsFeed', filters, sort],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      try {
        const pageSize = 10;
        const result = await getNewsFeed({
          pagination: { page: pageParam, pageSize },
          filterBy: {
            projectIds: filters.projectIds.length ? filters.projectIds : undefined,
            types: filters.types.length ? filters.types.map(getNewsTypeByString) : undefined,
            searchString: filters.searchString,
          },
          sortBy: { updatedAt: sort === SortValues.DESC ? 'DESC' : 'ASC' },
        });
        return result || [];
      } catch (error) {
        errorMessage({ message: 'Error fetching news feed. Please check your connection and try again.' });
        console.error('Error fetching news feed:', error);
        appInsights.trackException({
          exception: new Error('Error fetching news feed', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
        throw error;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    retry: false,
  });

  console.log(data);

  const feed: NewsFeedEntry[] = (data?.pages.flat() as NewsFeedEntry[]) || [];
  const hasMore = !!hasNextPage;

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const refetchFeed = () => {
    queryClient.invalidateQueries({ queryKey: ['newsFeed'] });
  };

  const addEntry = (entry: NewsFeedEntry) => {
    if (!feed.some((e) => e.item.id === entry.item.id)) {
      feed.unshift(entry);
    }
  };

  const removeEntry = (entry: NewsFeedEntry) => {
    feed.splice(
      feed.findIndex((e) => e.item.id === entry.item.id),
      1,
    );
  };

  const toggleSort = () => {
    setSort((prev) => (prev === SortValues.ASC ? SortValues.DESC : SortValues.ASC));
  };

  const toggleFollow = (entry: NewsFeedEntry) => {
    const index = feed.findIndex((e) => e.item.id === entry.item.id);
    if (index !== -1) {
      feed[index].item.followedByUser = !(feed[index].item.followedByUser ?? false);
    }
  };

  const updateFilters = (newFilters: NewsFeedFilters) => {
    setFilters(newFilters);
    refetchFeed();
  };

  const contextObject = {
    feed,
    sort,
    filters,
    isLoading: isLoading || isFetchingNextPage,
    hasMore,
    addEntry,
    removeEntry,
    toggleFollow,
    toggleSort,
    setFilters: updateFilters,
    loadNextPage,
    refetchFeed,
    amountOfEntriesByProjectTitle: props.countByProjectTitle,
    amountOfEntriesByType: props.countByType,
    projects: props.projects,
    types: props.types,
  };

  return <NewsFeedContext.Provider value={contextObject}>{children}</NewsFeedContext.Provider>;
};

export const useNewsFeed = () => useContext(NewsFeedContext);
