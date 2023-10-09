import { SetStateAction, useRef, useState } from 'react';
import Slider from 'react-slick';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import CustomButton from '@/components/common/CustomButton';
import { news, NewsSlider } from '@/repository/mock/landing/news-section';
import theme from '@/styles/theme';

import ArrowControllers from '../../landing/projectSection/ArrowControllers';

import NewsCard from './NewsCard';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function NewsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState<NewsSlider[]>(news);

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
          {slides.map((item) => (
            <Grid item xs={11} key={item.id} sx={cardContainerStyles}>
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
        </Slider>
      </Box>

      <Box sx={navigationStyles}>
        <ArrowControllers
          currentSlide={currentSlide}
          slidesLength={slides.length - 1}
          prevSlide={() => sliderRef?.current?.slickPrev()}
          nextSlide={() => sliderRef?.current?.slickNext()}
        />
        <Box sx={buttonStyles}>
          <CustomButton>Mehr</CustomButton>
        </Box>
      </Box>
    </Grid>
  );
}

// News Carousel Styles
const wrapper = {
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
};

const sliderBox = {
  marginBottom: 4,
  height: '218px',
  [theme.breakpoints.down('sm')]: {
    width: 'min(90%, 368px)',
  },
};

const cardContainerStyles = {
  height: '218px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
  [theme.breakpoints.down('sm')]: {
    marginLeft: '3px',
  },
};

const navigationStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  alignSelf: 'flex-start',
  width: 'min(85%, 344px)',
  marginLeft: -1,
};

const buttonStyles = {
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
};
