'use client';

import React, { useCallback, useState } from 'react';
import { isEqual } from 'lodash';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { APPLY_BUTTON } from '../common/ApplyFilterButton';

import NewsFeedProjectsFilter from './NewsFeedProjectsFilter';
import NewsFeedSearchFilter from './NewsFeedSearchFilter';
import NewsFeedTypeFilter from './NewsFeedTypeFilter';
import { FilterOption } from '@/components/common/FilterSelect';
import MobileFilterDrawer from '../common/MobileFilterDrawer';

interface MobileNewsFeedFilterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileNewsFeedFilter(props: MobileNewsFeedFilterProps) {
  const { open, setOpen } = props;
  const { projects, amountOfEntriesByProjectTitle: entriesByProjectTitle, filters, setFilters } = useNewsFeed();
  const [newFilters, setNewFilters] = useState(filters);

  const applyFilters = () => {
    setFilters(newFilters);
    setOpen(false);
  };

  const getApplyButtonType = useCallback(() => {
    return isEqual(filters, newFilters) ? APPLY_BUTTON.DISABLED : APPLY_BUTTON.ENABLED;
  }, [newFilters, filters]);

  const updateFilters = (projectIds: string[]) => {
    const updatedFilters = { ...filters, projectIds };
    setNewFilters(updatedFilters);
  };

  const projectOptions: FilterOption[] | undefined = projects?.map((project) => ({
    name: project.id,
    label: project.title,
    count: entriesByProjectTitle[project.title],
  }));

  const filterContent = (
    <>
      <NewsFeedSearchFilter isLoading={!projectOptions} filters={filters} setFilters={setFilters} />
      <NewsFeedProjectsFilter isLoading={!projectOptions} onSelect={updateFilters} options={projectOptions} />
      <NewsFeedTypeFilter isLoading={!projectOptions} filters={filters} setFilters={setNewFilters} />
    </>
  );

  return (
    <MobileFilterDrawer
      open={open}
      setOpen={setOpen}
      applyFilters={applyFilters}
      applyButtonType={getApplyButtonType()}
      FilterContent={filterContent}
    />
  );
}
