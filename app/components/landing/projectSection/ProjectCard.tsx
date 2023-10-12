import * as React from 'react';
import Image, { StaticImageData } from 'next/image';

import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import ProgressBar from '@/components/common/ProgressBar';
import VisibleContributors from '@/components/project-details/VisibleContributors';

interface ProjectCardProps {
  id: number;
  img: StaticImageData;
  contributors: { name: string }[];
  title: string;
  description: string;
  status: string;
}

export default function ProjectCard(props: ProjectCardProps) {
  const { id, img, contributors, title, description, status } = props;

  return (
    <Card sx={cardStyles}>
      <CardActionArea href={`/projects/${encodeURIComponent(id)}`}>
        <CardMedia sx={cardMediaStyles}>
          <Image
            unoptimized
            src={img}
            width={418}
            height={237}
            alt="project"
            style={{ objectFit: 'cover', margin: '24px', borderRadius: '8px' }}
          />
        </CardMedia>

        <CardContent sx={cardContentStyles}>
          <Box sx={{ textAlign: 'left' }}>
            <VisibleContributors contributors={contributors} />

            <Typography variant="h5" sx={titleStyles}>
              {title}
            </Typography>

            <Typography variant="subtitle1" sx={{ ...descriptionStyles, WebkitLineClamp: title.length > 50 ? 1 : 2 }}>
              {description}
            </Typography>

            <Box sx={progressBarContainerStyles}>
              <ProgressBar active={status} />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// Project Card styles
const cardStyles = {
  width: 466,
  height: 473,
  display: 'flex',
  borderRadius: 4,
  marginRight: 3,
};

const cardMediaStyles = {
  height: 237,
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
