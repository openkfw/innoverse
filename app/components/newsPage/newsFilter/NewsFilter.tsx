'use client';

import React from 'react';

import Card from '@mui/material/Card';

import { NewsFilterProps } from '@/common/types';
import theme from '@/styles/theme';

import ProjectsInput from './ProjectsInput';
import ResultsPerPageRadio from './ResultsPerPageInput';
import TopicInput from './TopicInput';

export default function NewsFilter(props: NewsFilterProps) {
  const { filters, setFilters } = props;

  return (
    <Card sx={cardStyles}>
      <ResultsPerPageRadio filters={filters} setFilters={setFilters} />
      <ProjectsInput filters={filters} setFilters={setFilters} />
      <TopicInput filters={filters} setFilters={setFilters} />
    </Card>
  );
}

// News Card Styles
const cardStyles = {
  marginY: 5,
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  background: 'rgba(255, 255, 255, 0.10)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  [theme.breakpoints.up('sm')]: {
    width: '250px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '100%',
  },
};
