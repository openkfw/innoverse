import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { EventWithAdditionalData } from '@/common/types';

interface EventFilterAction {
  text: string;
  onClick: () => void;
}

export type CountOfTheme = {
  theme: string;
  count: number;
  active: boolean;
};

interface CurrentFilters {
  searchTerm: string;
  pastEventsShown: boolean;
  themes: CountOfTheme[];
}

interface EventFilterExceptionProps {
  futureEvents: EventWithAdditionalData[];
  pastEvents: EventWithAdditionalData[];
  filteredFutureEvents: EventWithAdditionalData[];
  filteredPastEvents: EventWithAdditionalData[];
  filtersApplied: boolean;
  currentFilters: CurrentFilters;
  setCurrentFilters: React.Dispatch<React.SetStateAction<CurrentFilters>>;
  clearFilters: () => void;
}
const EventFilterException: React.FC<EventFilterExceptionProps> = ({
  futureEvents,
  pastEvents,
  filteredFutureEvents,
  filteredPastEvents,
  filtersApplied,
  currentFilters,
  setCurrentFilters,
  clearFilters,
}) => {
  let text = '';
  let action: EventFilterAction | undefined;

  const noEventsAvailable = futureEvents.length === 0 && pastEvents.length === 0;
  const noFutureEvents =
    filteredFutureEvents.length === 0 && filteredPastEvents.length > 0 && !currentFilters.pastEventsShown;
  const noEventsFound =
    futureEvents.length + pastEvents.length > 0 &&
    filteredFutureEvents.length === 0 &&
    filteredPastEvents.length === 0 &&
    filtersApplied;

  if (noEventsFound) {
    text = 'Mit diesem Filter wurden keine Events gefunden.';
    action = {
      text: 'Alle Filter zurücksetzen',
      onClick: clearFilters,
    };
  } else if (noEventsAvailable) {
    text = 'Leider gibt es noch keine Events. Bitte schau später noch einmal vorbei.';
  } else if (noFutureEvents) {
    text = 'Es gibt zurzeit leider keine Events in der Zukunft.';
    action = {
      text: 'Vergangene Events anzeigen',
      onClick: () => setCurrentFilters((old) => ({ ...old, pastEventsShown: true })),
    };
  }

  if (!text) return null;

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} columnGap={2} rowGap={3} sx={containerStyles}>
      <Typography variant="body1" color="text.primary" flexGrow={1}>
        {text}
      </Typography>
      {action && (
        <Button onClick={action.onClick} sx={resetFilterButtonStyles}>
          {action.text}
        </Button>
      )}
    </Stack>
  );
};

export default EventFilterException;

const containerStyles = {
  borderRadius: '12px',
  borderColor: 'primary.light',
  borderStyle: 'solid',
  borderWidth: 'thin',
  marginTop: '2em',
  px: 2,
  py: 2,
  m: 0,
  alignItems: 'center',
  height: 'fit-content',
  width: '100%',
};

const resetFilterButtonStyles = {
  justifyItems: 'flex-end',
  margin: 0,
  padding: 1,
  minWidth: '160px',
  width: {
    xs: '100%',
    sm: 'auto',
  },
};
