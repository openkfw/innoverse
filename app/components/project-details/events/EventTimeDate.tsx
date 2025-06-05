import * as React from 'react';

import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Event } from '../../../common/types';

interface EventTimeDateProps {
  event: Event;
  sx?: SxProps;
}

const formatDate = (datetime: Date) => {
  const helper = new Date(datetime)
    .toLocaleDateString('DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace('.', ' ');
  const date = helper.replace(helper.slice(7, 8), '');

  const day = new Date(datetime).toLocaleString('DE', { day: '2-digit' });
  const month = new Date(datetime).toLocaleString('DE', { month: 'short' });
  const time = new Date(datetime).toLocaleString('DE', {
    hour: 'numeric',
    minute: 'numeric',
  });
  return { date, month, day, time };
};

export const formatDateSpan = (start: Date, end: Date) => {
  const { date: startDate, month: startMonth, day: startDay, time: startTime } = formatDate(start);
  const { date: endDate, month: endMonth, day: endDay, time: endTime } = formatDate(end);

  if (startDate === endDate) return `${startTime} - ${endTime}`;
  else return `${startDay} ${startMonth}, ${startTime} - ${endDay} ${endMonth}, ${endTime}`;
};

const EventTimeDate = ({ event, sx }: EventTimeDateProps) => (
  <Typography variant="subtitle2" color="text.primary" mr={0.5} sx={sx || textStyle}>
    {formatDateSpan(event.startTime, event.endTime)}
  </Typography>
);

const textStyle = {
  color: 'text.primary',
  fontSize: '.8em',
};

export default EventTimeDate;
