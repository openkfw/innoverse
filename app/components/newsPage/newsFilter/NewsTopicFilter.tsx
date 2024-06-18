'use client';

import React from 'react';

import { useNewsFilter } from '@/app/contexts/news-filter-context';
import { NewsFilterProps } from '@/common/types';
import FilterSelect, { FilterOption } from '@/components/common/FilterSelect';

export default function NewsTopicFilter(props: NewsFilterProps) {
  const { filters, setFilters } = props;
  const { topics, amountOfNewsTopic, refetchNews } = useNewsFilter();

  const updateFilters = (newFilters: string[]) => {
    setFilters({ ...filters, topics: newFilters });
    refetchNews({ filters: { ...filters, topics: newFilters }, fullRefetch: false });
  };

  const options: FilterOption[] = topics.map((topic) => ({
    name: topic,
    label: topic,
    count: amountOfNewsTopic[topic],
  }));
  return <FilterSelect title="Themen" options={options} maxOptionsToDisplayCollapsed={3} onSelect={updateFilters} />;
}
