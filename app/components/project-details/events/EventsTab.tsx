import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Event } from '@/common/types';
import theme from '@/styles/theme';

import { getAllEventsForProjectFilter } from './actions';
import EventCard from './EventCard';
import FilteringPanel from './FilteringPanel';

interface EventsTabProps {
  projectId: string;
}

export type CountOfTheme = {
  theme: string;
  count: number;
  active: boolean;
};

export const EventsTab = (props: EventsTabProps) => {
  const { projectId } = props;
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
  const [currentFilters, setCurrentFilters] = useState<{
    searchTerm: string;
    pastEventsShown: boolean;
    themes: CountOfTheme[];
  }>({ searchTerm: '', pastEventsShown: false, themes: [] });

  const [hasMoreValue, setHasMoreValue] = useState(true);
  const [index, setIndex] = useState(1);
  const [hasMoreValuePast, setHasMoreValuePast] = useState(true);
  const [indexPast, setIndexPast] = useState(1);

  const clearFilters = () => {
    const deselectedThemesArray = currentFilters.themes;
    deselectedThemesArray.forEach((t) => {
      t.active = false;
    });
    setCurrentFilters({ searchTerm: '', pastEventsShown: false, themes: deselectedThemesArray });
    setFilteredEvents(futureEvents);
    setFiltersApplied(false);
  };

  const handleFilterChange = (filteredEventData: Event[] | undefined) => {
    setFiltersApplied(currentFilters.searchTerm !== '' || currentFilters.themes.some((t) => t.active));
    filteredEventData ? setFilteredEvents(filteredEventData) : setFilteredEvents([]);
  };

  const getUniqueEvents = (events: Event[]) =>
    events.reduce((unique: Event[], event) => {
      if (!unique.some((e) => e.id === event.id)) {
        unique.push(event);
      }
      return unique;
    }, []);

  const futureEvents = useMemo(() => {
    const uniqueEvents = getUniqueEvents(allEvents);

    const helper = uniqueEvents.filter((event) => new Date(event.startTime) > new Date());
    helper.sort((a, b) => {
      const timeDiffA = Math.abs(new Date().getTime() - new Date(a.startTime).getTime());
      const timeDiffB = Math.abs(new Date().getTime() - new Date(b.startTime).getTime());
      return timeDiffA - timeDiffB;
    });
    return helper;
  }, [allEvents]);

  const pastEvents = useMemo(() => {
    const uniqueEvents = getUniqueEvents(allEvents);

    const helper = uniqueEvents.filter((event) => new Date(event.startTime) <= new Date());
    helper.sort((a, b) => {
      const startTimeA = new Date(a.startTime).getTime();
      const startTimeB = new Date(b.startTime).getTime();

      return startTimeA - startTimeB;
    });

    return helper;
  }, [allEvents]);

  const loadScrollData = async () => {
    const { data } = await getAllEventsForProjectFilter({
      projectId,
      amountOfEventsPerPage: 2,
      currentPage: index,
      timeframe: 'future',
    });

    setAllEvents((prevItems: Event[]) => {
      // Combine previous items with new data, then filter for unique events
      const combinedEvents = [...prevItems, ...(data as Event[])];
      const uniqueEvents = combinedEvents.reduce((unique: Event[], event) => {
        if (!unique.some((e) => e.id === event.id)) {
          unique.push(event);
        }
        return unique;
      }, []);

      return uniqueEvents;
    });
    data?.length && data?.length > 0 ? setHasMoreValue(true) : setHasMoreValue(false);

    setIndex((prevIndex) => prevIndex + 1);
  };

  const loadScrollDataPast = async () => {
    const { data } = await getAllEventsForProjectFilter({
      projectId,
      amountOfEventsPerPage: 2,
      currentPage: indexPast,
      timeframe: 'past',
    });

    setAllEvents((prevItems: Event[]) => {
      // Combine previous items with new data, then filter for unique events
      const combinedEvents = [...prevItems, ...(data as Event[])];
      const uniqueEvents = getUniqueEvents(combinedEvents); // Reuse the getUniqueEvents function

      return uniqueEvents;
    });

    data?.length && data?.length > 0 ? setHasMoreValuePast(true) : setHasMoreValuePast(false);
    setIndexPast((prevIndexPast) => prevIndexPast + 1);
  };

  useEffect(() => {
    loadScrollData();
    loadScrollDataPast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <Card sx={cardStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={'22px'}>
          <Box sx={{ pb: { xs: 2, md: 0 } }}>
            <FilteringPanel
              events={allEvents}
              futureEvents={futureEvents}
              handleFilterChange={handleFilterChange}
              currentFilters={currentFilters}
              setCurrentFilters={setCurrentFilters}
            />
          </Box>
          {((!filtersApplied && futureEvents.length > 0) ||
            (filtersApplied && filteredEvents.length > 0) ||
            (!filtersApplied && currentFilters.pastEventsShown && pastEvents.length > 0)) && (
            <Box flexGrow={1}>
              {filteredEvents.length > 0 && filtersApplied && (
                <Box flexGrow={1}>
                  <InfiniteScroll
                    dataLength={filteredEvents.length}
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
                        Alle Daten wurden geladen
                      </Typography>
                    }
                  >
                    {filteredEvents.map((event, index) => {
                      const key = event.id || index;
                      const isFutureEvent = futureEvents.some((e) => e.id === event.id);
                      return (
                        <Box key={key} sx={{ paddingBottom: 2 }}>
                          <EventCard event={event} disabled={!isFutureEvent} />
                        </Box>
                      );
                    })}
                  </InfiniteScroll>
                </Box>
              )}

              {!filtersApplied && futureEvents.length > 0 && (
                <Box flexGrow={1}>
                  <InfiniteScroll
                    dataLength={futureEvents.length}
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
                      !currentFilters.pastEventsShown && (
                        <Typography color="primary.main" sx={{ textAlign: 'center', mt: 1 }}>
                          Alle Daten wurden geladen
                        </Typography>
                      )
                    }
                  >
                    {futureEvents.map((event, index) => {
                      const key = event.id || index;
                      const isFutureEvent = futureEvents.some((e) => e.id === event.id);
                      return (
                        <Box key={key} sx={{ paddingBottom: 2 }}>
                          <EventCard event={event} disabled={!isFutureEvent} />
                        </Box>
                      );
                    })}
                  </InfiniteScroll>
                </Box>
              )}

              {currentFilters.pastEventsShown && !filtersApplied && pastEvents.length > 0 && (
                <>
                  {futureEvents.length > 0 && <Grid item xs={3}></Grid>}
                  <Box flexGrow={1}>
                    <InfiniteScroll
                      dataLength={pastEvents.length}
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
                        pastEvents.length > 0 && (
                          <Typography color="primary.main" sx={{ textAlign: 'center', mt: 1 }}>
                            Alle Daten wurden geladen
                          </Typography>
                        )
                      }
                    >
                      {pastEvents.map((event, index) => {
                        const key = event.id || index;
                        return (
                          <Box key={key} sx={{ paddingBottom: 2 }}>
                            <EventCard event={event} disabled={true} />
                          </Box>
                        );
                      })}
                    </InfiniteScroll>
                  </Box>
                </>
              )}
            </Box>
          )}

          {/*If the filters don't find anything, display message and reset button*/}
          {filteredEvents.length === 0 && filtersApplied && (
            <EventFilterException
              text="Keine Events wurden mit diesen Filtern gefunden."
              action={{
                text: 'Alle Filter zurücksetzen',
                onClick: clearFilters,
              }}
            />
          )}
          {/*If the events don't exist, display come back later message*/}
          {futureEvents.length === 0 && pastEvents.length === 0 && (
            <EventFilterException text="Leider gibt es noch keine Events. Bitte schau später noch einmal vorbei." />
          )}
          {/*If no future events exist, display message and button to enable past events*/}
          {futureEvents.length === 0 && pastEvents.length > 0 && !currentFilters.pastEventsShown && !filtersApplied && (
            <EventFilterException
              text="Es gibt zurzeit leider keine Events in der Zukunft."
              action={{
                text: 'Alle Filter zurücksetzen',
                onClick: () => setCurrentFilters((old) => ({ ...old, pastEventsShown: true })),
              }}
            />
          )}

          {/* Pagination Controls here if needed */}
        </Stack>
      </CardContent>
    </Card>
  );
};

const EventFilterException = ({ text, action }: { text: string; action?: { text: string; onClick: () => void } }) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      columnGap={2}
      rowGap={3}
      sx={{
        borderRadius: '12px',
        borderColor: 'primary.light',
        borderStyle: 'solid',
        borderWidth: 'thin',
        marginTop: '2em',
        px: 2,
        py: 2,
        m: 0,
        alignItems: 'center',
        height: 'Fit-content',
      }}
    >
      <Typography variant="body1" color={'text.primary'} flexGrow={1}>
        {text}
      </Typography>

      {action && (
        <Button
          onClick={action.onClick}
          sx={{ p: 1, minWidth: '160px', width: { xs: '100%', sm: 'auto' }, justifyItems: 'flex-end' }}
          style={{ margin: 0 }}
        >
          {action.text}
        </Button>
      )}
    </Stack>
  );
};

const cardStyles = {
  borderRadius: '24px',
  background: '#FFF',
  position: 'relative',
  zIndex: 0,
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
};

const colorOverlayStyles = {
  width: 320,
  height: '100%',
  borderRadius: 'var(--2, 16px) 0px 0px var(--2, 16px)',
  opacity: 0.6,
  background: 'background.paper',
  position: 'absolute',
  zIndex: -1,
};

const cardContentStyles = {
  margin: '88px 44px 88px 44px',
  [theme.breakpoints.down('md')]: {
    margin: '48px 24px 48px 24px',
  },
  '&.MuiCardContent-root': {
    padding: 0,
  },
};
