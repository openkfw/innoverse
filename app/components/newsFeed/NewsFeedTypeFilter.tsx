'use client';

import React from 'react';

import { NewsFeedFilters, useNewsFeed } from '@/app/contexts/news-feed-context';
import { ObjectType } from '@/common/types';
import FilterSelect, { FilterOption } from '@/components/common/FilterSelect';

type NewsFeedTypeFilterProps = {
  isLoading: boolean;
  filters: NewsFeedFilters;
  setFilters: (filters: NewsFeedFilters) => void;
};

export default function NewsFeedTypeFilter(props: NewsFeedTypeFilterProps) {
  const { isLoading, filters, setFilters } = props;
  const { types, amountOfEntriesByType: entriesByType } = useNewsFeed();

  const updateFilters = (types: string[]) => {
    const updatedFilters = { ...filters, types };
    setFilters(updatedFilters);
  };

  const getLabel = (objectType: ObjectType) => {
    switch (objectType) {
      case ObjectType.COLLABORATION_COMMENT:
        return 'Kommentare';
      case ObjectType.EVENT:
        return 'Events';
      case ObjectType.COLLABORATION_QUESTION:
        return 'Fragen';
      case ObjectType.OPPORTUNITY:
        return 'Opportunity';
      case ObjectType.POST:
        return 'Posts';
      case ObjectType.PROJECT:
        return 'Projekte';
      case ObjectType.SURVEY_QUESTION:
        return 'Umfragen';
      case ObjectType.UPDATE:
        return 'Updates';
      case ObjectType.COLLABORATION_COMMENT:
      default:
        return 'Andere';
    }
  };

  const options: FilterOption[] = types.map((type) => ({
    name: type,
    label: getLabel(type),
    count: entriesByType[type],
  }));

  return (
    <FilterSelect
      title="Art"
      isLoading={isLoading}
      options={options}
      onSelect={updateFilters}
      maxOptionsToDisplayCollapsed={3}
    />
  );
}
