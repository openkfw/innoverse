import * as React from 'react';
import Image from 'next/image';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Event } from '../../../common/types';

export const defaultImageForEvents = '/images/event_image.jpg';

import { EventEmojiReactionCard } from '@/components/collaboration/emojiReactions/EventEmojiReactionCard';

import EventTimeDate from './EventCardHeader';
import EventContent from './EventContent';
import IcsDownload from './IcsDownload';

interface EventCardProps {
  event: Event;
  time: 'future' | 'past';
  isEventLast: boolean;
}

const EventCard = (props: EventCardProps) => {
  const { event, time, isEventLast } = props;

  return (
    <Box sx={isEventLast ? lastNewsCardStyles : newsCardStyles} mr={4} p={3}>
      <Grid container direction={'row'} mb={0}>
        <Grid item xs={5} pl={1}>
          <EventTimeDate event={event} time={time} />
          <Grid item pt={1} pb={1}>
            <Image
              width={0}
              height={0}
              sizes="25vw"
              quality={60}
              src={event.image || defaultImageForEvents}
              alt={'Event Image'}
              style={{
                borderRadius: '.4em',
                marginRight: '1em',
                objectFit: 'contain',
                objectPosition: 'center',
                height: 'auto',
                width: '90%',
              }}
            ></Image>
          </Grid>
          <Grid item display={'flex'}>
            <Typography variant="subtitle2" color="secondary">
              {event.themes.length !== 0 && <ArrowForwardIcon sx={{ fontSize: '1.4em' }} />}
            </Typography>
            {event.themes.map((theme, index) => (
              <Typography key={index} variant="subtitle2" color="secondary">
                {theme}
                {index + 1 < event.themes.length ? ',\u00A0' : ''}
              </Typography>
            ))}
          </Grid>
          <Grid item sx={{ fontSize: '.7em' }}>
            <EventEmojiReactionCard eventId={event.id} />
          </Grid>
        </Grid>
        <Grid item xs={6} ml={'1em'}>
          <IcsDownload event={event} />
          <EventContent event={event} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventCard;

const newsCardStyles = {
  background: '#FCFAED',
  borderRadius: '8px',
};

const lastNewsCardStyles = {
  background: '#FCFAED',
  borderRadius: '8px',
  marginBottom: '10em',
};
