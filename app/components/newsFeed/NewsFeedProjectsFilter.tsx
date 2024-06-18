'use client';

import React from 'react';

import { NewsFeedFilters, useNewsFeed } from '@/app/contexts/news-feed-context';
import FilterSelect, { FilterOption } from '@/components/common/FilterSelect';

type NewsFeedProjectFilterProps = {
  filters: NewsFeedFilters;
  setFilters: (filters: NewsFeedFilters) => void;
};

export default function NewsFeedProjectsFilter(props: NewsFeedProjectFilterProps) {
  const { setFilters, filters } = props;
  const { projects, amountOfEntriesByProjectTitle: entriesByProjectTitle } = useNewsFeed();

  const updateFilters = (projectIds: string[]) => {
    const updatedFilters = { ...filters, projectIds };
    setFilters(updatedFilters);
  };

  const options: FilterOption[] = projects.map((project) => ({
    name: project.id,
    label: project.title,
    count: entriesByProjectTitle[project.title],
  }));

  return <FilterSelect title="Initiativen" options={options} onSelect={updateFilters} />;
}
