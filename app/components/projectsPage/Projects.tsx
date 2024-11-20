'use client';

import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useProjects } from '@/app/contexts/project-page-context';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getImageByBreakpoint } from '@/utils/helpers';

import ProjectCard from '../common/project/ProjectCard';
import { CardSkeleton } from '../common/skeletons/CardSkeleton';
import { defaultImage } from '../landing/featuredProjectSection/FeaturedProjectSlider';

interface ProjectPageProps {
  sx?: SxProps;
}

export const Projects = (props: ProjectPageProps) => {
  const { sx } = props;
  const { loadNextPage, hasMore, isLoading, projects } = useProjects();

  return (
    <Box sx={{ width: '100%', ...sx }} data-testid="news-container">
      <InfiniteScroll
        dataLength={projects?.length || 0}
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
        <Box sx={projectsListStyle}>{isLoading ? <SkeletonList /> : <ProjectsList />}</Box>
      </InfiniteScroll>
    </Box>
  );
};

const SkeletonList = () => Array.from({ length: 10 }).map((_, key) => <CardSkeleton key={key} size={cardSize} />);

const ProjectsList = () => {
  const { projects } = useProjects();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return projects?.map((p, key) => {
    const image = getImageByBreakpoint(isSmallScreen, p.image) || defaultImage;

    return (
      <ProjectCard
        key={key}
        id={p.id}
        img={image}
        imageHeight={200}
        contributors={p.team}
        title={p.title}
        summary={p.summary}
        status={p.status}
        size={cardSize}
        sx={{ flexGrow: 1, maxWidth: 466 }}
      />
    );
  });
};

const cardSize = { height: 550, width: 354 };

const projectsListStyle = {
  display: 'flex',
  gap: 4,
  [theme.breakpoints.down('md')]: {
    gap: 2,
  },
  flexWrap: 'wrap',
  justifyContent: 'center',
};
