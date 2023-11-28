import { useRef, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Project } from '@/common/types';
import theme from '@/styles/theme';

import FeaturedProjectContent from './slider/FeaturedProjectContent';
import Indicator from './slider/Indicator';
import SmallSliderPill from './slider/SmallSliderPill';

import './FeatureProjectSlider.css';

export const defaultImage = '/images/ai_01.png';

type FeaturedProjectSliderProps = {
  items: Project[];
};

export const FeaturedProjectSlider = (props: FeaturedProjectSliderProps) => {
  const [selectedItem, setSelectedItem] = useState<number>(props.items.length - 1);
  const slides = props.items;
  const sliderRef = useRef<Slider>(null);

  const setSelected = (index: number) => {
    sliderRef?.current?.slickGoTo(index);
    setSelectedItem(index);
  };

  const isWideScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const settings = {
    initialSlide: selectedItem,
    arrows: false,
    dots: true,
    infinite: false,
    speed: 750,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: false,
    fade: isWideScreen,
    customPaging: function (index: number) {
      return (
        <Indicator
          index={index}
          isSelected={selectedItem == index}
          setSelectedItem={setSelected}
          selectedItem={selectedItem}
          slide={slides[index]}
        />
      );
    },
    dotsClass: 'slick-dots slick-thumb',
    rows: 1,
    variableWidth: !isWideScreen,
  };

  return (
    <Slider {...settings} ref={sliderRef}>
      {slides.map((el, id) => (
        <Grid container key={id} sx={wrapperStyles}>
          <Grid container item sx={imageContainerStyles}>
            <Image
              unoptimized
              src={el.image || defaultImage}
              width={0}
              height={0}
              alt="Project"
              sizes="50vw"
              className="slider-image"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          </Grid>

          <Box sx={smallScreenSliderPill}>
            <SmallSliderPill itemNumber={(id + 1).toString()} title={el.title} />
          </Box>

          <Grid item md={4} sx={contentStyles}>
            <FeaturedProjectContent title={el.title} tags={el.description.tags} summary={el.summary} />
          </Grid>
        </Grid>
      ))}
    </Slider>
  );
};

// Featured Project Slider Styles
const wrapperStyles = {
  display: 'flex !important',
  flexWrap: 'noWrap',
  gap: theme.spacing(2),
  maxWidth: '1500px',

  [theme.breakpoints.up('xl')]: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: '100px',
  },

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    marginLeft: 3,
    marginBottom: 0,
    paddingBottom: 2,
    borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
  },
};

const imageContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  height: '509px',
  flexGrow: { xs: 0, sm: 7 },
  maxWidth: { xs: 'none', sm: `${(7 / 12) * 100}%` },

  [theme.breakpoints.up('xl')]: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  [theme.breakpoints.down('sm')]: {
    width: 'calc(100vw - 80px)',
    height: 'initial',
  },
};

const contentStyles = {
  width: 'calc(100vw - 80px)',
  flexGrow: { xs: 0, sm: 6, md: 4 },
  maxWidth: { xs: 'none', sm: `${(6 / 12) * 100}%`, md: `${(4 / 12) * 100}%` },
};

const smallScreenSliderPill = {
  marginTop: '21px',
  marginBottom: 4,

  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
};
