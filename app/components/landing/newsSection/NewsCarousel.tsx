'use client';

import Link from 'next/link';

import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ProjectUpdateWithAdditionalData } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import NewsCard from '../../newsPage/NewsCard';
import Carousel from '../Carousel';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

type NewsSliderProps = {
  updates: ProjectUpdateWithAdditionalData[];
};

export default function NewsCarousel({ updates }: NewsSliderProps) {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Carousel
      items={updates}
      sliderSettings={{
        slidesToShow: 1,
        slidesToScroll: isSmallScreen ? 1 : 3,
      }}
      renderItem={(projectUpdate, idx) => (
        <Grid item xs={11} key={idx} sx={cardContainerStyles}>
          <NewsCard update={projectUpdate} noClamp />
        </Grid>
      )}
      moreButton={
        <Link href="news">
          <CustomButton>{m.components_landing_newsSection_newsCarousel_moreNews()}</CustomButton>
        </Link>
      }
      sx={{ zIndex: 3, minHeight: '272px' }}
    />
  );
}

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
