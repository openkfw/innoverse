'use client';

import { useEffect, useRef, useState } from 'react';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import { BasicProject } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getImageByBreakpoint } from '@/utils/helpers';

import FeaturedProjectContent from './slider/FeaturedProjectContent';
import Indicator from './slider/Indicator';

import './FeatureProjectSlider.css';

export const defaultImage = '/images/ai_01.png';

type FeaturedProjectSliderProps = {
  items: BasicProject[];
};

type SlideProps = {
  content: BasicProject;
  setSelected: (index: number) => void;
  index: number;
};

interface PillWidths {
  [key: number]: number;
}

const Slide = ({ content, index, setSelected }: SlideProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isWideScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const image = getImageByBreakpoint(isSmallScreen, content?.image) || defaultImage;

  const NextArrow = () => {
    if (isHovered || !isWideScreen) {
      return (
        <Box
          sx={{ ...arrowStyle, right: !isWideScreen ? 2 : 10 }}
          onClick={() => setSelected(index + 1)}
          onTouchEnd={() => setSelected(index + 1)}
        >
          <ArrowForwardIosIcon fontSize="large" />
        </Box>
      );
    }
    return <></>;
  };
  if (!content) return <></>;

  const PrevArrow = () => {
    if (isHovered || !isWideScreen) {
      return (
        <Box
          sx={{ ...arrowStyle, left: !isWideScreen ? 2 : 10 }}
          onClick={() => setSelected(index - 1)}
          onTouchEnd={() => setSelected(index - 1)}
        >
          <ArrowBackIosNewIcon fontSize="large" />
        </Box>
      );
    }
    return <></>;
  };

  return (
    <Grid container key={content?.id} sx={wrapperStyles} data-testid="featured-project">
      <Grid
        container
        item
        sx={imageContainerStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-identifier="image-container"
      >
        <Image
          src={image}
          width={0}
          height={0}
          alt={m.components_landing_featuredProjectSection_featuredProjectSldier_imageAlt()}
          sizes="50vw"
          className="slider-image"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          priority
        />
        <PrevArrow />
        <NextArrow />
      </Grid>
      <Grid item md={4} sx={contentStyles}>
        <FeaturedProjectContent
          title={content?.title}
          collaborationTags={content?.description?.collaborationTags || []}
          summary={content?.summary}
          projectId={content?.id}
        />
      </Grid>
    </Grid>
  );
};

const FeaturedProjectSlider = (props: FeaturedProjectSliderProps) => {
  const slides = props.items;
  const initialSlideIndex = slides.length - 1;
  const [selectedItem, setSelectedItem] = useState<number>(initialSlideIndex);
  const [previousMovement, setPreviousMovement] = useState(0);
  const [pillWidths, setPillWidths] = useState<PillWidths>({});
  const [previousSelectedItem, setPreviousSelectedItem] = useState<number>(initialSlideIndex);
  const [show, setShow] = useState(false);

  const sliderRef = useRef<Slider>(null);
  const isWideScreen = useMediaQuery(theme.breakpoints.up('md'));

  function setSelected(index: number) {
    let newIndex = index;
    if (index < 0) {
      newIndex = slides.length - 1;
    } else if (index >= slides.length) {
      newIndex = 0;
    }
    sliderRef.current?.slickGoTo(newIndex);
    setSelectedItem(newIndex);
  }

  function moveIndicator(oldIndex: number, newIndex: number) {
    const pillbox = document.querySelector('.slick-dots.slick-thumb') as HTMLElement | null;

    if (!pillbox || oldIndex === newIndex) {
      return;
    }

    const pills = pillbox.querySelectorAll('li');

    if (oldIndex >= 0 && oldIndex < pills.length && newIndex >= 0 && newIndex < pills.length) {
      // Calculate movement from old pill to new pill
      const oldPill = pills[oldIndex];
      const newPill = pills[newIndex];
      const oldPillRect = oldPill.getBoundingClientRect();
      const newPillRect = newPill.getBoundingClientRect();
      const oldPillCenter = oldPillRect.left + oldPillRect.width / 2;
      const newPillCenter = newPillRect.left + newPillRect.width / 2;
      const primaryMovement = newPillCenter - oldPillCenter;

      // Adjust movement based on changes in sizes of old and new pills
      const oldPillWidthBefore = pillWidths[oldIndex];
      const newPillWidthBefore = pillWidths[newIndex];
      let secondaryMovement = 0;
      if (newIndex > oldIndex) {
        secondaryMovement = (oldPill.offsetWidth - oldPillWidthBefore) / 2;
      } else if (newIndex < oldIndex) {
        secondaryMovement = newPill.offsetWidth - newPillWidthBefore + (oldPill.offsetWidth - oldPillWidthBefore) / 2;
      }

      // Apply transform to move pillbox container
      const totalMovement = previousMovement - primaryMovement - secondaryMovement;
      pillbox.style.transform = `translateX(${totalMovement}px)`;

      // Update state
      const updatedPillWidths = { ...pillWidths };
      updatedPillWidths[oldIndex] = oldPill.offsetWidth;
      updatedPillWidths[newIndex] = newPill.offsetWidth;
      setPillWidths(updatedPillWidths);
      setPreviousMovement(totalMovement);
    }
  }

  useEffect(() => {
    // Calculate the width of each pill
    const timer = setTimeout(() => {
      const pillbox = document.querySelector('.slick-dots.slick-thumb') as HTMLElement | null;
      const newPillWidths: PillWidths = {};
      if (pillbox) {
        pillbox.querySelectorAll('li').forEach((pill, index) => {
          newPillWidths[index] = pill.offsetWidth;
        });
        setPillWidths(newPillWidths);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Adjust slider initial position to match the right corner of slider image
    const timer = setTimeout(() => {
      const adjustPillboxPosition = () => {
        const imageContainer = document.querySelector('[data-identifier="image-container"]');
        const pillbox = document.querySelector('.slick-dots.slick-thumb') as HTMLElement | null;

        if (imageContainer && pillbox) {
          window.requestAnimationFrame(() => {
            const pillboxLeftPosition = imageContainer.getBoundingClientRect().right - pillbox.offsetWidth;
            pillbox.style.opacity = '1';
            pillbox.style.left = `${pillboxLeftPosition}px`;
            pillbox.style.right = 'auto';
          });
        }
      };

      adjustPillboxPosition();
      window.addEventListener('resize', adjustPillboxPosition);

      return () => {
        window.removeEventListener('resize', adjustPillboxPosition);
      };
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedItem !== previousSelectedItem) {
      moveIndicator(previousSelectedItem, selectedItem);
      setPreviousSelectedItem(selectedItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  const settings = {
    initialSlide: initialSlideIndex,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 7000,
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
    beforeChange: (_current: number, next: number) => {
      setSelectedItem(next);
    },
  };

  return (
    <Box sx={featuredProjectSliderStyles} data-testid="featured-project-slider">
      {!show && <Slide content={slides[slides.length - 1]} index={selectedItem} setSelected={setSelected} />}
      <Slider
        {...settings}
        ref={sliderRef}
        onInit={() => {
          setShow(true);
        }}
      >
        {show &&
          slides.map((content, id) => (
            <Slide content={content} key={id} index={selectedItem} setSelected={setSelected} />
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
  marginBottom: '180px',
  [theme.breakpoints.down('md')]: {
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 0,
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

  [theme.breakpoints.down('md')]: {
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

  [theme.breakpoints.down('md')]: {
    width: 'calc(100vw - 80px)',
    height: 'initial',
  },
};

const contentStyles = {
  width: 'calc(100vw - 80px)',
  flexGrow: { xs: 0, sm: 6, md: 4 },
  maxWidth: { xs: 'none', sm: `${(6 / 12) * 100}%`, md: `${(4 / 12) * 100}%` },
};

const arrowStyle = {
  zIndex: 100,
  position: 'absolute',
  cursor: 'pointer',
  top: '50%',
  transform: 'translateY(-50%)',
};
