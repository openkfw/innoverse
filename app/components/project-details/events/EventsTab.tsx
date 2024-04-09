import { useMemo, useState } from 'react';
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

import { EventWithAdditionalData, ProjectData } from '@/common/types';
import theme from '@/styles/theme';

import { getAllEventsForProjectFilter } from './actions';
import EventCard from './EventCard';
import FilteringPanel from './FilteringPanel';

interface EventsTabProps {
  projectData: ProjectData;
}

export type CountOfTheme = {
  theme: string;
  count: number;
  active: boolean;
};

export const EventsTab = (props: EventsTabProps) => {
  const { projectData } = props;

  const [allFutureEvents, setAllFutureEvents] = useState<EventWithAdditionalData[]>([...projectData.futureEvents]);
  const [allPastEvents, setAllPastEvents] = useState<EventWithAdditionalData[]>(projectData.pastEvents);

  const [filteredFutureEvents, setFilteredFutureEvents] = useState<EventWithAdditionalData[]>([
    ...projectData.futureEvents,
  ]);
  const [filteredPastEvents, setFilteredPastEvents] = useState<EventWithAdditionalData[]>(projectData.pastEvents);

  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
  const [currentFilters, setCurrentFilters] = useState<{
    searchTerm: string;
    pastEventsShown: boolean;
    themes: CountOfTheme[];
  }>({ searchTerm: '', pastEventsShown: false, themes: getThemesFromEvents([...allFutureEvents, ...allPastEvents]) });

  const [hasMoreValue, setHasMoreValue] = useState(true);
  const [index, setIndex] = useState(2);
  const [hasMoreValuePast, setHasMoreValuePast] = useState(true);
  const [indexPast, setIndexPast] = useState(2);

  const clearFilters = () => {
    const deselectedThemesArray = currentFilters.themes;
    deselectedThemesArray.forEach((t) => {
      t.active = false;
    });
    setCurrentFilters({ searchTerm: '', pastEventsShown: false, themes: deselectedThemesArray });
    setFilteredFutureEvents(futureEvents);
    setFilteredPastEvents(pastEvents);
    setFiltersApplied(false);
  };

  const handleFilterChange = (
    filteredFuture: EventWithAdditionalData[] | undefined,
    filteredPast?: EventWithAdditionalData[] | undefined,
  ) => {
    setFiltersApplied(
      currentFilters.searchTerm !== '' || currentFilters.themes.some((t) => t.active) || currentFilters.pastEventsShown,
    );
    filteredFuture ? setFilteredFutureEvents(filteredFuture) : setFilteredFutureEvents([]);
    filteredPast ? setFilteredPastEvents(filteredPast) : setFilteredPastEvents([]);
  };

  const getUniqueEvents = (events: EventWithAdditionalData[]) =>
    events.reduce((unique: EventWithAdditionalData[], event) => {
      if (!unique.some((e) => e.id === event.id)) {
        unique.push(event);
      }
      return unique;
    }, []);

  const futureEvents = useMemo(() => {
    const uniqueEvents = getUniqueEvents(allFutureEvents);

    const helper = uniqueEvents.filter((event) => new Date(event.startTime) > new Date());
    helper.sort((a, b) => {
      const timeDiffA = Math.abs(new Date().getTime() - new Date(a.startTime).getTime());
      const timeDiffB = Math.abs(new Date().getTime() - new Date(b.startTime).getTime());
      return timeDiffA - timeDiffB;
    });
    return helper;
  }, [allFutureEvents]);

  const pastEvents = useMemo(() => {
    const uniqueEvents = getUniqueEvents(allPastEvents);

    const helper = uniqueEvents.filter((event) => new Date(event.startTime) <= new Date());
    helper.sort((a, b) => {
      const startTimeA = new Date(a.startTime).getTime();
      const startTimeB = new Date(b.startTime).getTime();

      return startTimeA - startTimeB;
    });

    return helper;
  }, [allPastEvents]);

  const loadScrollData = async () => {
    const { data } = await getAllEventsForProjectFilter({
      projectId: projectData.id,
      amountOfEventsPerPage: 2,
      currentPage: index,
      timeframe: 'future',
    });

    setAllFutureEvents((prevItems: EventWithAdditionalData[]) => {
      // Combine previous items with new data, then filter for unique events
      const combinedEvents = [...prevItems, ...(data as EventWithAdditionalData[])];
      const uniqueEvents = getUniqueEvents(combinedEvents);
      return uniqueEvents;
    });
    data?.length && data?.length > 0 ? setHasMoreValue(true) : setHasMoreValue(false);

    setIndex((prevIndex) => prevIndex + 1);
  };

  const loadScrollDataPast = async () => {
    const { data } = await getAllEventsForProjectFilter({
      projectId: projectData.id,
      amountOfEventsPerPage: 2,
      currentPage: indexPast,
      timeframe: 'past',
    });

    setAllPastEvents((prevItems: EventWithAdditionalData[]) => {
      // Combine previous items with new data, then filter for unique events
      const combinedEvents = [...prevItems, ...(data as EventWithAdditionalData[])];
      const uniqueEvents = getUniqueEvents(combinedEvents);

      return uniqueEvents;
    });

    data?.length && data?.length > 0 ? setHasMoreValuePast(true) : setHasMoreValuePast(false);
    setIndexPast((prevIndexPast) => prevIndexPast + 1);
  };

  return (
    <Card sx={cardStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={'22px'}>
          <Box sx={{ pb: { xs: 2, md: 0 } }}>
            <FilteringPanel
              pastEvents={allPastEvents}
              futureEvents={allFutureEvents}
              handleFilterChange={handleFilterChange}
              currentFilters={currentFilters}
              setCurrentFilters={setCurrentFilters}
            />
          </Box>

          {((!filtersApplied && futureEvents.length > 0) ||
            (filtersApplied && filteredFutureEvents.length > 0) ||
            (filtersApplied && filteredPastEvents.length > 0 && currentFilters.pastEventsShown) ||
            (!filtersApplied && currentFilters.pastEventsShown && pastEvents.length > 0)) && (
            <Box flexGrow={1}>
              {filteredFutureEvents.length > 0 && (
                <Box flexGrow={1}>
                  <InfiniteScroll
                    dataLength={filteredFutureEvents.length}
                    next={loadScrollData}
                    hasMore={hasMoreValue}
                    scrollThreshold={1}
                    style={{ overflow: 'unset' }}
                    loader={
                      <Stack key={0} sx={{ mt: 2 }} alignItems="center">
                        <CircularProgress />
                      </Stack>
                    }
                    endMessage={
                      (!currentFilters.pastEventsShown || pastEvents.length === 0) && (
                        <Typography color="secondary.main" sx={{ textAlign: 'center', mt: 1 }}>
                          Alle Daten wurden geladen
                        </Typography>
                      )
                    }
                  >
                    {filteredFutureEvents.map((event, index) => {
                      const key = event.id || index;
                      return (
                        <Box key={key} sx={{ paddingBottom: 2 }}>
                          {index !== 0 && <Grid item xs={3} />}
                          <EventCard event={event} disabled={false} />
                        </Box>
                      );
                    })}
                  </InfiniteScroll>
                </Box>
              )}

              {currentFilters.pastEventsShown && filteredPastEvents.length > 0 && (
                <>
                  {filteredFutureEvents.length > 0 && <Grid item xs={3}></Grid>}
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
                        filteredPastEvents.length > 0 && (
                          <Typography color="secondary.main" sx={{ textAlign: 'center', mt: 1 }}>
                            Alle Daten wurden geladen
                          </Typography>
                        )
                      }
                    >
                      {filteredPastEvents.map((event, index) => {
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
          {(futureEvents.length > 0 || pastEvents.length > 0) &&
            filteredFutureEvents.length === 0 &&
            filteredPastEvents.length === 0 &&
            filtersApplied && (
              <EventFilterException
                text="Keine Events wurden mit diesen Filtern gefunden."
                action={{
                  text: 'Alle Filter zurücksetzen',
                  onClick: clearFilters,
                }}
              />
            )}
          {/*If the events don't exist, display come back later message*/}
          {filteredFutureEvents.length === 0 && pastEvents.length === 0 && (
            <EventFilterException text="Leider gibt es noch keine Events. Bitte schau später noch einmal vorbei." />
          )}
          {/*If no future events exist, display message and button to enable past events*/}
          {filteredFutureEvents.length === 0 && filteredPastEvents.length > 0 && !currentFilters.pastEventsShown && (
            <EventFilterException
              text="Es gibt zurzeit leider keine Events in der Zukunft."
              action={{
                text: 'Vergangene Events anzeigen',
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

const getThemesFromEvents = (events: EventWithAdditionalData[]) => {
  const themes: CountOfTheme[] = [];
  if (events) {
    events.forEach((event) => {
      event.themes?.forEach((theme) => {
        const existingTheme = themes.find((t) => t.theme === theme);
        if (existingTheme) {
          existingTheme.count += 1;
        } else {
          themes.push({ theme: theme, count: 1, active: false });
        }
      });
    });
  }
  return themes.sort((a, b) => b.count - a.count);
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
  overflow: 'scroll',
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
