import { SetStateAction, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';

import { Box, Grid, useMediaQuery } from '@mui/material';

import theme from '@/styles/theme';

import CustomButton from '../common/CustomButton';

import ArrowControllers from './projectSection/ArrowControllers';

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, idx: number) => React.JSX.Element;
  moreButton?: React.JSX.Element;
  sliderSettings?: Settings;
}

export default function Carousel<T>({ items, renderItem, moreButton, sliderSettings }: CarouselProps<T>) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState<T[]>(items);
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
    vertical: false,
    beforeChange: (current: number, next: SetStateAction<number>) => setCurrentSlide(next),
    variableWidth: isWideScreen,
    rows: 1,
    ...sliderSettings,
  };

  return (
    <Grid container item xs={12} spacing={2} onMouseDown={handleMouseDown} sx={wrapper}>
      <Box sx={sliderBox}>
        <Slider {...settings} ref={sliderRef}>
          {slides.map((item, idx) => renderItem(item, idx))}
        </Slider>
      </Box>

      <Box sx={navigationStyles}>
        <ArrowControllers
          currentSlide={currentSlide}
          slidesLength={slides.length - 1}
          prevSlide={() => sliderRef?.current?.slickPrev()}
          nextSlide={() => sliderRef?.current?.slickNext()}
        />
        <Box sx={buttonStyles}>{moreButton ?? <CustomButton>Mehr</CustomButton>}</Box>
      </Box>
    </Grid>
  );
}

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
  [theme.breakpoints.down('sm')]: {
    width: 'min(90%, 368px)',
  },
  [theme.breakpoints.up('sm')]: {
    '& .slick-list': {
      overflow: 'visible',
    },
  },
};

const navigationStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: 'min(85%, 344px)',
  marginLeft: -1,
};

const buttonStyles = {
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
};
