'use client';

import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import {
  CollaborationComment,
  CollaborationQuestion,
  Event,
  ObjectType,
  Post,
  Project,
  ProjectUpdate,
  SurveyQuestion,
} from '@/common/types';
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
  const { loadNextPage, hasMore, isLoading, feed, removeEntry } = useNewsFeed();

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
              <CircularProgress />
            </Stack>
          }
          endMessage={
            <Typography color="secondary.main" sx={{ textAlign: 'center', mt: 2 }}>
              {m.components_newsPage_newsFeed_dataReceived()}
            </Typography>
          }
        >
          <Stack spacing={2} direction="column">
            {feed.map((entry, key) => (
              <NewsCardWrapper key={key} entry={entry}>
                {(() => {
                  switch (entry.type) {
                    case ObjectType.UPDATE:
                      const update = entry.item as ProjectUpdate;
                      return (
                        <NewsUpdateThread
                          key={`${key}-${update.id}`}
                          update={update}
                          onDelete={() => removeEntry(entry)}
                        />
                      );
                    case ObjectType.PROJECT:
                      return <NewsProjectCard project={entry.item as Project} />;
                    case ObjectType.EVENT:
                      return <NewsEventCard event={entry.item as Event} />;
                    case ObjectType.COLLABORATION_QUESTION:
                      return <NewsCollabQuestionCard question={entry.item as CollaborationQuestion} />;
                    case ObjectType.COLLABORATION_COMMENT:
                      const collaborationComment = entry.item as CollaborationComment;
                      return (
                        <NewsCollaborationCommentThread
                          comment={collaborationComment}
                          onDelete={() => removeEntry(entry)}
                        />
                      );
                    case ObjectType.SURVEY_QUESTION:
                      return <NewsSurveyCard surveyQuestion={entry.item as SurveyQuestion} />;
                    case ObjectType.POST:
                      const post = entry.item as Post;
                      return (
                        <NewsPostThread key={`${key}-${post.id}`} post={post} onDelete={() => removeEntry(entry)} />
                      );
                    default:
                      return null;
                  }
                })()}
              </NewsCardWrapper>
            ))}
          </Stack>
        </InfiniteScroll>
      )}
    </Box>
  );
};
