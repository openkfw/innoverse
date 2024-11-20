import * as React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

export interface ContentCardProps {
  size?: { width?: number; height?: number };
  image: JSX.Element | { src: string; alt: string; height: number };
  title: JSX.Element | string;
  header: JSX.Element | string;
  description: JSX.Element | string;
  status: JSX.Element | string;
  sx?: React.CSSProperties;
}

export default function ContentCard(props: ContentCardProps) {
  const image =
    'src' in props.image ? (
      <Image
        src={props.image.src}
        width={props.size?.width}
        height={0}
        alt={m.components_landing_projectSection_projectCard_imageAlt()}
        style={{
          width: '100%',
          objectFit: 'cover',
          display: 'block',
          height: props.image.height,
          [theme.breakpoints.down('sm')]: {
            height: 175,
          },
        }}
      />
    ) : (
      props.image
    );

  return (
    <Card
      sx={{
        ...cardStyles,
        ...props.sx,
        ...props.size,
      }}
    >
      <CardMedia sx={{ overflow: 'hidden', padding: '24px' }}>{image}</CardMedia>

      <CardContent sx={cardContentStyles}>
        {props.header}

        {props.title}

        <Typography variant="subtitle1" sx={descriptionStyles}>
          {props.description}
        </Typography>

        <Box sx={statusStyles}>{props.status}</Box>
      </CardContent>
    </Card>
  );
}

// Project Card styles
const cardStyles = {
  position: 'relative',
  borderRadius: 4,
  background: 'linear-gradient(0deg, rgba(240, 238, 225, 0.30) 0%, rgba(240, 238, 225, 0.30) 100%), #FFF',
  [theme.breakpoints.down('sm')]: {
    width: 500,
  },
  width: 466,
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const cardContentStyles = {
  padding: 3,
  paddingTop: 0,
  textAlign: 'left',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
};

const descriptionStyles = {
  color: 'secondary.contrastText',
  marginBottom: 3,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
};

const statusStyles = {
  flexGrow: 1,
  display: 'flex',
  alignItems: 'flex-end',
};
