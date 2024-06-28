'use client';

import React, { PropsWithChildren } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useNewsFilter } from '@/app/contexts/news-filter-context';
import { ProjectUpdateWithAdditionalData } from '@/common/types';
import { CardSkeletons } from '@/components/skeletons/CardSkeletons';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getProjectUpdatesPage } from '@/utils/requests/updates/requests';

import NewsCard from './NewsCard';

interface NewsProps {
  sx?: SxProps;
}

export const News = (props: NewsProps) => {
  const { sx } = props;
  const { news, setNews, filters, sort, pageNumber, setPageNumber, hasMoreValue, setHasMoreValue, isLoading } =
    useNewsFilter();

  const loadScrollData = async () => {
    const filteredUpdates = await getProjectUpdatesPage({ filters, page: pageNumber, sort: sort });
    if (filteredUpdates) {
      setNews((prevItems: ProjectUpdateWithAdditionalData[]) => [...prevItems, ...filteredUpdates]);
      filteredUpdates.length > 0 ? setHasMoreValue(true) : setHasMoreValue(false);
      setPageNumber((prevIndex: number) => prevIndex + 1);
    }
  };

  return (
    <CustomInfiniteScroll
      numberOfItems={news.length}
      hasMore={hasMoreValue}
      isLoading={isLoading}
      onScroll={loadScrollData}
      loadingSkeleton={<CardSkeletons count={5} />}
      sx={sx}
    >
      {news && news.map((update, key) => <NewsCard key={key} update={update} sx={cardStyles} />)}
    </CustomInfiniteScroll>
  );
};

type CustomInfiniteScrollProps = PropsWithChildren & {
  numberOfItems: number;
  hasMore: boolean;
  isLoading: boolean;
  loadingSkeleton: React.ReactNode;
  onScroll: () => Promise<void>;
  sx?: SxProps;
};

export const CustomInfiniteScroll = (props: CustomInfiniteScrollProps) => {
  const { numberOfItems, hasMore, children, isLoading, loadingSkeleton, onScroll, sx } = props;

  return (
    <Box sx={{ width: '100%', ...sx }} data-testid="news-container">
      {isLoading ? (
        loadingSkeleton
      ) : (
        <InfiniteScroll
          dataLength={numberOfItems}
          next={onScroll}
          hasMore={hasMore}
          scrollThreshold={0.5}
          style={{ overflow: 'unset' }}
          loader={
            <Stack key={0} sx={{ mt: 2 }} alignItems="center">
              <CircularProgress />
            </Stack>
          }
          endMessage={
            <Typography color="secondary.main" sx={{ textAlign: 'center', mt: 2 }}>
              {m.components_newsPage_news_dataReceived()}
            </Typography>
          }
        >
          <Stack spacing={2} direction="column" justifyContent="flex-end" alignItems="flex-end">
            {children}
          </Stack>
        </InfiniteScroll>
      )}
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
