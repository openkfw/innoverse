import React, { SetStateAction, useEffect, useMemo } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { Event } from '@/common/types';

import { CountOfTheme } from './EventsTab';

interface FilteringPanelProps {
  events: Event[];
  futureEvents: Event[];
  handleFilterChange: (filteredEvents: Event[] | undefined) => void;
  currentFilters: {
    searchTerm: string;
    pastEventsShown: boolean;
    themes: CountOfTheme[];
  };
  setCurrentFilters: React.Dispatch<
    SetStateAction<{
      searchTerm: string;
      pastEventsShown: boolean;
      themes: CountOfTheme[];
    }>
  >;
}

export const FilteringPanel = (props: FilteringPanelProps) => {
  const { events, futureEvents, handleFilterChange, currentFilters, setCurrentFilters } = props;

  const themesArrayAfterLoading = useMemo(() => {
    const tempArray: CountOfTheme[] = [];
    if (events) {
      events.forEach((event) => {
        event.themes?.forEach((theme) => {
          const existingTheme = tempArray.find((t) => t.theme === theme);
          if (existingTheme) {
            existingTheme.count += 1;
          } else {
            tempArray.push({ theme: theme, count: 1, active: false });
          }
        });
      });
    }

    tempArray.sort((a, b) => b.count - a.count);

    return tempArray;
  }, [events, currentFilters]);

  useEffect(() => {
    setCurrentFilters((old) => ({
      ...old,
      themes: themesArrayAfterLoading,
    }));

    if (!currentFilters.pastEventsShown) {
      handleFilterChange(futureEvents);
    } else {
      handleFilterChange(events);
    }
  }, [events]);

  useEffect(() => {
    const eventsToFilter = currentFilters.pastEventsShown ? events : futureEvents;
    const filteredEventsByTheme = filterEventsByTheme(eventsToFilter);
    const filteredEventsBySearch = filterEventsBySearch(filteredEventsByTheme);
    handleFilterChange(filteredEventsBySearch);
  }, [currentFilters.pastEventsShown, currentFilters.themes, currentFilters.searchTerm, events, futureEvents]);

  const filterEventsByTheme = (eventsToFilter: Event[]) => {
    const activeThemes = currentFilters.themes.filter((theme) => theme.active).map((theme) => theme.theme);
    if (!activeThemes.length) {
      return eventsToFilter;
    }
    return eventsToFilter.filter((event) => event.themes.some((theme) => activeThemes.includes(theme)));
  };

  const filterEventsBySearch = (eventsToFilter: Event[]) => {
    const searchValue = currentFilters.searchTerm;
    if (searchValue && searchValue.trim() !== '') {
      const lowerCaseInput = searchValue.toLowerCase();
      return eventsToFilter.filter((event) => {
        const startTimeStr = event.startTime ? new Date(event.startTime).toLocaleString().toLowerCase() : '';
        return (
          (event.themes && event.themes.some((theme) => theme && theme.toLowerCase().includes(lowerCaseInput))) ||
          (event.description && event.description.toLowerCase().includes(lowerCaseInput)) ||
          (event.title && event.title.toLowerCase().includes(lowerCaseInput)) ||
          (event.type && event.type.toLowerCase().includes(lowerCaseInput)) ||
          startTimeStr.includes(lowerCaseInput)
        );
      });
    }
    return eventsToFilter;
  };

  const handleFilterClick = (formEvent: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name, checked } = formEvent.target;

    if (value === 'Themen') {
      const updatedThemeHelper = currentFilters.themes.map(
        (theme: { theme: string; active: boolean; count: number }) => {
          if (theme.theme === name) {
            return { ...theme, active: !theme.active };
          }
          return theme;
        },
      );

      updatedThemeHelper.sort((a, b) => b.count - a.count);

      setCurrentFilters((old) => ({
        ...old,
        themes: updatedThemeHelper,
      }));

      const eventsToFilter = currentFilters.pastEventsShown ? events : futureEvents;
      const filteredEvents = filterEventsByTheme(eventsToFilter);
      handleFilterChange(filteredEvents);
    }

    if (name === 'pastEventsSwitch') {
      setCurrentFilters((old) => ({
        ...old,
        pastEventsShown: checked,
      }));

      const eventsToFilter = checked ? events : futureEvents;
      const filteredEvents = filterEventsByTheme(eventsToFilter);
      handleFilterChange(filteredEvents);
    }
  };

  return (
    <Box sx={filterOptionStyles}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <TextField
          id="outlined-basic-search"
          variant="outlined"
          value={currentFilters.searchTerm}
          placeholder="Suche"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setCurrentFilters((old) => ({
              ...old,
              searchTerm: e.target.value,
            }));
          }}
        />
      </FormControl>

      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">
          <Typography variant="body2" color="text.primary">
            Themen
          </Typography>
        </FormLabel>
        <FormGroup>
          {currentFilters.themes.length > 0 ? (
            currentFilters.themes.slice(0, 3).map((item, key) => {
              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      sx={{
                        color: 'text.primary',
                        '&.Mui-checked': {
                          color: 'secondary',
                        },
                      }}
                      checked={item.active}
                      onChange={handleFilterClick}
                      name={item.theme}
                    />
                  }
                  label={
                    <Typography variant="body1" color="text.primary">
                      {item.theme + ' (' + item.count + ')'}
                    </Typography>
                  }
                  value={'Themen'}
                />
              );
            })
          ) : (
            <Typography variant="body1" color="text.primary">
              Die Events haben noch keine Themen.
            </Typography>
          )}
        </FormGroup>
      </FormControl>

      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel
            control={<Switch onChange={handleFilterClick} />}
            name="pastEventsSwitch"
            checked={currentFilters.pastEventsShown}
            label={
              <Typography variant="body1" color={'text.primary'}>
                Vergangene Events anzeigen
              </Typography>
            }
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default FilteringPanel;

const filterOptionStyles = {
  borderRadius: '12px',
  borderColor: 'primary.light',
  borderStyle: 'solid',
  borderWidth: 'thin',
  padding: '1em',
  margin: '1em',
  position: 'relative',
};
