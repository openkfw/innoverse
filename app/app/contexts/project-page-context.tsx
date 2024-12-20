'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

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
  refetchProjects: () => Promise<void>;
  toggleSort: () => void;
  setFilters: (filters: ProjectFilters) => void;
  loadNextPage: () => Promise<void>;
}

const defaultState: ProjectPageContextInterface = {
  projects: [],
  isLoading: false,
  hasMore: true,
  sort: SortValues.DESC,
  filters: { searchString: '' },
  refetchProjects: () => Promise.resolve(),
  toggleSort: () => {},
  setFilters: () => {},
  loadNextPage: () => Promise.resolve(),
};

interface ProjectPageContextProviderProps {
  initalProjects: BasicProject[];
  children: React.ReactNode;
}

const ProjectPageContext = createContext(defaultState);

export const ProjectPageContextProvider = ({ children, ...props }: ProjectPageContextProviderProps) => {
  const [projects, setProjects] = useState<BasicProject[]>(props.initalProjects);
  const [sort, setSort] = useState<SortValues.ASC | SortValues.DESC>(defaultState.sort);
  const [filters, setFilters] = useState<ProjectFilters>(defaultState.filters);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(defaultState.hasMore);

  const toggleSort = () => {
    setSort((previous) => (previous === SortValues.ASC ? SortValues.DESC : SortValues.ASC));
    const reversed = projects.reverse();
    setProjects(reversed);
  };

  const loadNextPage = async () => {
    if (hasMore) {
      const page = pageNumber + 1;
      setPageNumber(page);
      await refetchProjects({ page, filters });
    }
  };
  const appInsights = useAppInsightsContext();

  const refetchProjects = useCallback(
    async (options: { page: number; filters: ProjectFilters }) => {
      const searchString = options.filters.searchString;
      const pageSize = 10;

      try {
        if (options.page === 1) {
          setIsLoading(true);
        }
        const result =
          (await getProjectsBySearchString({
            pagination: {
              page: options.page,
              pageSize: pageSize,
            },
            sort: { by: 'updatedAt', order: 'desc' },
            searchString,
          })) || [];

        const entries = options.page > 1 ? [...projects, ...result] : result;
        setProjects(entries);
        setHasMore(result.length >= pageSize);
      } catch (error) {
        errorMessage({ message: 'Error refetching projects. Please check your connection and try again.' });
        console.error('Error refetching projects:', error);
        appInsights.trackException({
          exception: new Error('Error refetching projects', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [appInsights, projects],
  );

  const updateFilters = (filters: ProjectFilters) => {
    const page = 1;
    setFilters(filters);
    setPageNumber(page);
    refetchProjects({ page, filters });
  };

  const contextObject: ProjectPageContextInterface = {
    projects,
    sort,
    filters,
    isLoading,
    hasMore,
    refetchProjects: () => refetchProjects({ filters, page: pageNumber }),
    toggleSort,
    setFilters: updateFilters,
    loadNextPage,
  };

  return <ProjectPageContext.Provider value={contextObject}> {children}</ProjectPageContext.Provider>;
};

export const useProjects = () => useContext(ProjectPageContext);
