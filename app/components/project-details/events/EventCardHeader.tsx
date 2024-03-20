import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Event } from '../../../common/types';

import EventTimeDate from './EventTimeDate';

export const defaultImageForEvents = '/images/event_image.jpg';

interface EventCardHeaderProps {
  event: Event;
  time?: 'future' | 'past';
}

const EventCardHeader = (props: EventCardHeaderProps) => {
  const { event, time = 'future' } = props;

  const startDay = new Date(event.startTime).toLocaleString('DE', { day: '2-digit' });
  const startMonth = new Date(event.startTime).toLocaleString('DE', { month: 'short' });

  return (
    <Grid container direction={'row'}>
      <Grid item xs={4}>
        <Grid container direction={'column'}>
          <Grid item alignSelf={'center'}>
            <Typography variant="h3" color={time === 'future' ? 'secondary' : 'text.primary'} mt={-1.75}>
              {startDay}
            </Typography>
          </Grid>
          <Grid item alignSelf={'center'}>
            <Typography variant="subtitle2" color="black" mt={-1.5}>
              {startMonth.toUpperCase()}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item alignItems={'start'} xs={7}>
        <Grid container direction={'column'} ml={1}>
          <Grid container direction={'row'}></Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignContent: 'space-evenly' }}>
              <EventTimeDate event={event} />
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontSize: '.8em', color: 'black' }}>
              {event.location}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontSize: '.8em', color: 'black' }}>
              {event.type ? event.type.replaceAll('_', ' ') : ''}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EventCardHeader;
