import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Event } from '@/common/types';

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
  }, [projectId]);

  return (
    <Card sx={cardStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        <Grid container direction="row" spacing={2}>
          <Grid
            item
            xs={3}
            mb={-250}
            sx={filteredEvents.length === 0 ? { height: '150em' } : { height: 'auto', minHeight: '150em' }}
          >
            <FilteringPanel
              events={allEvents}
              futureEvents={futureEvents}
              handleFilterChange={handleFilterChange}
              currentFilters={currentFilters}
              setCurrentFilters={setCurrentFilters}
            />
          </Grid>

          {filteredEvents.length > 0 && filtersApplied && (
            <Grid item xs={9}>
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
                  <Typography color="secondary.main" sx={{ textAlign: 'center', mt: 1 }}>
                    Alle Daten wurden geladen
                  </Typography>
                }
              >
                {filteredEvents.map((event, index) => {
                  const key = event.id || index;
                  return (
                    <Box key={key} sx={{ paddingBottom: 2 }}>
                      {index !== 0 && <Grid item xs={3} />}
                      <EventCard
                        event={event}
                        time={futureEvents.find((e) => e.id === event.id) ? 'future' : 'past'}
                        isEventLast={filteredEvents.length === index}
                      />
                    </Box>
                  );
                })}
              </InfiniteScroll>
            </Grid>
          )}

          {!filtersApplied && futureEvents.length > 0 && (
            <Grid item xs={9}>
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
                    <Typography color="secondary.main" sx={{ textAlign: 'center', mt: 1 }}>
                      Alle Daten wurden geladen
                    </Typography>
                  )
                }
              >
                {futureEvents.map((event, index) => {
                  const key = event.id || index;
                  return (
                    <Box key={key} sx={{ paddingBottom: 2 }}>
                      {index !== 0 && <Grid item xs={3} />}
                      <EventCard event={event} time={'future'} isEventLast={index === futureEvents.length} />
                    </Box>
                  );
                })}
              </InfiniteScroll>
            </Grid>
          )}

          {currentFilters.pastEventsShown && !filtersApplied && pastEvents.length > 0 && (
            <>
              {futureEvents.length > 0 && <Grid item xs={3}></Grid>}
              <Grid item xs={9}>
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
                      <Typography color="secondary.main" sx={{ textAlign: 'center', mt: 1 }}>
                        Alle Daten wurden geladen
                      </Typography>
                    )
                  }
                >
                  {pastEvents.map((event, index) => {
                    const key = event.id || index;
                    return (
                      <Box key={key} sx={{ paddingBottom: 2 }}>
                        <EventCard event={event} time={'past'} isEventLast={index === pastEvents.length} />
                      </Box>
                    );
                  })}
                </InfiniteScroll>
              </Grid>
            </>
          )}

          {/*If the filters don't find anything, display message and reset button*/}
          {filteredEvents.length === 0 && filtersApplied && (
            <>
              <Grid
                item
                xs={8}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'primary.light',
                  borderStyle: 'solid',
                  borderWidth: 'thin',
                  height: '4em',
                  marginTop: '2em',
                }}
              >
                <Typography variant="body1" color={'text.primary'}>
                  Keine Events wurden mit diesen Filtern gefunden.&nbsp;
                  <Link>
                    <Button
                      id="reset_filters"
                      onClick={clearFilters /*handleFilterChange(futureEvents, clickEvent)*/}
                      sx={{ padding: 1, marginTop: -0.7 }}
                    >
                      Alle Filter zurücksetzen
                    </Button>
                  </Link>
                </Typography>
              </Grid>
            </>
          )}
          {/*If the events don't exist, display come back later message*/}
          {futureEvents.length === 0 && pastEvents.length === 0 && (
            <>
              <Grid
                item
                xs={8}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'primary.light',
                  borderStyle: 'solid',
                  borderWidth: 'thin',
                  height: '4em',
                  marginTop: '2em',
                }}
              >
                <Typography variant="body1" color={'text.primary'}>
                  Leider gibt es noch keine Events. Bitte schau später noch einmal vorbei.&nbsp;
                </Typography>
              </Grid>
            </>
          )}
          {/*If no future events exist, display message and button to enable past events*/}
          {futureEvents.length === 0 && pastEvents.length > 0 && !currentFilters.pastEventsShown && !filtersApplied && (
            <>
              <Grid
                item
                xs={8}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'primary.light',
                  borderStyle: 'solid',
                  borderWidth: 'thin',
                  height: '4em',
                  marginTop: '2em',
                }}
              >
                <Typography variant="body1" color={'text.primary'}>
                  Es gibt zurzeit leider keine Events in der Zukunft.&nbsp;
                  <Link>
                    <Button
                      id="reset_filters"
                      onClick={() =>
                        setCurrentFilters((old) => ({
                          ...old,
                          pastEventsShown: true,
                        }))
                      }
                      sx={{ padding: 1, marginTop: -0.7 }}
                    >
                      Vergangene Events anzeigen
                    </Button>
                  </Link>
                </Typography>
              </Grid>
            </>
          )}

          <Grid item xs={7} />
          {/* Pagination Controls here if needed */}
        </Grid>
      </CardContent>
    </Card>
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
  marginTop: 11,
  marginBottom: 11,
  '&.MuiCardContent-root': {
    padding: 0,
  },
};
