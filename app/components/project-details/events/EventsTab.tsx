'use client';

import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';

import { EventWithAdditionalData, Project } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getAllEventsForProjectFilter } from '@/utils/requests/events/requests';

import EmptyTabContent from '../EmptyTabContent';

import EventFilterException from './EventFilterException';
import EventList from './EventList';
import FilteringPanel from './FilteringPanel';

interface EventsTabProps {
  project: Project;
  isFollowed: boolean;
  setFollowed: (i: boolean) => void;
  followersAmount: number;
  setFollowersAmount: (i: number) => void;
}

export type CountOfTheme = {
  theme: string;
  count: number;
  active: boolean;
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

export const EventsTab: React.FC<EventsTabProps> = (props) => {
  const { project, ...otherProps } = props;
  const [hasMoreValue, setHasMoreValue] = useState(true);
  const [index, setIndex] = useState(2);
  const [hasMoreValuePast, setHasMoreValuePast] = useState(true);
  const [indexPast, setIndexPast] = useState(2);
  const [allFutureEvents, setAllFutureEvents] = useState<EventWithAdditionalData[]>([...project.futureEvents]);
  const [allPastEvents, setAllPastEvents] = useState<EventWithAdditionalData[]>(project.pastEvents);
  const [filteredFutureEvents, setFilteredFutureEvents] = useState<EventWithAdditionalData[]>([
    ...project.futureEvents,
  ]);
  const [filteredPastEvents, setFilteredPastEvents] = useState<EventWithAdditionalData[]>(project.pastEvents);
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
  const [currentFilters, setCurrentFilters] = useState<{
    searchTerm: string;
    pastEventsShown: boolean;
    themes: CountOfTheme[];
  }>({ searchTerm: '', pastEventsShown: false, themes: getThemesFromEvents([...allFutureEvents, ...allPastEvents]) });

  function getUniqueEvents(events: EventWithAdditionalData[]) {
    const uniqueEventIds = new Set();
    return events.filter((event) => !uniqueEventIds.has(event.id) && uniqueEventIds.add(event.id));
  }

  const futureEvents = useMemo(() => {
    const now = Date.now();
    return getUniqueEvents(allFutureEvents)
      .filter((event) => new Date(event.startTime).getTime() > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [allFutureEvents]);

  const pastEvents = useMemo(() => {
    const now = Date.now();
    return getUniqueEvents(allPastEvents)
      .filter((event) => new Date(event.startTime).getTime() <= now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [allPastEvents]);

  async function loadScrollData() {
    const result = await getAllEventsForProjectFilter({
      projectId: project.id,
      amountOfEventsPerPage: 2,
      currentPage: index,
      timeframe: 'future',
    });

    const events = result?.data ?? [];
    setAllFutureEvents((prevItems) => getUniqueEvents([...prevItems, ...events]));
    setHasMoreValue(events.length > 0);
    setIndex((prevIndex) => prevIndex + events.length);
  }

  async function loadScrollDataPast() {
    const result = await getAllEventsForProjectFilter({
      projectId: project.id,
      amountOfEventsPerPage: 2,
      currentPage: indexPast,
      timeframe: 'past',
    });

    const events = result?.data ?? [];
    setAllPastEvents((prevItems) => getUniqueEvents([...prevItems, ...events]));
    setHasMoreValuePast(events.length > 0);
    setIndexPast((prevIndexPast) => prevIndexPast + 1);
  }

  const filterEventsByTheme = (events: EventWithAdditionalData[]) => {
    const activeThemes = currentFilters.themes.filter((theme) => theme.active).map((theme) => theme.theme);
    return activeThemes.length
      ? events.filter((event) => event.themes.some((theme) => activeThemes.includes(theme)))
      : events;
  };

  const filterEventsBySearch = (events: EventWithAdditionalData[]) => {
    const searchTerm = currentFilters.searchTerm.toLowerCase();
    return searchTerm
      ? events.filter(
          (event) =>
            event?.description?.toLowerCase().includes(searchTerm) || event.title.toLowerCase().includes(searchTerm),
        )
      : events;
  };

  const applyAllFilters = (events: EventWithAdditionalData[]) => {
    return filterEventsBySearch(filterEventsByTheme(events));
  };

  useEffect(() => {
    setFilteredFutureEvents(applyAllFilters(allFutureEvents));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFutureEvents, currentFilters]);

  function handleFilterChange(
    filteredFuture: EventWithAdditionalData[] = [],
    filteredPast: EventWithAdditionalData[] = [],
  ) {
    const filtersAreApplied =
      currentFilters.searchTerm !== '' || currentFilters.themes.some((t) => t.active) || currentFilters.pastEventsShown;
    setFiltersApplied(filtersAreApplied);
    setFilteredFutureEvents(filteredFuture);
    setFilteredPastEvents(filteredPast);
  }

  function clearFilters() {
    const deselectedThemesArray = currentFilters.themes.map((theme) => ({ ...theme, active: false }));
    setCurrentFilters({ searchTerm: '', pastEventsShown: false, themes: deselectedThemesArray });
    setFilteredFutureEvents(futureEvents);
    setFilteredPastEvents(pastEvents);
    setFiltersApplied(false);
  }

  if (futureEvents?.length === 0) {
    return (
      <Card sx={cardStyles}>
        <EmptyTabContent
          {...otherProps}
          project={project}
          message={m.components_projectdetails_events_eventsTab_message()}
        />
      </Card>
    );
  }

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

          <EventList
            filteredFutureEvents={filteredFutureEvents}
            filteredPastEvents={filteredPastEvents}
            pastEvents={pastEvents}
            futureEvents={futureEvents}
            currentFilters={currentFilters}
            loadScrollData={loadScrollData}
            loadScrollDataPast={loadScrollDataPast}
            hasMoreValue={hasMoreValue}
            hasMoreValuePast={hasMoreValuePast}
            filtersApplied={filtersApplied}
          />

          <EventFilterException
            futureEvents={futureEvents}
            pastEvents={pastEvents}
            filteredFutureEvents={filteredFutureEvents}
            filteredPastEvents={filteredPastEvents}
            filtersApplied={filtersApplied}
            currentFilters={currentFilters}
            setCurrentFilters={setCurrentFilters}
            clearFilters={clearFilters}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EventsTab;

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
