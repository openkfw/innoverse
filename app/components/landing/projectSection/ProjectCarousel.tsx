'use client';

import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import theme from '@/styles/theme';
import { getImageByBreakpoint } from '@/utils/helpers';

import ProjectCard from '../../common/project/ProjectCard';
import Carousel from '../Carousel';
import { defaultImage } from '../featuredProjectSection/FeaturedProjectSlider';

import { ProjectProps } from './ProjectSection';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export default function ProjectCarousel({ projects }: ProjectProps) {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Carousel
      items={projects}
      sliderSettings={{
        slidesToShow: 1,
        slidesToScroll: isSmallScreen ? 1 : 2,
      }}
      renderItem={(project) => {
        const image = getImageByBreakpoint(isSmallScreen, project.image) || defaultImage;
        return (
          <Grid item key={project.id} sx={cardContainerStyles}>
            <ProjectCard
              id={project.id}
              img={image}
              contributors={project.team}
              title={project.title}
              summary={project.summary}
              status={project.status}
              cardSize={{ height: 490, width: 466 }}
            />
          </Grid>
        );
      }}
      sx={{ zIndex: 1, minHeight: '490px' }}
    />
  );
}

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
