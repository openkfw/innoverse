'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
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
        <Box sx={{ pr: 3, [theme.breakpoints.down('sm')]: { pr: 2 } }}>
          <NewsCard key={idx} update={projectUpdate} noClamp sx={{ height: '17rem' }} />
        </Box>
      )}
      moreButton={
        <Link href="news">
          <CustomButton>{m.components_landing_newsSection_newsCarousel_moreNews()}</CustomButton>
        </Link>
      }
      sx={{
        zIndex: 3,
        minHeight: '272px',
        [theme.breakpoints.down('sm')]: {
          ml: -2,
        },
      }}
    />
  );
}
