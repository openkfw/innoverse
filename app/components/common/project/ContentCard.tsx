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
  stage: JSX.Element | string;
  sx?: React.CSSProperties;
}

export default function ContentCard(props: ContentCardProps) {
  const [descriptionMaxLines, setDescriptionMaxLines] = React.useState(2);
  const descriptionRef = React.useRef(null);

  React.useLayoutEffect(() => {
    // Calculate the number of lines that can be displayed in the description
    if (descriptionRef.current) {
      const descriptionElement = descriptionRef.current;

      const observer = new ResizeObserver(() => {
        const lineHeight = parseFloat(window.getComputedStyle(descriptionElement).lineHeight);
        const maxHeight = parseFloat(window.getComputedStyle(descriptionElement).height);
        const lines = Math.floor(maxHeight / lineHeight) - 1;
        setDescriptionMaxLines(lines);
      });

      observer.observe(descriptionRef.current);

      // Cleanup function
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  const image =
    'src' in props.image ? (
      <Image
        src={props.image.src}
        height={0}
        width={props.size?.width}
        alt={m.components_landing_projectSection_projectCard_imageAlt()}
        style={imageStyles}
      />
    ) : (
      props.image
    );

  if ('height' in props.image) {
    cardMediaStyles.height = props.image.height;
  }

  return (
    <Card
      sx={{
        ...cardStyles,
        ...props.sx,
        ...props.size,
      }}
    >
      <CardMedia sx={cardMediaStyles}>{image}</CardMedia>

      <CardContent sx={cardContentStyles}>
        {props.header}

        {props.title}

        <div ref={descriptionRef} style={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ ...descriptionStyles, maxHeight: '100%', WebkitLineClamp: descriptionMaxLines }}
          >
            {props.description}
          </Typography>
        </div>

        <Box sx={stageStyles}>{props.stage}</Box>
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
  gap: 2,
  transition: 'all 1.5s cubic-bezier(0.42, 0, 0.58, 1)',
  transitionDelay: '0.2s',
};

const cardMediaStyles = {
  px: 3,
  pt: 3,
  height: 237,
  [theme.breakpoints.down('sm')]: {
    height: 175,
  },
};

const imageStyles: React.CSSProperties = {
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  display: 'block',
  transition: 'all 1.5s cubic-bezier(0.42, 0, 0.58, 1)',
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
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
};

const stageStyles = {
  marginTop: 'auto',
  paddingTop: 3,
  display: 'flex',
  alignItems: 'flex-end',
};
