'use client';
import { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

type LandingPageSectionProps = PropsWithChildren & {
  id: string;
  title: string;
  subtitle: string;
  beforeContent?: React.JSX.Element;
  topRightMenu?: React.JSX.Element;
};

export const LandingPageSection = ({
  id,
  title,
  subtitle,
  topRightMenu,
  beforeContent,
  children,
}: LandingPageSectionProps) => {
  return (
    <Box sx={sectionStyles}>
      {beforeContent}
      <div id={id}>
        <Grid container spacing={5} sx={wrapperStyles}>
          <Grid item container xs={12} sx={titleContainerStyles}>
            <Grid item xs={9}>
              <Typography variant="overline" sx={subtitleStyles}>
                {subtitle}
              </Typography>
              <Typography variant="h2" sx={titleStyles}>
                {title}
              </Typography>
            </Grid>
            <Grid item xs={3} sx={buttonContainerStyles}>
              {topRightMenu}
            </Grid>
          </Grid>
          {children}
        </Grid>
      </div>
    </Box>
  );
};

const sectionStyles: SxProps = {
  position: 'relative',
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
