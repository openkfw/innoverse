import { SetStateAction, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';

import { Box, Grid, SxProps, useMediaQuery } from '@mui/material';

import theme from '@/styles/theme';
import { mergeStyles } from '@/utils/helpers';

import ArrowControllers from './projectSection/ArrowControllers';

interface Author {
  name?: string;
  image?: string;
}

interface ProjectUpdate {
  id: string;
  projectId?: string;
  title?: string;
  comment?: string;
  date?: string;
  topic?: string;
  author?: Author;
  projectStart?: string;
}

interface CarouselProps<T extends ProjectUpdate> {
  items: T[];
  renderItem: (item: T, idx: number) => React.JSX.Element;
  moreButton?: React.JSX.Element;
  sliderSettings?: Settings;
  sx?: SxProps;
}

export default function Carousel<T extends ProjectUpdate>({
  items,
  renderItem,
  moreButton,
  sliderSettings,
  sx,
}: CarouselProps<T>) {
  const [currentSlide, setCurrentSlide] = useState(0);
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
    <Grid container item xs={12} spacing={2} onMouseDown={handleMouseDown} sx={mergeStyles(wrapper, sx)}>
      <Box sx={sliderBox}>
        <Slider {...settings} ref={sliderRef}>
          {items.map((item, idx) => renderItem(item, idx))}
        </Slider>
      </Box>

      <Box sx={navigationStyles}>
        <ArrowControllers
          currentSlide={currentSlide}
          slidesLength={items.length - 1}
          prevSlide={() => sliderRef?.current?.slickPrev()}
          nextSlide={() => sliderRef?.current?.slickNext()}
        />
        <Box sx={buttonStyles}>{moreButton}</Box>
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
    width: '100%',
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
  zIndex: -1,
};

const buttonStyles = {
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
};
