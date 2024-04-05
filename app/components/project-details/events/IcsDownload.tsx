import * as React from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { TransparentButton } from '@/components/common/TransparentButton';
import AddToCalendarIcon from '@/components/icons/AddToCalendarIcon';
import palette from '@/styles/palette';

import { Event } from '../../../common/types';

export const defaultImageForEvents = '/images/event_image.jpg';

interface IcsDownloadProps {
  event: Event;
  disabled?: boolean;
}

const IcsDownload = ({ event, disabled = false }: IcsDownloadProps) => {
  const { downloadIcsFileForEvent } = useIcsDownload(event);
  const color = disabled ? palette.action?.disabled : palette.text?.primary;

  return (
    <TransparentButton disabled={disabled} onClick={downloadIcsFileForEvent} sx={{ px: 1, m: 0 }}>
      <Stack sx={{ alignItems: 'center' }}>
        <AddToCalendarIcon color={color} />
        <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 500, mt: '2px' }} color={color}>
          Eintragen
        </Typography>
      </Stack>
    </TransparentButton>
  );
};

function useIcsDownload(event: Event) {
  const generateIcsFileContent = (event: Event) => {
    const formatDateToIcs = (date: Date) => {
      // Format the date to the iCalendar format (YYYYMMDDTHHmmssZ)
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const formatDescriptionToIcs = (description: string | undefined) => {
      if (description) {
        return description.replace(/(?:\r\n|\r|\n)/g, '\\n');
      }
      return description;
    };

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateToIcs(new Date(event.startTime))}`,
      `DTEND:${formatDateToIcs(new Date(event.endTime))}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${formatDescriptionToIcs(event.description)}`,
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

  const downloadIcsFileForEvent = () => {
    const content = generateIcsFileContent(event);
    downloadIcsFile(content, event.title);
  };

  return { downloadIcsFileForEvent };
}

export default IcsDownload;
