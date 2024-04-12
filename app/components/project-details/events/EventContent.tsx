import * as React from 'react';

import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useExpandableContainer } from '@/components/common/expandableContainer/ExpandableContainer';
import MuiMarkdownSection from '@/components/common/MuiMarkdownSection';

import { Event } from '../../../common/types';

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
        <MuiMarkdownSection text={event.description} />
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
