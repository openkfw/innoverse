import * as React from 'react';
import Image from 'next/image';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import EventEmojiReactionCard from '@/components/collaboration/emojiReactions/EventEmojiReactionCard';
import EventCardHeader from '@/components/landing/eventsSection/EventCardHeader';
import theme from '@/styles/theme';

import { EventWithAdditionalData } from '../../../common/types';

import EventContent from './EventContent';

export const defaultImageForEvents = '/images/event_image.jpg';

interface EventCardProps {
  event: EventWithAdditionalData;
  disabled: boolean;
}

const EventCard = ({ event, disabled }: EventCardProps) => {
  const isLargeSceen = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Card elevation={0} sx={newsCardStyles}>
      <CardHeader sx={{ p: 0, mb: 2 }} title={<EventCardHeader event={event} disabled={disabled} />} />
      <CardContent style={{ padding: 0 }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
          <Box>
            <Image
              width={0}
              height={0}
              quality={60}
              sizes="25vw"
              src={event.image || defaultImageForEvents}
              alt={'Event Image'}
              style={{
                borderRadius: '.4em',
                objectFit: 'contain',
                objectPosition: 'center',
                height: 'auto',
                width: isLargeSceen ? 'auto' : '100%',
                alignSelf: 'center',
                maxWidth: '315px',
              }}
            />
            <Box sx={{ mt: 1 }}>
              <EventThemes themes={event.themes} sx={{ mb: 1, mt: -0.5 }} />
              {isLargeSceen && <EventEmojiReactionCard event={event} />}
            </Box>
          </Box>
          <Box style={{ marginTop: 0 }}>
            <EventContent event={event} sx={{ my: { xs: 2, lg: 0.5 } }} />
            {!isLargeSceen && <EventEmojiReactionCard event={event} />}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const EventThemes = ({ themes, sx }: { themes: string[]; sx?: SxProps }) => {
  if (!themes.length) return <></>;

  return (
    <Stack direction="row" alignItems={'center'} sx={sx}>
      <Typography variant="subtitle2" color="primary.main">
        <ArrowForwardIcon sx={{ fontSize: '14px' }} />
      </Typography>
      {themes.map((theme, index) => (
        <Typography key={index} variant="subtitle2" color="primary.main" sx={{ fontSize: '14px' }}>
          {theme}
          {index + 1 < themes.length ? ',\u00A0' : ''}
        </Typography>
      ))}
    </Stack>
  );
};

export default EventCard;

const newsCardStyles = {
  backgroundColor: '#FBFAF6',
  px: 3,
  py: 4,
  width: '100%',
  borderRadius: '8px',
};
