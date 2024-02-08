'use client';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Project } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import theme from '@/styles/theme';

import ProjectCarousel from './ProjectCarousel';

import bgBubble from '/public/images/bg-image.png';

export type ProjectProps = {
  projects: Project[];
};

export const ProjectSection = (props: ProjectProps) => {
  return (
    <Box sx={projectSectionStyles}>
      {/* Right bubble in the background */}
      <Image
        src={bgBubble}
        alt="background-bubble"
        sizes="33vw"
        style={{
          position: 'absolute',
          width: 570,
          height: 460,
          zIndex: 0,
          opacity: 0.56,
          right: 0,
          mixBlendMode: 'lighten',
          transform: 'translate(50%, -10%)',
        }}
      />
      <div id="initiativen">
        <Grid container spacing={5} sx={wrapperStyles}>
          <Grid item container xs={12} sx={titleContainerStyles}>
            <Grid item xs={9}>
              <Typography variant="overline" sx={subtitleStyles}>
                Aktuelle Pipeline
              </Typography>
              <Typography variant="h2" sx={titleStyles}>
                Innovationsinitiativen
              </Typography>
            </Grid>
          </Grid>
          <ProjectCarousel projects={props.projects} />
        </Grid>
      </div>
    </Box>
  );
};

// Project Section Styles
const projectSectionStyles = {
  position: 'relative',
  overflowX: 'hidden',
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
