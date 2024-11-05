'use client';

import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { ObjectType } from '@/common/types';
import { NewsSkeleton } from '@/components/newsPage/skeletons/NewsSkeleton';
import { NewsCollaborationCommentThread } from '@/components/newsPage/threads/NewsCollaborationCommentThread';
import * as m from '@/src/paraglide/messages.js';

import NewsCardWrapper from './cards/common/NewsCardWrapper';
import NewsCollabQuestionCard from './cards/NewsCollabQuestionCard';
import NewsEventCard from './cards/NewsEventCard';
import NewsProjectCard from './cards/NewsProjectCard';
import NewsSurveyCard from './cards/NewsSurveyCard';
import { NewsPostThread } from './threads/NewsPostThread';
import { NewsUpdateThread } from './threads/NewsUpdateThread';

interface NewsProps {
  sx?: SxProps;
}

export const NewsFeed = (props: NewsProps) => {
  const { sx } = props;
  const { loadNextPage, hasMore, isLoading, feed } = useNewsFeed();

  return (
    <Box sx={{ width: '100%', ...sx }} data-testid="news-container">
      {isLoading ? (
        <NewsSkeleton count={5} />
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

  return (
    <Stack spacing={2} direction="column">
      {feed.map((entry, key) => (
        <NewsCardWrapper key={key}>
          {(() => {
            switch (entry.type) {
              case ObjectType.UPDATE:
                return <NewsUpdateThread entry={entry} key={`${key}-${entry.item.id}`} />;

              case ObjectType.PROJECT:
                return <NewsProjectCard entry={entry} />;

              case ObjectType.EVENT:
                return <NewsEventCard entry={entry} />;

              case ObjectType.COLLABORATION_QUESTION:
                return <NewsCollabQuestionCard entry={entry} />;

              case ObjectType.COLLABORATION_COMMENT:
                return <NewsCollaborationCommentThread entry={entry} />;

              case ObjectType.SURVEY_QUESTION:
                return <NewsSurveyCard entry={entry} />;

              case ObjectType.POST:
                return <NewsPostThread entry={entry} key={`${key}-${entry.item.id}`} />;

              default:
                return null;
            }
          })()}
        </NewsCardWrapper>
      ))}
    </Stack>
  );
};
