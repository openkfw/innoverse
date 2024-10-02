import Image from 'next/image';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import ErrorPage from '@/components/error/ErrorPage';
import NewsFeedContainer from '@/components/newsFeed/NewsFeedContainer';
import * as m from '@/src/paraglide/messages.js';
import { getNewsFeedPageProps } from '@/utils/requests/newsFeedEntries/requests';

import { NewsFeed } from '../../components/newsPage/NewsFeed';
import { NewsFeedContextProvider } from '../contexts/news-feed-context';

import backgroundImage from '/public/images/news-background.png';
import { NewsFeedHighlightContextProvider } from '@/app/contexts/news-feed-highlight-context';

export const dynamic = 'force-dynamic';

async function NewsFeedPage() {
  const props = await getNewsFeedPageProps();

  if (!props?.initialNewsFeed) return <ErrorPage />;

  return (
    <Stack spacing={8} useFlexGap direction="column">
      <Image
        src={backgroundImage}
        alt={m.app_news_page_imageAlt()}
        width={1792}
        height={1024}
        style={{
          position: 'fixed',
          width: '100%',
          height: 264,
          zIndex: -1,
          background: `lightgray 50% / cover no-repeat`,
          mixBlendMode: 'plus-lighter',
        }}
      />
      <Container>
        <Box style={{ position: 'relative' }}>
          <BreadcrumbsNav activePage={m.app_news_page_news()} />
        </Box>

        <NewsFeedContextProvider
          initiallyLoadedNewsFeed={props.initialNewsFeed}
          countByProjectTitle={props.newsFeedEntriesByProject}
          countByType={props.newsFeedEntriesByType}
          projects={props.projects}
          types={props.types}
        >
          <NewsFeedHighlightContextProvider>
            <NewsFeedContainer>
              <NewsFeed />
            </NewsFeedContainer>
          </NewsFeedHighlightContextProvider>
        </NewsFeedContextProvider>
      </Container>
    </Stack>
  );
}

export default NewsFeedPage;
