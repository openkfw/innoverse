'use client';

import React from 'react';

import { NewsFeedFilters, useNewsFeed } from '@/app/contexts/news-feed-context';
import { ObjectType } from '@/common/types';
import FilterSelect, { FilterOption } from '@/components/common/FilterSelect';
import * as m from '@/src/paraglide/messages.js';

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
        return m.components_newsFeed_newsFeedTypeFilter_comments();
      case ObjectType.EVENT:
        return m.components_newsFeed_newsFeedTypeFilter_events();
      case ObjectType.COLLABORATION_QUESTION:
        return m.components_newsFeed_newsFeedTypeFilter_questions();
      case ObjectType.OPPORTUNITY:
        return m.components_newsFeed_newsFeedTypeFilter_opportunities();
      case ObjectType.POST:
        return m.components_newsFeed_newsFeedTypeFilter_posts();
      case ObjectType.PROJECT:
        return m.components_newsFeed_newsFeedTypeFilter_projects();
      case ObjectType.SURVEY_QUESTION:
        return m.components_newsFeed_newsFeedTypeFilter_surveys();
      case ObjectType.UPDATE:
        return m.components_newsFeed_newsFeedTypeFilter_updates();
      default:
        return m.components_newsFeed_newsFeedTypeFilter_others();
    }
  };

  const options: FilterOption[] = types.map((type) => ({
    name: type,
    label: getLabel(type),
    count: entriesByType[type],
  }));

  return (
    <FilterSelect
      data-testid="news-type-filter"
      title="Art"
      isLoading={isLoading}
      options={options}
      onSelect={updateFilters}
      maxOptionsToDisplayCollapsed={5}
    />
  );
}
