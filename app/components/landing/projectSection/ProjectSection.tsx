'use client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import CustomButton from '@/components/common/CustomButton';
import theme from '@/styles/theme';

import ProjectCarousel from './ProjectCarousel';

export type ProjectProps = {
  projects: any[]; //todo
};

export const ProjectSection = (props: ProjectProps) => {
  return (
    <Grid container spacing={5} sx={wrapperStyles}>
      <Grid item container xs={12} sx={titleContainerStyles}>
        <Grid item xs={9}>
          <Typography variant="overline" sx={subtitleStyles}>
            Aktuelle Pipeline
          </Typography>
          <Typography variant="h2" sx={titleStyles}>
            Innovationsprojekte
          </Typography>
        </Grid>
        <Grid item xs={3} sx={buttonContainerStyles}>
          <CustomButton>Mehr</CustomButton>
        </Grid>
      </Grid>
      <ProjectCarousel projects={props.projects} />
    </Grid>
  );
};

// Project Section Styles
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
