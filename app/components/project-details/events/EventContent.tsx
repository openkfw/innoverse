import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Event } from '../../../common/types';

export const defaultImageForEvents = '/images/event_image.jpg';

import MuiMarkdown, { getOverrides, Overrides } from 'mui-markdown';

import { SxProps } from '@mui/material/styles';

import { useExpandableContainer } from '@/components/common/expandableContainer/ExpandableContainer';

interface EventContentProps {
  event: Event;
  sx?: SxProps;
}

const EventContent = ({ event, sx }: EventContentProps) => {
  const container = useExpandableContainer({
    collapsedHeight: 200,
    scrollWhenExpanded: false,
    content: (
      <Box sx={sx}>
        <Typography variant="h5" sx={titleStyles}>
          {event.title}
        </Typography>
        <MuiMarkdown overrides={muiMarkdownOverrides as Overrides}>{event.description}</MuiMarkdown>
      </Box>
    ),
    styling: {
      backgroundColor: '#FBFAF6',
    },
  });

  return container.element;
};

export default EventContent;

const titleStyles = {
  color: 'black',
  fontSize: '17px',
  fontWeight: 900,
};

const muiMarkdownOverrides = {
  ...getOverrides(), // This will keep the other default overrides.
  p: {
    component: 'p',
    props: {
      style: { color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  code: {
    component: 'code',
    props: {
      style: { color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h1: {
    component: 'h1',
    props: {
      style: { scrollMargin: '5em', color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h2: {
    component: 'h2',
    props: {
      style: { scrollMargin: '5em', color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h3: {
    component: 'h3',
    props: {
      style: { scrollMargin: '5em', color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  img: {
    component: 'img',
    props: {
      style: {
        maxWidth: '100%',
        height: 'auto',
        padding: '1em',
        objectFit: 'contain',
      },
    } as React.HTMLProps<HTMLImageElement>,
  },
  span: {
    component: 'span',
    props: {
      style: { color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
};
