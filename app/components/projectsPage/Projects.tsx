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
      {isLoading ? (
        <Grid container rowSpacing={5} columnSpacing={1}>
          {Array.from({ length: 6 }).map((_, key) => (
            <Grid item key={key} xs={12} sm={6} md={4} sx={cardContainerStyles}>
              <CardSkeleton size={cardSize} />
            </Grid>
          ))}
        </Grid>
      ) : (
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
          <ProjectPageContent />
        </InfiniteScroll>
      )}
    </Box>
  );
};

const ProjectPageContent = () => {
  const { projects } = useProjects();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container rowSpacing={5} columnSpacing={1}>
      {projects?.map((p, key) => {
        const image = getImageByBreakpoint(isSmallScreen, p.image) || defaultImage;

        return (
          <Grid item key={p.id} xs={12} sm={6} md={4} sx={cardContainerStyles}>
            <ProjectCard
              key={key}
              id={p.id}
              img={image}
              contributors={p.team}
              title={p.title}
              summary={p.summary}
              status={p.status}
              cardSize={cardSize}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const cardSize = { height: 550, width: 466 };

const cardContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  zIndex: -1,
  [theme.breakpoints.down('sm')]: {
    marginLeft: '3px',
  },
};
