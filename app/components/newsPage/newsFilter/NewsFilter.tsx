'use client';

import React from 'react';

import Card from '@mui/material/Card';

import { useNewsFilter } from '@/app/contexts/news-filter-context';
import theme from '@/styles/theme';

import NewsProjectsFilter from './NewsProjectsFilter';
import NewsTopicFilter from './NewsTopicFilter';

export default function NewsFilter() {
  const { filters, setFilters } = useNewsFilter();
  return (
    <Card sx={cardStyles} data-testid="news-filter">
      <NewsProjectsFilter filters={filters} setFilters={setFilters} />
      <NewsTopicFilter filters={filters} setFilters={setFilters} />
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
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '100%',
  },
};
