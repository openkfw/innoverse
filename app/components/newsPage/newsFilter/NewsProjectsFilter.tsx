'use client';

import React from 'react';

import { useNewsFilter } from '@/app/contexts/news-filter-context';
import { NewsFilterProps } from '@/common/types';
import FilterSelect, { FilterOption } from '@/components/common/FilterSelect';

export default function NewsProjectsFilter(props: NewsFilterProps) {
  const { setFilters, filters } = props;
  const { projects, amountOfNewsProject, refetchNews } = useNewsFilter();

  const updateFilters = (newFilters: string[]) => {
    setFilters({ ...filters, projects: newFilters });
    refetchNews({ filters: { ...filters, projects: newFilters }, fullRefetch: false });
  };

  const options: FilterOption[] = projects.map((project) => ({
    name: project,
    label: project,
    count: amountOfNewsProject[project],
  }));
  return <FilterSelect title="Initiativen" options={options} onSelect={updateFilters} />;
}
