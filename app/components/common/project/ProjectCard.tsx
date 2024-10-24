import * as React from 'react';
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
  cardSize: { height: number; width: number };
}

export default function ProjectCard(props: ProjectCardProps) {
  const { id, img, contributors, title, summary, status, cardSize } = props;

  const isWideScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const imgHeight = isWideScreen ? 200 : 150;

  return (
    <Card
      sx={{
        ...cardStyles,
        position: 'relative',
        height: isWideScreen ? cardSize.height : 440,
        width: cardSize.width,
      }}
    >
      <Box sx={cardWrapperStyles}>
        <CardMedia sx={{ borderRadius: '8px', overflow: 'hidden', padding: '24px' }}>
          <Image
            src={img}
            width={cardSize.width}
            height={0}
            alt={m.components_landing_projectSection_projectCard_imageAlt()}
            style={{
              width: '100%',
              objectFit: 'cover',
              borderRadius: 0,
              display: 'block',
              height: imgHeight,
            }}
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

            {isWideScreen ? (
              <Typography
                variant="subtitle1"
                sx={{ ...descriptionStyles, WebkitLineClamp: title?.length > 100 ? 1 : 3 }}
              >
                {summary}
              </Typography>
            ) : (
              <Typography
                variant="subtitle1"
                sx={{ ...descriptionStyles, WebkitLineClamp: title?.length > 20 ? 2 : 3 }}
              >
                {summary}
              </Typography>
            )}

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
const cardStyles = {
  display: 'flex',
  borderRadius: 4,
  marginRight: '24px',
  background: 'linear-gradient(0deg, rgba(240, 238, 225, 0.30) 0%, rgba(240, 238, 225, 0.30) 100%), #FFF',
  [theme.breakpoints.up('sm')]: {
    width: 466,
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
};

const cardWrapperStyles = {
  flex: 1,
  width: '100%',
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

const descriptionStyles = {
  color: 'secondary.contrastText',
  marginBottom: 3,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
};

const progressBarContainerStyles = {
  position: 'absolute',
  bottom: 24, // Stick to the bottom
  left: '50%', // Move to the horizontal center
  transform: 'translateX(-50%)', // Center it by shifting 50% of its width
  width: '80%', // Adjust width as necessary (optional)
};
