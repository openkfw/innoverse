import * as React from 'react';

import { SxProps } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Event } from '../../../common/types';

export const defaultImageForEvents = '/images/event_image.jpg';

interface EventTimeDateProps {
  event: Event;
  sx?: SxProps;
}

const EventTimeDate = (props: EventTimeDateProps) => {
  const { event, sx } = props;

  const startDay = new Date(event.startTime).toLocaleString('DE', { day: '2-digit' });
  const startMonth = new Date(event.startTime).toLocaleString('DE', { month: 'short' });
  const endDay = new Date(event.endTime).toLocaleString('DE', { day: '2-digit' });
  const endMonth = new Date(event.endTime).toLocaleString('DE', { month: 'short' });

  const helperStartDate = new Date(event.startTime)
    .toLocaleDateString('DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace('.', ' ');
  const startDate = helperStartDate.replace(helperStartDate.slice(7, 8), '');

  const helperEndDate = new Date(event.endTime)
    .toLocaleDateString('DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace('.', ' ');
  const endDate = helperEndDate.replace(helperEndDate.slice(7, 8), '');

  const startTime = new Date(event.startTime).toLocaleString('DE', { hour: 'numeric', minute: 'numeric' });
  const endTime = new Date(event.endTime).toLocaleString('DE', { hour: 'numeric', minute: 'numeric' });

  return (
    <>
      {startDate === endDate ? (
        <>
          <Typography variant="subtitle2" color="text.primary" mr={0.5} sx={sx || textStyle}>
            {`${startTime} - ${endTime}`}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="subtitle2" color="text.primary" mr={0.5} sx={sx || textStyle}>
            {`${startDay} ${startMonth}, ${startTime} - ${endDay} ${endMonth}, ${endTime}`}
          </Typography>
        </>
      )}
    </>
  );
};

const textStyle = {
  color: 'text.primary',
  fontSize: '.8em',
};

export default EventTimeDate;
