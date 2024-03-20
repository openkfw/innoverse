'use client';

import { useRef, useState } from 'react';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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

type SlideProps = {
  content: Project;
  setSelected: (index: number) => void;
  index: number;
  totalItems: number;
};

const Slide = ({ content, index, setSelected, totalItems }: SlideProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!content) return <></>;

  const isLastSlide = index === totalItems - 1;
  const isFirstSlide = index === 0;

  const NextArrow = () => {
    if (isHovered && !isLastSlide) {
      return (
        <Box sx={{ ...arrowStyle, right: 10 }} onClick={() => setSelected(index + 1)}>
          <ArrowForwardIosIcon fontSize="large" />
        </Box>
      );
    }
    return <></>;
  };

  const PrevArrow = () => {
    if (isHovered && !isFirstSlide) {
      return (
        <Box sx={{ ...arrowStyle, left: 10 }} onClick={() => setSelected(index - 1)}>
          <ArrowBackIosNewIcon fontSize="large" />
        </Box>
      );
    }
    return <></>;
  };

  return (
    <Grid container key={content.id} sx={wrapperStyles}>
      <Grid
        container
        item
        sx={imageContainerStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={content.image || defaultImage}
          width={0}
          height={0}
          alt="Project"
          sizes="50vw"
          className="slider-image"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
        />
        <PrevArrow />
        <NextArrow />
      </Grid>
      <Box sx={smallScreenSliderPill}>
        <SmallSliderPill itemNumber={(content.id + 1).toString()} title={content.title} />
      </Box>
      <Grid item md={4} sx={contentStyles}>
        <FeaturedProjectContent
          title={content.title}
          tags={content.description.tags}
          summary={content.summary}
          projectId={content.id}
        />
      </Grid>
    </Grid>
  );
};

const FeaturedProjectSlider = (props: FeaturedProjectSliderProps) => {
  const [selectedItem, setSelectedItem] = useState<number>(props.items.length - 1);
  const [show, setShow] = useState(false);

  const slides = props.items;
  const sliderRef = useRef<Slider>(null);
  const isWideScreen = useMediaQuery(theme.breakpoints.up('sm'));

  function moveIndicator(newIndex: number) {
    const slider = document.querySelectorAll('.slick-dots.slick-thumb')[0] as HTMLElement;
    const old = Number(slider.style.translate.split('px')[0]);
    const diff = Math.abs(selectedItem - newIndex);
    const moveByPx = diff * 150;

    if (selectedItem > newIndex) {
      slider.style.translate = `${old + moveByPx}px`;
    }
    if (selectedItem < newIndex) {
      slider.style.translate = `${old - moveByPx}px`;
    }
  }

  function setSelected(index: number) {
    if (index >= 0 && index < props.items.length) {
      sliderRef?.current?.slickGoTo(index);
      setSelectedItem(index);
      moveIndicator(index);
    }
  }

  const settings = {
    initialSlide: props.items.length - 1,
    arrows: false,
    dots: true,
    infinite: false,
    speed: 600,
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
          slide={slides[index]}
        />
      );
    },
    dotsClass: 'slick-dots slick-thumb',
    rows: 1,
    variableWidth: !isWideScreen,
    className: 'carouselStyles',
  };

  return (
    <Box sx={featuredProjectSliderStyles}>
      {!show && (
        <Slide
          content={slides[props.items.length - 1]}
          index={selectedItem}
          setSelected={setSelected}
          totalItems={props.items.length}
        />
      )}
      <Slider
        {...settings}
        ref={sliderRef}
        onInit={() => {
          setShow(true);
        }}
      >
        {show &&
          slides.map((content, id) => (
            <Slide
              content={content}
              key={id}
              index={selectedItem}
              setSelected={setSelected}
              totalItems={props.items.length}
            />
          ))}
      </Slider>
    </Box>
  );
};

export default FeaturedProjectSlider;

// Featured Project Slider Styles

const featuredProjectSliderStyles = {
  paddingTop: 10,
  marginRight: '5%',
  marginBottom: 'min(10%, 229px)',
  [theme.breakpoints.down('sm')]: {
    marginRight: 0,
    marginLeft: 0,
  },
};

const wrapperStyles = {
  display: 'flex !important',
  flexWrap: 'noWrap',
  gap: theme.spacing(2),
  maxWidth: '1500px',
  zIndex: 10,

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
  position: 'relative',

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

const arrowStyle = {
  zIndex: 100,
  position: 'absolute',
  cursor: 'pointer',
  top: '50%',
  transform: 'translateY(-50%)',

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
};
