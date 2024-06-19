'use client';

import React from 'react';

import Card from '@mui/material/Card';

import { useNewsFeed } from '@/app/contexts/news-feed-context';

import NewsFeedProjectsFilter from './NewsFeedProjectsFilter';
import NewsFeedTypeFilter from './NewsFeedTypeFilter';

export default function NewsFeedFilter() {
  const { filters, setFilters } = useNewsFeed();
  return (
    <Card sx={cardStyles} data-testid="news-filter">
      <NewsFeedProjectsFilter filters={filters} setFilters={setFilters} />
      <NewsFeedTypeFilter filters={filters} setFilters={setFilters} />
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
};
