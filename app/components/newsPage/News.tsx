'use client';

import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';

import { useNewsFilter } from '@/app/contexts/news-filter-context';
import { ProjectUpdate } from '@/common/types';
import theme from '@/styles/theme';
import { getProjectsUpdatesFilter } from '@/utils/requests';

import NewsCard from './NewsCard';

interface NewsProps {
  updateAdded: boolean;
  sx?: SxProps;
}

export enum SortValues {
  DESC = 'desc',
  ASC = 'asc',
}

export const News = (props: NewsProps) => {
  const { updateAdded, sx } = props;
  const { news, setNews, refetchNews, filters, sort } = useNewsFilter();
  const [hasMoreValue, setHasMoreValue] = useState(true);
  const [index, setIndex] = useState(1);

  const loadScrollData = async () => {
    const data = (await getProjectsUpdatesFilter(sort, filters, index, filters.resultsPerPage)) as ProjectUpdate[];
    setNews((prevItems: ProjectUpdate[]) => [...prevItems, ...data]);
    data.length > 0 ? setHasMoreValue(true) : setHasMoreValue(false);
    setIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      refetchNews();
      setIndex(2);
    };
    fetchData();
  }, [filters, sort]);

  useEffect(() => {
    const fetchData = async () => {
      refetchNews();
      setIndex(2);
    };
    if (updateAdded) {
      fetchData();
    }
  }, [updateAdded]);

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <InfiniteScroll
        dataLength={news.length}
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
          {news && news.map((update, key) => <NewsCard key={key} update={update} sx={cardStyles} />)}
        </Stack>
      </InfiniteScroll>
    </Box>
  );
};

const cardStyles = {
  paddingX: '99px',
  paddingY: 4,
  [theme.breakpoints.down('md')]: {
    p: 3,
  },
  [theme.breakpoints.up('sm')]: {
    width: '100%',
  },
};
