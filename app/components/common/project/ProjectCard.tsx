import * as React from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ProgressBar from '@/components/common/ProgressBar';
import VisibleContributors from '@/components/project-details/VisibleContributors';
import * as m from '@/src/paraglide/messages.js';

import ContentCard from './ContentCard';

interface ProjectCardProps {
  id: string;
  img: string;
  imageHeight?: number;
  contributors: { name: string }[];
  title: string;
  summary: string;
  stage: string;
  size: { height: number; width: number };
  sx?: React.CSSProperties;
}

export default function ProjectCard(props: ProjectCardProps) {
  const { id, img, imageHeight, contributors, title, summary, stage, size, sx } = props;

  return (
    <ContentCard
      size={size}
      sx={sx}
      image={{ src: img, alt: m.components_landing_projectSection_projectCard_imageAlt(), height: imageHeight ?? 237 }}
      header={<VisibleContributors contributors={contributors} />}
      title={
        <Typography variant="h5" sx={titleStyles}>
          <Link href={`/projects/${encodeURIComponent(id)}`} style={linkStyles}>
            {title}
          </Link>
        </Typography>
      }
      description={summary}
      stage={
        <Box sx={{ overflow: 'visible' }}>
          <ProgressBar active={stage} />
        </Box>
      }
    />
  );
}

const titleStyles = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  color: 'primary.main',
};

const linkStyles = {
  textDecoration: 'none',
  cursor: 'pointer',
  color: 'inherit',
};
