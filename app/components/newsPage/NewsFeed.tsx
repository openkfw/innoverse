'use client';

import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { ObjectType } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';

import { CommonSkeleton } from '../common/skeletons/CommonSkeleton';

import NewsCardWrapper from './cards/common/NewsCardWrapper';
import NewsCollabQuestionCard from './cards/NewsCollabQuestionCard';
import NewsEventCard from './cards/NewsEventCard';
import NewsPostCard from './cards/NewsPostCard';
import NewsProjectCard from './cards/NewsProjectCard';
import NewsSurveyCard from './cards/NewsSurveyCard';
import NewsUpdateCard from './cards/NewsUpdateCard';
import NewsItemThread from './threads/NewsItemThread';

interface NewsProps {
  sx?: SxProps;
}

export const NewsFeed = (props: NewsProps) => {
  const { sx } = props;
  const { loadNextPage, hasMore, isLoading, feed } = useNewsFeed();

  return (
    <Box sx={{ width: '100%', ...sx }} data-testid="news-container">
      {isLoading ? (
        <CommonSkeleton count={5} size={{ width: 'full', height: '200px' }} />
      ) : (
        <InfiniteScroll
          dataLength={feed.length}
          next={loadNextPage}
          hasMore={hasMore}
          scrollThreshold={0.5}
          style={{ overflow: 'unset' }}
          loader={
            <Stack key={0} sx={{ mt: 2 }} alignItems="center">
              <CircularProgress aria-label="loading" />
            </Stack>
          }
          endMessage={
            <Typography color="secondary.main" sx={{ textAlign: 'center', mt: 2 }}>
              {m.components_newsPage_newsFeed_dataReceived()}
            </Typography>
          }
        >
          <NewsFeedContent />
        </InfiniteScroll>
      )}
    </Box>
  );
};

const NewsFeedContent = () => {
  const { feed } = useNewsFeed();

  const cardComponentMap = {
    [ObjectType.UPDATE]: NewsUpdateCard,
    [ObjectType.PROJECT]: NewsProjectCard,
    [ObjectType.EVENT]: NewsEventCard,
    [ObjectType.COLLABORATION_QUESTION]: NewsCollabQuestionCard,
    [ObjectType.SURVEY_QUESTION]: NewsSurveyCard,
    [ObjectType.POST]: NewsPostCard,
  };

  return (
    <Stack spacing={2} direction="column">
      {feed.map((entry) => {
        const Card = cardComponentMap[entry.type];
        if (!Card) return null;
        return (
          <NewsCardWrapper key={`${entry.type}-${entry.item.id}`}>
            <NewsItemThread Card={Card} entry={entry} />
          </NewsCardWrapper>
        );
      })}
    </Stack>
  );
};
