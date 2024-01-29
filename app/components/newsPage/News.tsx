'use client';

import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Filters, ProjectUpdate } from '@/common/types';
import { getProjectsUpdatesFilter } from '@/utils/requests';

import NewsCard from './NewsCard';

type NewsProps = {
  filters: Filters;
};

export enum SortValues {
  DESC = 'desc',
  ASC = 'asc',
}

export const News = (props: NewsProps) => {
  const { filters } = props;
  const [sort, setSort] = useState<SortValues>(SortValues.DESC);
  const [hasMoreValue, setHasMoreValue] = useState(true);
  const [scrollData, setScrollData] = useState<ProjectUpdate[]>([]);
  const [index, setIndex] = useState(1);

  const sortNews = () => {
    if (sort === SortValues.ASC) {
      setSort(SortValues.DESC);
      return;
    }
    setSort(SortValues.ASC);
  };

  const loadScrollData = async () => {
    const data = (await getProjectsUpdatesFilter(sort, filters, index, filters.resultsPerPage)) as ProjectUpdate[];
    setScrollData((prevItems) => [...prevItems, ...data]);
    data.length > 0 ? setHasMoreValue(true) : setHasMoreValue(false);
    setIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = (await getProjectsUpdatesFilter(sort, filters, 1, filters.resultsPerPage)) as ProjectUpdate[];
      setScrollData([...data]);
      setIndex(2);
    };
    fetchData();
  }, [filters, sort]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="text"
          startIcon={<FilterListIcon sx={{ color: 'secondary.main' }} />}
          sx={buttonStyle}
          onClick={sortNews}
        >
          {sort === SortValues.DESC ? (
            <Typography variant="subtitle1" color="secondary.main">
              Neueste zuerst
            </Typography>
          ) : (
            <Typography variant="subtitle1" color="secondary.main">
              Älteste zuerst
            </Typography>
          )}
        </Button>
      </Box>

      <InfiniteScroll
        dataLength={scrollData.length}
        next={loadScrollData}
        hasMore={hasMoreValue}
        scrollThreshold={0.5}
        style={{ overflow: 'unset' }}
        loader={
          <Stack key={0} sx={{ mt: 2 }} alignItems="center">
            <CircularProgress />
          </Stack>
        }
        endMessage={
          <Typography color="secondary.main" sx={{ textAlign: 'center', mt: 1 }}>
            Alle Daten wurden geladen
          </Typography>
        }
      >
        <Stack spacing={2} direction="column" justifyContent="flex-end" alignItems="flex-end">
          {scrollData && scrollData.map((update) => <NewsCard key={update.id} update={update} />)}
        </Stack>
      </InfiniteScroll>
    </Box>
  );
};

const buttonStyle = {
  backgroundColor: 'transparent',
  ':hover': {
    backgroundColor: 'transparent',
  },
};
