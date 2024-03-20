import * as React from 'react';

import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Event } from '../../../common/types';

export const defaultImageForEvents = '/images/event_image.jpg';

interface IcsDownloadProps {
  event: Event;
}

const IcsDownload = (props: IcsDownloadProps) => {
  const { event } = props;

  const generateIcsFileContent = (event: Event) => {
    const formatDateToIcs = (date: Date) => {
      // Format the date to the iCalendar format
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateToIcs(new Date(event.startTime))}`,
      `DTEND:${formatDateToIcs(new Date(event.endTime))}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  };

  const downloadIcsFile = (icsContent: string, filename: string) => {
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Grid container direction="column" alignContent={'end'}>
      <Grid item>
        <Button
          sx={buttonStyles}
          onClick={() => {
            downloadIcsFile(generateIcsFileContent(event), event.title);
          }}
        >
          <InsertInvitationOutlinedIcon sx={{ color: ' rgba(0, 0, 0, 0.56)' }} />
        </Button>
        <Typography variant="body2" color=" rgba(0, 0, 0, 0.56)">
          Eintragen
        </Typography>
      </Grid>
    </Grid>
  );
};

export default IcsDownload;

const buttonStyles = {
  bgcolor: 'transparent',
  borderRadius: '4px',
  color: 'text.primary',
  '&:hover': {
    color: 'secondary.main',
    bgcolor: 'transparent',
  },
};
