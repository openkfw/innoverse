'use client';

import Box from '@mui/material/Box';
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
          <Box key={project.id} sx={cardContainerStyles}>
            <ProjectCard
              id={project.id}
              img={image}
              contributors={project.team}
              title={project.title}
              summary={project.summary}
              status={project.status}
              size={{ height: 490, width: 466 }}
            />
          </Box>
        );
      }}
      sx={carouselStyles}
    />
  );
}

const cardContainerStyles = {
  pr: 3,
  [theme.breakpoints.down('sm')]: { pr: 2 },
};

const carouselStyles = {
  zIndex: 1,
  minHeight: '490px',
  ml: -2,
  [theme.breakpoints.down('sm')]: {
    ml: -3,
  },
};
