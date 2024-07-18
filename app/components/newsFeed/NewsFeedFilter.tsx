'use client';

import React from 'react';

import Card from '@mui/material/Card';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { FilterOption } from '@/components/common/FilterSelect';

import NewsFeedProjectsFilter from './NewsFeedProjectsFilter';
import NewsFeedSearchFilter from './NewsFeedSearchFilter';
import NewsFeedTypeFilter from './NewsFeedTypeFilter';

export default function NewsFeedFilter() {
  const { projects, amountOfEntriesByProjectTitle: entriesByProjectTitle, filters, setFilters } = useNewsFeed();

  const updateFilters = (projectIds: string[]) => {
    const updatedFilters = { ...filters, projectIds };
    setFilters(updatedFilters);
  };

  const projectOptions: FilterOption[] | undefined = projects?.map((project) => ({
    name: project.id,
    label: project.title,
    count: entriesByProjectTitle[project.title],
  }));

  return (
    <Card sx={cardStyles} data-testid="news-filter">
      <NewsFeedSearchFilter isLoading={!projectOptions} filters={filters} setFilters={setFilters} />
      <NewsFeedProjectsFilter isLoading={!projectOptions} onSelect={updateFilters} options={projectOptions} />
      <NewsFeedTypeFilter isLoading={!projectOptions} filters={filters} setFilters={setFilters} />
    </Card>
  );
}

// News Card Styles
const cardStyles = {
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  background: 'rgba(255, 255, 255, 0.10)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 180px)',
};
