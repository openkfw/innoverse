'use client';

import React from 'react';

import FilterSelect, { FilterOption } from '@/components/common/FilterSelect';

type NewsFeedProjectFilterProps = {
  isLoading: boolean;
  options: FilterOption[] | undefined;
  onSelect: (projectIds: string[]) => void;
};

export default function NewsFeedProjectsFilter(props: NewsFeedProjectFilterProps) {
  const { isLoading, options, onSelect } = props;

  return <FilterSelect title="Initiativen" options={options} isLoading={isLoading} onSelect={onSelect} />;
}
