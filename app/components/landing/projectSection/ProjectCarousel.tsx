'use client';

import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import theme from '@/styles/theme';

import Carousel from '../Carousel';
import { defaultImage } from '../featuredProjectSection/FeaturedProjectSlider';

import ProjectCard from './ProjectCard';
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
      renderItem={(project) => (
        <Grid item key={project.id} sx={cardContainerStyles}>
          <ProjectCard
            id={project.id}
            img={project.image || defaultImage}
            contributors={project.team}
            title={project.title}
            summary={project.summary}
            status={project.status}
          />
        </Grid>
      )}
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
