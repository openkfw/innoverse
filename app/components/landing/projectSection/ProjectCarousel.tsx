import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

import Grid from '@mui/material/Grid';

import { ProjectCarouselItem, projects } from '@/repository/mock/landing/project-section';

import ArrowControllers from './ArrowControllers';
import ProjectCard from './ProjectCard';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ProjectCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState<ProjectCarouselItem[]>(projects);

  return (
    <Grid container item xs={12} spacing={2}>
      <Carousel
        swipeable
        emulateTouch
        useKeyboardArrows
        centerMode
        selectedItem={currentSlide}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        showArrows={false}
        transitionTime={600}
        centerSlidePercentage={40}
        onChange={(slide) => setCurrentSlide(slide)}
      >
        {slides.map((item) => (
          <Grid item xs={11} key={item.id}>
            <ProjectCard img={item.image} contributors={item.contributors} title={item.title} description={item.description} />
          </Grid>
        ))}
      </Carousel>
      <ArrowControllers
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        slidesLength={slides.length - 1}
      />
    </Grid>
  );
}
