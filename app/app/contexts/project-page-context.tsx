'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';

import { BasicProject } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { getProjectsBySearchString } from '@/utils/requests/project/requests';

export type ProjectFilters = {
  searchString: string;
};

export enum SortValues {
  DESC = 'desc',
  ASC = 'asc',
}

interface ProjectPageContextInterface {
  projects?: BasicProject[];
  sort: SortValues;
  filters: ProjectFilters;
  isLoading: boolean;
  hasMore: boolean;
  toggleSort: () => void;
  setFilters: (filters: ProjectFilters) => void;
  loadNextPage: () => void;
}

const defaultState: ProjectPageContextInterface = {
  projects: [],
  isLoading: false,
  hasMore: true,
  sort: SortValues.DESC,
  filters: { searchString: '' },
  toggleSort: () => {},
  setFilters: () => {},
  loadNextPage: () => {},
};
interface ProjectPageContextProviderProps {
  initalProjects: BasicProject[];
  children: React.ReactNode;
}

const ProjectPageContext = createContext(defaultState);

export const ProjectPageContextProvider = ({ children }: ProjectPageContextProviderProps) => {
  const appInsights = useAppInsightsContext();

  const [filters, setFilters] = useState<ProjectFilters>(defaultState.filters);
  const [sort, setSort] = useState<SortValues>(defaultState.sort);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery<
    BasicProject[],
    Error,
    InfiniteData<BasicProject[]>,
    QueryKey,
    number
  >({
    queryKey: ['projects', filters, sort],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      try {
        const pageSize = 10;
        const result = await getProjectsBySearchString({
          pagination: { page: pageParam, pageSize },
          sort: { by: 'updatedAt', order: sort === SortValues.DESC ? 'desc' : 'asc' },
          searchString: filters.searchString || '',
        });
        return result || [];
      } catch (error) {
        errorMessage({ message: 'Error fetching projects. Please check your connection and try again.' });
        console.error('Error fetching projects:', error);
        appInsights.trackException({
          exception: new Error('Error fetching projects', { cause: error }),
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

  const hasMore = !!hasNextPage;

  const loadNextPage = () => {
    if (hasNextPage) fetchNextPage();
  };

  const toggleSort = () => {
    setSort((prev) => (prev === SortValues.ASC ? SortValues.DESC : SortValues.ASC));
  };

  const updateFilters = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
  };

  const projects = useMemo(() => (data?.pages.flat() as BasicProject[]) || [], [data]);

  const contextObject = {
    projects,
    sort,
    filters,
    isLoading: isLoading || isFetchingNextPage,
    hasMore,
    toggleSort,
    setFilters: updateFilters,
    loadNextPage,
  };

  return <ProjectPageContext.Provider value={contextObject}>{children}</ProjectPageContext.Provider>;
};

export const useProjects = () => useContext(ProjectPageContext);
