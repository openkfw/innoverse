'use client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import theme from '@/styles/theme';

import NewsCarousel from './NewsCarousel';

type NewsProps = {
  updates: ProjectUpdate[];
};

export const NewsSection = (props: NewsProps) => {
  return (
    <Grid container spacing={5} sx={wrapperStyles}>
      <Grid item container xs={12} sx={titleContainerStyles}>
        <Grid item xs={9}>
          <Typography variant="overline" sx={subtitleStyles}>
            Aktuelles aus den Projekten
          </Typography>
          <Typography variant="h2" sx={titleStyles}>
            Innovationsnews
          </Typography>
        </Grid>
        <Grid item xs={3} sx={buttonContainerStyles}>
          <CustomButton>Mehr</CustomButton>
        </Grid>
      </Grid>
      <NewsCarousel updates={props.updates} />
    </Grid>
  );
};

// News Section Styles
const wrapperStyles = {
  [theme.breakpoints.up('sm')]: {
    margin: 5,
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 1,
    marginBottom: 1,
  },
};

const titleContainerStyles = {
  [theme.breakpoints.up('sm')]: {
    marginBottom: 1,
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: -1,
  },
};

const buttonContainerStyles = {
  marginTop: 6,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
};

const titleStyles = {
  [theme.breakpoints.down('sm')]: {
    fontSize: 25,
    marginBottom: 0,
  },
};

const subtitleStyles = {
  [theme.breakpoints.down('sm')]: {
    fontSize: 12,
  },
};
