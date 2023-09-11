import { SetStateAction, useRef, useState } from 'react';
import Slider from 'react-slick';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { ProjectCarouselItem, projects } from '@/repository/mock/landing/project-section';

import ArrowControllers from './ArrowControllers';
import ProjectCard from './ProjectCard';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ProjectCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState<ProjectCarouselItem[]>(projects);
  const sliderRef = useRef<Slider>(null);

  const handleMouseDown = (e: { pageX: any }) => {
    const startX = e.pageX;
    const mouseMoveHandler = (moveEvent: { pageX: any }) => {
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

  const settings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: false,
    beforeChange: (current: number, next: SetStateAction<number>) => setCurrentSlide(next),
    variableWidth: true,
    rows: 1,
  };

  return (
    <Grid container item xs={12} spacing={2} onMouseDown={handleMouseDown}>
      <Box sx={{ marginBottom: 4 }}>
        <Slider {...settings} ref={sliderRef}>
          {slides.map((item) => (
            <Grid item key={item.id}>
              <ProjectCard
                id={item.id}
                img={item.image}
                contributors={item.contributors}
                title={item.title}
                description={item.description}
              />
            </Grid>
          ))}
        </Slider>
      </Box>
      <ArrowControllers
        currentSlide={currentSlide}
        slidesLength={slides.length - 1}
        prevSlide={() => sliderRef?.current?.slickPrev()}
        nextSlide={() => sliderRef?.current?.slickNext()}
      />
    </Grid>
  );
}
