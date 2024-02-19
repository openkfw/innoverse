'use client';

import { SetStateAction, useRef, useState } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ProjectUpdate } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import theme from '@/styles/theme';

import ArrowControllers from '../../landing/projectSection/ArrowControllers';
import NewsCard from '../../newsPage/NewsCard';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

type NewsSliderProps = {
  updates: ProjectUpdate[];
};

export default function NewsCarousel(props: NewsSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = props.updates;
  const sliderRef = useRef<Slider>(null);

  const handleMouseDown = (e: { pageX: number }) => {
    const startX = e.pageX;
    const mouseMoveHandler = (moveEvent: { pageX: number }) => {
      const endX = moveEvent.pageX;
      const distance = endX - startX;
      if (sliderRef.current) {
        if (distance > 75) {
          sliderRef.current.slickPrev();
          document.removeEventListener('mousemove', mouseMoveHandler);
        } else if (distance < -75) {
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
    slidesToScroll: 3,
    vertical: false,
    beforeChange: (current: number, next: SetStateAction<number>) => setCurrentSlide(next),
    variableWidth: isWideScreen,
    rows: 1,
  };

  return (
    <Grid container item xs={12} spacing={2} onMouseDown={handleMouseDown} sx={wrapper}>
      <Box sx={sliderBox}>
        <Slider {...settings} ref={sliderRef}>
          {slides
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((item, key) => (
              <Grid item xs={11} key={key} sx={cardContainerStyles}>
                <NewsCard update={item} noClamp />
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
          <Link href="news">
            <CustomButton>Mehr News</CustomButton>
          </Link>
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
  height: '17rem',
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
  height: '17rem',
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
