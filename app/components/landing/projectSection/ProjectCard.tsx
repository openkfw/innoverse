import * as React from 'react';
import { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import ProgressBar from '@/components/common/ProgressBar';
import VisibleContributors from '@/components/project-details/VisibleContributors';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

interface ProjectCardProps {
  id: string;
  img: string;
  contributors: { name: string }[];
  title: string;
  summary: string;
  status: string;
}

export default function ProjectCard(props: ProjectCardProps) {
  const { id, img, contributors, title, summary, status } = props;

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={cardStyles(isSmallScreen)}>
      <Box sx={cardWrapperStyles}>
        <CardMedia sx={cardMediaStyles}>
          <Image
            src={img}
            width={isSmallScreen ? 500 : 418}
            height={isSmallScreen ? 175 : 237}
            alt={m.components_landing_projectSection_projectCard_imageAlt()}
            style={imageStyles}
          />
        </CardMedia>

        <CardContent sx={cardContentStyles}>
          <Box sx={{ textAlign: 'left' }}>
            <VisibleContributors contributors={contributors} />

            <Typography variant="h5" sx={titleStyles}>
              <Link href={`/projects/${encodeURIComponent(id)}`} style={linkStyles}>
                {title}
              </Link>
            </Typography>

            <Typography
              variant="subtitle1"
              sx={descriptionStyles(isSmallScreen ? (title?.length > 20 ? 2 : 3) : title?.length > 50 ? 1 : 2)}
            >
              {summary}
            </Typography>

            <Box sx={progressBarContainerStyles}>
              <ProgressBar active={status} />
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}

// Project Card styles
const cardStyles = (isSmallScreen: boolean) => ({
  display: 'flex',
  height: isSmallScreen ? 440 : 490,
  borderRadius: 4,
  marginRight: '24px',
  background: 'linear-gradient(0deg, rgba(240, 238, 225, 0.30) 0%, rgba(240, 238, 225, 0.30) 100%), #FFF',
  transition: 'all 1.5s cubic-bezier(0.42, 0, 0.58, 1)',
  transitionDelay: '0.2s',

  [theme.breakpoints.up('sm')]: {
    width: 466,
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
});

const cardMediaStyles = {
  borderRadius: '8px',
  overflow: 'hidden',
  padding: '24px',
};

const cardWrapperStyles = {
  flex: 1,
  width: '100%',
};

const imageStyles: CSSProperties = {
  maxWidth: '100%',
  objectFit: 'cover',
  borderRadius: 0,
  transition: 'all 1.5s cubic-bezier(0.42, 0, 0.58, 1)',
};

const cardContentStyles = {
  padding: 3,
  paddingTop: 0,
  height: '100%',
};

const titleStyles = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  width: 'fit-content',
  color: 'primary.main',
};

const linkStyles = {
  textDecoration: 'none',
  cursor: 'pointer',
  color: 'inherit',
};

const descriptionStyles = (lineClamp: number) => ({
  color: 'secondary.contrastText',
  marginBottom: 3,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lineClamp,
});

const progressBarContainerStyles = {
  bottom: 24,
  position: 'absolute',
};
