import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Event } from '@/common/types';
import EventTimeDate from '@/components/project-details/events/EventTimeDate';
import IcsDownload from '@/components/project-details/events/IcsDownload';

dayjs.extend(customParseFormat);

export interface EventCardHeaderProps {
  event: Event;
  disabled?: boolean;
}

const EventCardHeader = ({ event, disabled = false }: EventCardHeaderProps) => {
  const date = dayjs(event.startTime, 'YYYY-MM-DDTHH:mm:ss.SSS');

  const renderEventType = (event: Event) => {
    switch (event.type) {
      case 'In_office':
        return 'In-office';
      case 'Remote':
        return 'Remote';
      case 'Remote_und_In_office':
        return 'Remote und In-office';
      default:
        return '';
    }
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="start">
      <Stack direction="column">
        <Typography variant="h2" sx={{ ...dateStyles, color: disabled ? 'text.primary' : 'primary.main' }}>
          {date.format('DD')}
        </Typography>
        <Typography variant="caption" sx={captionStyles}>
          {date.format('MMM')}
        </Typography>
      </Stack>
      <Stack direction="column" sx={detailsStyles}>
        <EventTimeDate event={event} sx={subtitleStyles} />
        {event.location && (
          <Typography variant="subtitle1" sx={subtitleStyles}>
            {event.location}
          </Typography>
        )}
        {event.type && (
          <Typography variant="subtitle1" sx={subtitleStyles}>
            {renderEventType(event)}
          </Typography>
        )}
      </Stack>
      <IcsDownload event={event} disabled={disabled} />
    </Stack>
  );
};

export default EventCardHeader;

export const dateStyles = {
  color: 'primary.main',
  fontSize: '48px',
};

export const captionStyles = {
  textTransform: 'uppercase',
  fontSize: '12px',
  textAlign: 'center',
  color: 'text.primary',
};

export const subtitleStyles = {
  color: 'text.primary',
  fontSize: '14px',
  lineHeight: '1.5',
  WebkitLineClamp: 1,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const detailsStyles = {
  flexGrow: 1,
  marginLeft: '16px',
  alignSelf: 'start',
  marginTop: '0.4em',
};
