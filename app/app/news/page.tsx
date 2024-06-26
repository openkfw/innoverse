import Image from 'next/image';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import ErrorPage from '@/components/error/ErrorPage';
import NewsFeedContainer from '@/components/newsFeed/NewsFeedContainer';
import { getNewsFeedPageProps } from '@/utils/requests/newsFeedEntries/requests';

import { NewsFeed } from '../../components/newsPage/NewsFeed';
import { NewsFeedContextProvider } from '../contexts/news-feed-context';

import backgroundImage from '/public/images/news-background.png';

export const dynamic = 'force-dynamic';

async function NewsFeedPage() {
  const props = await getNewsFeedPageProps();

  if (!props?.initialNewsFeed) return <ErrorPage />;

  return (
    <Stack spacing={8} useFlexGap direction="column">
      <Image
        src={backgroundImage}
        alt="news-background"
        sizes="33vw"
        style={{
          position: 'absolute',
          width: '100%',
          height: 264,
          zIndex: -1,
          background: `lightgray 50% / cover no-repeat`,
          mixBlendMode: 'plus-lighter',
        }}
      />
      <Container>
        <Box style={{ position: 'relative' }}>
          <BreadcrumbsNav activePage="News" />
        </Box>

        <NewsFeedContextProvider
          initiallyLoadedNewsFeed={props.initialNewsFeed}
          countByProjectTitle={props.newsFeedEntriesByProject}
          countByType={props.newsFeedEntriesByType}
          projects={props.projects}
          types={props.types}
        >
          <NewsFeedContainer>
            <NewsFeed />
          </NewsFeedContainer>
        </NewsFeedContextProvider>
      </Container>
    </Stack>
  );
}

export default NewsFeedPage;
