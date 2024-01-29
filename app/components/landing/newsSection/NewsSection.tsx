'use client';

import Link from 'next/link';
import router from 'next/router';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import ErrorPage from '@/components/error/ErrorPage';
import theme from '@/styles/theme';

import NewsCarousel from './NewsCarousel';

type NewsProps = {
  updates: ProjectUpdate[];
};

export const NewsSection = (props: NewsProps) => {
  if (!props.updates) {
    return <ErrorPage />;
  }

  return (
    <Box sx={newsSectionStyles}>
      <Grid container spacing={5} sx={wrapperStyles}>
        <Grid item container xs={12} sx={titleContainerStyles}>
          <Grid item xs={9}>
            <Typography variant="overline" sx={subtitleStyles}>
              Aktuelles aus den Initiativen
            </Typography>
            <Typography variant="h2" sx={titleStyles}>
              Innovationsnews
            </Typography>
          </Grid>
          <Grid item xs={3} sx={buttonContainerStyles}>
            <Link href="news">
              <CustomButton onClick={() => router.push('news')}>Mehr News</CustomButton>
            </Link>
          </Grid>
        </Grid>
        {props.updates.length > 0 && <NewsCarousel updates={props.updates} />}
      </Grid>
    </Box>
  );
};

// News Section Styles

const newsSectionStyles = {
  overflowY: 'visible',
  overflowX: 'clip',
  [theme.breakpoints.up('sm')]: {
    paddingLeft: '5%',
  },
};

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
