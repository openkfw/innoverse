'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { AmountOfNews, NewsFeedEntry, ObjectType } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { NewsType } from '@/utils/newsFeed/redis/models';
import { getNewsFeed } from '@/utils/newsFeed/redis/redisService';
import { getProjectTitleById } from '@/utils/requests/project/requests';

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

const safeIncrement = (dictionary: { [key: string]: number }, key: string, increment: 1 | -1) => {
  const defaultCount = increment === 1 ? 0 : 1;
  if (!dictionary[key]) dictionary[key] = defaultCount;
  dictionary[key] = dictionary[key] + increment;
  if (dictionary[key] === 0) delete dictionary[key];
  return dictionary;
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
  refetchFeed: () => Promise<void>;
  toggleSort: () => void;
  setFilters: (filters: NewsFeedFilters) => void;
  loadNextPage: () => Promise<void>;
}

const defaultState: NewsFeedContextInterface = {
  feed: [],
  sort: SortValues.DESC,
  filters: { projectIds: [], types: [] },
  types: [],
  amountOfEntriesByProjectTitle: {},
  amountOfEntriesByType: {},
  isLoading: false,
  hasMore: true,
  addEntry: (_: NewsFeedEntry) => {},
  removeEntry: (_: NewsFeedEntry) => {},
  refetchFeed: () => Promise.resolve(),
  toggleSort: () => {},
  setFilters: () => {},
  loadNextPage: () => Promise.resolve(),
};

interface NewsFeedContextProviderProps {
  initiallyLoadedNewsFeed: NewsFeedEntry[];
  countByProjectTitle: AmountOfNews;
  countByType: AmountOfNews;
  projects: ProjectWithTitle[];
  children: React.ReactNode;
}

const NewsFeedContext = createContext(defaultState);

export const NewsFeedContextProvider = ({ children, ...props }: NewsFeedContextProviderProps) => {
  const [newsFeedEntries, setNewsFeedEntries] = useState<NewsFeedEntry[]>(props.initiallyLoadedNewsFeed);
  const [sort, setSort] = useState<SortValues.ASC | SortValues.DESC>(defaultState.sort);
  const [filters, setFilters] = useState<NewsFeedFilters>(defaultState.filters);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [projects, setProjects] = useState<ProjectWithTitle[]>(props.projects);
  const [types, setTypes] = useState<ObjectType[]>(defaultState.types);

  const [amountOfEntriesByType, setAmountOfEntriesByType] = useState<AmountOfNews>(props.countByType);
  const [amountOfEntriesByProjectTitle, setAmountOfEntriesByProjectTitle] = useState<AmountOfNews>(
    props.countByProjectTitle,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(defaultState.hasMore);

  const filtersAreSet = filters.projectIds.length || filters.types.length;

  const getProjectId = (entry: NewsFeedEntry) => {
    return entry.type === ObjectType.PROJECT ? entry.item.id : entry.item.projectId;
  };

  const addEntry = (entry: NewsFeedEntry) => {
    const projectId = getProjectId(entry);
    const entryIsVisible =
      !filtersAreSet ||
      filters.projectIds.some((id) => id === projectId) ||
      filters.types.some((type) => type === entry.type);

    if (entryIsVisible) {
      setNewsFeedEntries((prev) => [entry, ...prev]);
    }

    incrementAmountOfEntries(entry, 1);
  };

  const removeEntry = async (entry: NewsFeedEntry) => {
    const filteredEntries = newsFeedEntries.filter((e) => e.item.id !== entry.item.id);
    setNewsFeedEntries(filteredEntries);
    incrementAmountOfEntries(entry, -1);

    if (filtersAreSet && !filteredEntries.length) {
      setPageNumber(1);
      setFilters(defaultState.filters);
      await refetchFeed({ filters: defaultState.filters, page: 1 });
    }
  };

  const incrementAmountOfEntries = async (entry: NewsFeedEntry, increment: 1 | -1) => {
    const getProject = async (projectId: string) => {
      // Get from project array
      let project = projects?.find((project) => project.id === projectId);
      if (project) return project;
      // Get from strapi and then add to project array
      const projectTitle = await getProjectTitleById(projectId);
      if (projectTitle === undefined) return;
      project = { id: projectId, title: projectTitle };
      setProjects((prev) => [...(prev ?? []), project]);
      return project;
    };

    // Update filter counts for types
    if (!types.some((type) => type === entry.type)) setTypes((prev) => [...prev, entry.type]);
    const newAmountOfEntriesByType = safeIncrement(amountOfEntriesByType, entry.type, increment);
    if (!newAmountOfEntriesByType[entry.type]) setTypes((prev) => prev?.filter((type) => type !== entry.type));
    setAmountOfEntriesByType({ ...newAmountOfEntriesByType });

    // Update filter counts for project
    const projectId = getProjectId(entry);
    if (!projectId) return;

    const project = await getProject(projectId);
    if (!project) return;

    const newAmountOfEntriesByProject = safeIncrement(amountOfEntriesByProjectTitle, project.title, increment);
    if (!newAmountOfEntriesByProject[project.title]) setProjects((prev) => prev?.filter((p) => p.id !== project.id));
    setAmountOfEntriesByProjectTitle({ ...newAmountOfEntriesByProject });
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

  const contextObject: NewsFeedContextInterface = {
    feed: newsFeedEntries,
    sort,
    filters,
    projects: projects?.sort((a, b) => a.title.localeCompare(b.title)),
    types: types.sort((a, b) => a.localeCompare(b)),
    amountOfEntriesByProjectTitle,
    amountOfEntriesByType,
    isLoading,
    hasMore,
    refetchFeed: () => refetchFeed({ filters, page: pageNumber }),
    addEntry,
    removeEntry,
    toggleSort,
    setFilters: updateFilters,
    loadNextPage,
  };

  return <NewsFeedContext.Provider value={contextObject}> {children}</NewsFeedContext.Provider>;
};

export const useNewsFeed = () => useContext(NewsFeedContext);
