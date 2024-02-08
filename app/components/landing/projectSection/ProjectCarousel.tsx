'use client';
import { SetStateAction, useRef, useState } from 'react';
import Slider from 'react-slick';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Project } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import theme from '@/styles/theme';

import { defaultImage } from '../featuredProjectSection/FeaturedProjectSlider';

import ArrowControllers from './ArrowControllers';
import ProjectCard from './ProjectCard';
import { ProjectProps } from './ProjectSection';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export default function ProjectCarousel(props: ProjectProps) {
  const { projects } = props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState<Project[]>(projects);
  const sliderRef = useRef<Slider>(null);

  const handleMouseDown = (e: { pageX: number }) => {
    const startX = e.pageX;
    const mouseMoveHandler = (moveEvent: { pageX: number }) => {
      const endX = moveEvent.pageX;
      const distance = endX - startX;
      if (sliderRef.current) {
        if (distance > 100) {
          sliderRef.current.slickPrev();
          document.removeEventListener('mousemove', mouseMoveHandler);
        } else if (distance < -100) {
          sliderRef.current.slickNext();
          document.removeEventListener('mousemove', mouseMoveHandler);
        }
      }
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
    });
  };

  const isWideScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const settings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: false,
    beforeChange: (current: number, next: SetStateAction<number>) => setCurrentSlide(next),
    variableWidth: isWideScreen,
    rows: 1,
  };

  return (
    <Grid container item xs={12} spacing={2} onMouseDown={handleMouseDown} sx={wrapper}>
      <Box sx={sliderBox}>
        <Slider {...settings} ref={sliderRef}>
          {slides.map((item) => {
            return (
              <Grid item key={item.id} sx={cardContainerStyles}>
                <ProjectCard
                  id={item.id}
                  img={item.image || defaultImage}
                  contributors={item.team}
                  title={item.title}
                  summary={item.summary}
                  status={item.status}
                />
              </Grid>
            );
          })}
        </Slider>
      </Box>

      <Box sx={navigationStyles}>
        <ArrowControllers
          currentSlide={currentSlide}
          slidesLength={slides.length - 1}
          prevSlide={() => sliderRef?.current?.slickPrev()}
          nextSlide={() => sliderRef?.current?.slickNext()}
        />
      </Box>
    </Grid>
  );
}

// Project Carousel Styles
const wrapper = {
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
};

const sliderBox = {
  marginBottom: 4,
  [theme.breakpoints.down('sm')]: {
    width: 'min(90%, 368px)',
  },
  [theme.breakpoints.up('sm')]: {
    '& .slick-list': {
      overflow: 'visible',
    },
  },
};

const cardContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  [theme.breakpoints.down('sm')]: {
    marginLeft: '3px',
  },
};

const navigationStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: 'min(85%, 344px)',
  marginLeft: -1,
};
