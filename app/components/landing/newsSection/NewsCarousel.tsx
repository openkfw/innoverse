import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

import Grid from '@mui/material/Grid';

import { news, NewsSlider } from '@/repository/mock/landing/news-section';

import ArrowControllers from '../../common/SliderArrowControllers';

import NewsCard from './NewsCard';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function NewsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState<NewsSlider[]>(news);

  return (
    <Grid container item xs={12} spacing={2}>
      <Carousel
        className={'carousel'}
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
        centerSlidePercentage={30}
        onChange={(slide) => setCurrentSlide(slide)}
      >
        {slides.map((item) => (
          <Grid item xs={11} key={item.id}>
            <NewsCard
              title={item.title}
              subtitle={item.subtitle}
              theme={item.theme}
              publisher={item.publisher}
              avatar={item.avatar}
              date={item.date}
            />
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
