'use client';

import ArrowLeftIcon from '@mui/icons-material/ArrowBack';
import ArrowRightIcon from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import * as m from '@/src/paraglide/messages.js';

interface ArrowControllersProps {
  currentSlide: number;
  slidesLength: number;
  prevSlide: () => void;
  nextSlide: () => void;
  parentDisabled: boolean;
}

export default function ArrowControllers(props: ArrowControllersProps) {
  const { currentSlide, slidesLength, prevSlide, nextSlide, parentDisabled } = props;

  const iconStyles = {
    color: 'common.white',
    '&:disabled': {
      color: 'common.white',
      opacity: 0.5,
    },
  };

  const next = () => {
    if (currentSlide != slidesLength) {
      nextSlide();
    }
  };

  const prev = () => {
    if (currentSlide != 0) {
      prevSlide();
    }
  };

  return (
    <Grid container p={0} spacing={0} sx={{ width: '50%' }}>
      <Grid item>
        <IconButton
          disabled={currentSlide == 0 || parentDisabled}
          onClick={prev}
          sx={iconStyles}
          aria-label={m.components_landing_projectSection_arrowController_previousSlide()}
        >
          <ArrowLeftIcon style={{ fontSize: 40 }} />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          disabled={currentSlide == slidesLength || parentDisabled}
          onClick={next}
          sx={iconStyles}
          aria-label={m.components_landing_projectSection_arrowController_nextSlide()}
        >
          <ArrowRightIcon style={{ fontSize: 40 }} />
        </IconButton>
      </Grid>
    </Grid>
  );
}
