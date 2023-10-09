import * as React from 'react';
import Image, { StaticImageData } from 'next/image';

import { CardActionArea, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import ProgressBar from '@/components/common/ProgressBar';
import VisibleContributors from '@/components/project-details/VisibleContributors';
import theme from '@/styles/theme';

interface ProjectCardProps {
  id: number;
  img: StaticImageData;
  contributors: string[];
  title: string;
  description: string;
  progress: string;
}

export default function ProjectCard(props: ProjectCardProps) {
  const { id, img, contributors, title, description, progress } = props;

  const isWideScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Card sx={{ ...cardStyles, height: isWideScreen ? 473 : 440 }}>
      <CardActionArea href={`/projects/${encodeURIComponent(id)}`}>
        <CardMedia sx={{ height: isWideScreen ? 237 : 175, borderRadius: '8px' }}>
          <Image
            src={img}
            width={isWideScreen ? 418 : undefined}
            height={isWideScreen ? 237 : 175}
            alt="project"
            layout={isWideScreen ? 'intrinsic' : 'responsive'}
            style={{
              objectFit: 'cover',
              margin: isWideScreen ? '24px' : '0px',
              padding: isWideScreen ? '0px' : '24px',
              borderRadius: '8px',
            }}
          />
        </CardMedia>

        <CardContent sx={cardContentStyles}>
          <Box sx={{ textAlign: 'left' }}>
            <VisibleContributors contributors={contributors} />

            <Typography variant="h5" sx={titleStyles}>
              {title}
            </Typography>

            {isWideScreen ? (
              <Typography variant="subtitle1" sx={{ ...descriptionStyles, WebkitLineClamp: title.length > 50 ? 1 : 2 }}>
                {description}
              </Typography>
            ) : (
              <Typography variant="subtitle1" sx={{ ...descriptionStyles, WebkitLineClamp: title.length > 20 ? 2 : 3 }}>
                {description}
              </Typography>
            )}

            <Box sx={progressBarContainerStyles}>
              <ProgressBar active={progress} />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// Project Card styles
const cardStyles = {
  display: 'flex',
  borderRadius: 4,
  marginRight: '24px',
  [theme.breakpoints.up('sm')]: {
    width: 466,
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
};
const cardContentStyles = {
  padding: 3,
  height: '100%',
};

const titleStyles = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
};

const descriptionStyles = {
  color: 'secondary.contrastText',
  marginBottom: 3,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
};

const progressBarContainerStyles = {
  bottom: 24,
  position: 'absolute',
};
