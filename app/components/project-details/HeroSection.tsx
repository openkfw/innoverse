'use client';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Project } from '@/common/types';
import { UserAvatar } from '@/components/common/UserAvatar';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getImageByBreakpoint } from '@/utils/helpers';

import ProgressBar from '../common/ProgressBar';
import { defaultImage } from '../landing/featuredProjectSection/FeaturedProjectSlider';

interface HeroSectionProps {
  project: Project;
}

export default function HeroSection(props: HeroSectionProps) {
  const { project } = props;
  const { title, author, stage, image } = project;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const heroImage = getImageByBreakpoint(isSmallScreen, image) || defaultImage;

  return (
    <Grid container sx={containerStyles}>
      <Grid item xs={12} md={5}>
        <Box sx={imageWrapperStyles}>
          <Image
            src={heroImage}
            alt={m.components_projectdetails_heroSection_imageAlt()}
            width={0}
            height={0}
            sizes="50vw"
            style={backgroundImageStyles}
            priority
          />
        </Box>
      </Grid>
      <Grid container item xs={12} md={7}>
        <Card sx={cardStyles}>
          <Typography variant="h2" sx={{ ...cardTitleStyles, ...textOverflowStyle }} data-testid="project-title">
            {title}
          </Typography>
          <Grid container item spacing={0} sx={cardBodyStyles}>
            {author && (
              <Grid item sx={avatarContainerStyles}>
                <Box display="flex" flexDirection="column" justifyContent="flex-end" height="100%">
                  <CardHeader
                    avatar={<UserAvatar user={author} size={48} allowAnimation />}
                    title={
                      <Typography variant="body2" sx={{ ml: '8px' }}>
                        {author.name}
                      </Typography>
                    }
                    subheader={
                      author.role && (
                        <Typography variant="caption" sx={{ color: 'common.white', ml: '8px' }}>
                          {author.role}
                        </Typography>
                      )
                    }
                    sx={cardHeaderStyles}
                  />
                </Box>
              </Grid>
            )}
            <Grid item sx={statusContainerStyles}>
              <Typography variant="overline" sx={statusStyles}>
                {m.components_projectdetails_heroSection_stage()}
              </Typography>
              <ProgressBar active={stage} />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}

// Hero section styles
const containerStyles = {
  justifyContent: 'center',
  justifyItems: 'center',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
  },
};

const imageWrapperStyles = {
  width: 661,
  height: 378,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'unset',
  },
};

const backgroundImageStyles = {
  width: '100vw',
  height: 'auto',
  maxWidth: 661,
  maxHeight: 378,
  margin: 0,
  padding: 0,
};

const cardStyles = {
  padding: '32px 24px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  width: 588,
  minHeight: 312,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginLeft: '97px',
  [theme.breakpoints.down('lg')]: {
    marginLeft: '-97px',
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    marginTop: '-40px',
    width: '100%',
    height: 'unset',
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  [theme.breakpoints.down('sm')]: {
    marginX: 2,
    marginTop: '-40px',
    height: 'unset',
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
};

const cardTitleStyles = {
  fontSize: {
    lg: 43,
    md: 40,
    sm: 35,
    xs: 30,
  },
};

const cardBodyStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',

  [theme.breakpoints.down('md')]: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
};

const avatarContainerStyles = {
  padding: 0,
  margin: 0,
};

const cardHeaderStyles = {
  paddingBottom: 0,
  paddingLeft: 0,
  lineHeight: 1,
};

const statusContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  paddingRight: 1,
};

const statusStyles = {
  textAlign: 'flex-start',

  [theme.breakpoints.down('md')]: {
    marginTop: '10px',
  },
};

const textOverflowStyle = {
  hyphens: 'auto',
  WebkitHyphens: 'auto',
  MsHyphens: 'auto',
  MozHyphens: 'auto',
  WebkitLocale: 'de-DE',
  locale: 'de-DE',
};
