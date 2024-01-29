'use client';

import React, { useState } from 'react';

import Grid from '@mui/material/Grid';

import { Filters } from '@/common/types';

import NewsFilter from './newsFilter/NewsFilter';
import { News } from './News';

const defaultFilters: Filters = { resultsPerPage: 10, projects: [], topics: [] };

export default function NewsContainer() {
  const [filters, setFilters] = useState(defaultFilters);

  return (
    <Grid item container spacing={3} sx={{ mt: 5 }} xs={12}>
      <Grid item container xs={3} justifyContent="flex-end">
        <NewsFilter filters={filters} setFilters={setFilters} />
      </Grid>
      <Grid item container xs={9} justifyContent="flex-end">
        <News filters={filters} />
      </Grid>
    </Grid>
  );
}
