import * as React from 'react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Event } from '../../../common/types';

export const defaultImageForEvents = '/images/event_image.jpg';

import MuiMarkdown, { getOverrides, Overrides } from 'mui-markdown';

import { ArrowUpward } from '@mui/icons-material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import IconButton from '@mui/material/IconButton';
import { SxProps } from '@mui/material/styles';

import theme from '@/styles/theme';
import { mergeStyles } from '@/utils/helpers';

interface EventContentProps {
  event: Event;
}

const EventContent = (props: EventContentProps) => {
  const { event } = props;

  const [isEventExpanded, setIsEventExpanded] = useState<boolean>(false);
  const [contentSize, setContentSize] = useState<string>('300px');
  const maxHeight = '450px';

  const toggleContentSize = () => {
    setContentSize(isEventExpanded ? '300px' : maxHeight);
    setIsEventExpanded(!isEventExpanded);
  };

  return (
    <Box sx={{ height: contentSize, overflow: 'hidden' }}>
      <Grid container alignItems="left" spacing={2} direction={'column'} mt={2} mb={2} pl={1}>
        <Grid item xs={4}>
          <Typography variant="h5" sx={titleStyles}>
            {event.title}
          </Typography>
        </Grid>
        <Grid item xs={12} md={9} lg={7}>
          <ShowMoreButton
            contentSize={contentSize}
            isVisible={!isEventExpanded}
            onClick={toggleContentSize}
            sx={{ display: { xs: 'block', lg: 'block' } }}
          />
          <Box
            sx={{
              overflowY: isEventExpanded ? 'scroll' : 'none',
              height: '320px',
              scrollBehavior: 'smooth',
            }}
          >
            <MuiMarkdown overrides={muiMarkdownOverrides as Overrides}>{event.description}</MuiMarkdown>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <ShowLessButton
            contentSize={contentSize}
            isVisible={isEventExpanded}
            onClick={toggleContentSize}
            sx={{ display: { xs: 'none', lg: 'block' } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

interface ShowMoreButtonProps {
  contentSize: string;
  isVisible: boolean;
  onClick: () => void;
  sx?: SxProps;
}

const ShowMoreButton = ({ contentSize, isVisible, onClick, sx }: ShowMoreButtonProps) => {
  const visibilityStyle = isVisible ? 'visible' : 'hidden';
  return (
    <Box sx={mergeStyles(sx, showMoreButtonWrapperStyle(contentSize, visibilityStyle))}>
      <Box sx={{ ...showMoreButtonStyle, visibility: visibilityStyle }}>
        <IconButton aria-label="delete" sx={{ color: 'rgba(0, 0, 0, 1)' }} onClick={onClick}>
          <ArrowDownwardIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const ShowLessButton = ({ isVisible, onClick, sx }: ShowMoreButtonProps) => {
  const visibilityStyle = isVisible ? 'visible' : 'hidden';
  return (
    <Box sx={mergeStyles(sx, showLessButtonWrapperStyle(visibilityStyle))}>
      <Box sx={{ ...showLessButtonStyle, visibility: visibilityStyle }}>
        <IconButton aria-label="delete" sx={{ color: 'rgba(0, 0, 0, 1)' }} onClick={onClick}>
          <ArrowUpward />
        </IconButton>
      </Box>
    </Box>
  );
};

export default EventContent;

const showMoreButtonStyle = {
  background: 'linear-gradient(to bottom, rgba(255,0,0,0), #FCFAED)',
  position: 'relative',
  paddingTop: '200px',
  textAlign: 'center',
  width: '100%',
  borderRadius: '4px',
  ml: '-40px',
};

const showLessButtonStyle = {
  background: 'linear-gradient(to bottom, rgba(255,0,0,0), #FCFAED)',
  position: 'relative',
  textAlign: 'center',
  borderRadius: '4px',
};

const titleStyles = {
  color: 'black',
  fontSize: '17px',
  fontWeight: 900,
};

const showMoreButtonWrapperStyle = (contentSize: string, visibilityStyle: string): SxProps => ({
  position: 'absolute',
  width: '40%',
  height: contentSize,
  visibility: visibilityStyle,
  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
});

const showLessButtonWrapperStyle = (visibilityStyle: string): SxProps => ({
  position: 'relative',
  visibility: visibilityStyle,
  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
});

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
