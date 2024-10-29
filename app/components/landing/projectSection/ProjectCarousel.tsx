'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import CustomButton from '@/components/common/CustomButton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getImageByBreakpoint } from '@/utils/helpers';

import ProjectCard from '../../common/project/ProjectCard';
import Carousel from '../Carousel';
import { defaultImage } from '../featuredProjectSection/FeaturedProjectSlider';

import { ProjectProps } from './ProjectSection';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

type ProjectCarouselProps = ProjectProps & {
  isLoading: boolean;
};

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
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
      moreButton={
        <Link href="news">
          <CustomButton>{m.components_landing_projectSection_projectSection_moreInitiatives()}</CustomButton>
        </Link>
      }
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
