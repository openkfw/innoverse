import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { EventWithAdditionalData } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';

import EventCard from './EventCard';

interface EventListProps {
  filteredFutureEvents: EventWithAdditionalData[];
  filteredPastEvents: EventWithAdditionalData[];
  pastEvents: EventWithAdditionalData[];
  currentFilters: { pastEventsShown: boolean };
  loadScrollData: () => Promise<void>;
  loadScrollDataPast: () => Promise<void>;
  hasMoreValue: boolean;
  hasMoreValuePast: boolean;
  filtersApplied: boolean;
  futureEvents: EventWithAdditionalData[];
}

const EventList: React.FC<EventListProps> = ({
  filteredFutureEvents,
  filteredPastEvents,
  pastEvents,
  futureEvents,
  currentFilters,
  loadScrollData,
  loadScrollDataPast,
  hasMoreValue,
  hasMoreValuePast,
  filtersApplied,
}) => {
  const showPastEvents = currentFilters.pastEventsShown && filteredPastEvents.length > 0;
  const showFutureEvents = !filtersApplied && futureEvents.length > 0;
  const showFilteredFutureEvents = filtersApplied && filteredFutureEvents.length > 0;
  const showFilteredPastEvents = filtersApplied && filteredPastEvents.length > 0 && currentFilters.pastEventsShown;
  const showEvents = showFutureEvents || showFilteredFutureEvents || showFilteredPastEvents || showPastEvents;

  return (
    <Box flexGrow={1}>
      {showEvents && (
        <Box flexGrow={1}>
          <InfiniteScroll
            dataLength={filteredFutureEvents.length}
            next={loadScrollData}
            hasMore={hasMoreValue}
            scrollThreshold={0.5}
            style={{ overflow: 'unset' }}
            loader={
              <Stack key={0} sx={{ mt: 2 }} alignItems="center">
                <CircularProgress />
              </Stack>
            }
            endMessage={
              <Typography color="primary.main" sx={{ textAlign: 'center', mt: 1 }}>
                {!currentFilters.pastEventsShown || pastEvents.length === 0 ? 'Alle Daten wurden geladen' : ''}
              </Typography>
            }
          >
            {filteredFutureEvents.map((event, index) => (
              <Box key={event.id || index} sx={cardStyles}>
                <EventCard event={event} disabled={false} arrow={false} />
              </Box>
            ))}
          </InfiniteScroll>
        </Box>
      )}

      {showPastEvents && (
        <Box flexGrow={1}>
          <InfiniteScroll
            dataLength={filteredPastEvents.length}
            next={loadScrollDataPast}
            hasMore={hasMoreValuePast}
            scrollThreshold={0.5}
            style={{ overflow: 'unset' }}
            loader={
              <Stack key={0} sx={{ mt: 2 }} alignItems="center">
                <CircularProgress />
              </Stack>
            }
            endMessage={
              <Typography color="primary.main" sx={{ textAlign: 'center', mt: 1 }}>
                {m.components_projectdetails_events_eventList_dataLoaded()}
              </Typography>
            }
          >
            {filteredPastEvents.map((event, index) => (
              <Box key={event.id || index} sx={cardStyles}>
                <EventCard event={event} disabled={true} arrow={false} />
              </Box>
            ))}
          </InfiniteScroll>
        </Box>
      )}
    </Box>
  );
};

export default EventList;

const cardStyles = {
  paddingBottom: 2,
};
