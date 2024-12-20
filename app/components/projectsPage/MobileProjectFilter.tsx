'use client';

import React from 'react';

import { APPLY_BUTTON } from '../common/ApplyFilterButton';
import MobileFilterDrawer from '../common/MobileFilterDrawer';

import ProjectFilter from './ProjectFilter';

interface MobileProjectFilterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileProjectFilter(props: MobileProjectFilterProps) {
  const { open, setOpen } = props;

  const applyFilters = () => {
    setOpen(false);
  };

  return (
    <MobileFilterDrawer
      open={open}
      setOpen={setOpen}
      applyFilters={applyFilters}
      applyButtonType={APPLY_BUTTON.ENABLED}
      FilterContent={<ProjectFilter />}
    />
  );
}
