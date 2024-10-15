'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { BasicProject } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { getProjects } from '@/utils/requests/project/requests';

export type ProjectFilters = {
  projectIds: string[];
  types: string[];
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
  filters: { projectIds: [], types: [], searchString: '' },
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
      const filters = options.filters;
      const pageSize = 10;

      try {
        if (options.page === 1) {
          setIsLoading(true);
        }

        // const result =
        //   (await getProjects({
        //     pagination: {
        //       page: options.page,
        //       pageSize: pageSize,
        //     },
        //     filterBy: {
        //       projectIds: filters.projectIds.length ? filters.projectIds : undefined,
        //       searchString: filters.searchString.length ? filters.searchString : undefined,
        //     },
        //     sortsorBy: { updatedAt: 'DESC' },
        //   })) || [];
        const result = (await getProjects()) || []; //todo apply filters

        const entries = options.page > 1 ? [...projects, ...result] : result;
        setProjects(entries);
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
    [appInsights, projects],
  );

  const contextObject: ProjectPageContextInterface = {
    projects,
    sort,
    filters,
    isLoading,
    hasMore,
    refetchProjects: () => refetchProjects({ filters, page: pageNumber }),
    toggleSort,
    setFilters,
    loadNextPage,
  };

  return <ProjectPageContext.Provider value={contextObject}> {children}</ProjectPageContext.Provider>;
};

export const useProjects = () => useContext(ProjectPageContext);
