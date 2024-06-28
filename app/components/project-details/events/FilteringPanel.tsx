import React, { SetStateAction, useEffect } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { EventWithAdditionalData } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';

import { CountOfTheme } from './EventsTab';

interface FilteringPanelProps {
  pastEvents: EventWithAdditionalData[];
  futureEvents: EventWithAdditionalData[];
  handleFilterChange: (
    filteredFutureEvents: EventWithAdditionalData[] | undefined,
    filteredPastEvents?: EventWithAdditionalData[] | undefined,
  ) => void;
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
  const { pastEvents, futureEvents, handleFilterChange, currentFilters, setCurrentFilters } = props;

  useEffect(() => {
    const filteredFutureEvents = filterEventsBySearch(filterEventsByTheme(futureEvents));

    handleFilterChange(filteredFutureEvents, filterEventsBySearch(filterEventsByTheme(pastEvents)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilters.pastEventsShown, currentFilters.themes, currentFilters.searchTerm]);

  const filterEventsByTheme = (eventsToFilter: EventWithAdditionalData[]) => {
    const activeThemes = currentFilters.themes.filter((theme) => theme.active).map((theme) => theme.theme);
    if (!activeThemes.length) {
      return eventsToFilter;
    }
    return eventsToFilter.filter((event) => event.themes.some((theme) => activeThemes.includes(theme)));
  };

  const filterEventsBySearch = (eventsToFilter: EventWithAdditionalData[]) => {
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

      const filteredFutureEvents = filterEventsByTheme(futureEvents);

      currentFilters.pastEventsShown
        ? handleFilterChange(filteredFutureEvents, filterEventsByTheme(pastEvents))
        : handleFilterChange(filteredFutureEvents);
    } else if (name === 'pastEventsSwitch') {
      setCurrentFilters((old) => ({
        ...old,
        pastEventsShown: checked,
      }));
      const filteredFutureEvents = filterEventsByTheme(futureEvents);

      checked
        ? handleFilterChange(filteredFutureEvents, filterEventsByTheme(pastEvents))
        : handleFilterChange(filteredFutureEvents);
    }
  };

  return (
    <Stack direction={'column'} sx={filterOptionStyles}>
      <FormControl margin={'normal'} style={{ margin: '10px' }} sx={{ mx: 1 }} component="fieldset" variant="standard">
        <TextField
          id="outlined-basic-search"
          variant="outlined"
          value={currentFilters.searchTerm}
          placeholder={m.components_projectdetails_events_filteringPanel_searchPlaceholder()}
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

      <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
        <FormLabel component="legend">
          <Typography variant="body2" color="text.primary">
            {m.components_projectdetails_events_filteringPanel_topic()}
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
              {m.components_projectdetails_events_filteringPanel_noTopics()}
            </Typography>
          )}
        </FormGroup>
      </FormControl>

      <FormControl sx={{ mx: 2 }} component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel
            control={<Switch onChange={handleFilterClick} />}
            name="pastEventsSwitch"
            checked={currentFilters.pastEventsShown}
            label={
              <Typography variant="body1" color={'text.primary'}>
                {m.components_projectdetails_events_filteringPanel_previousTopics()}
              </Typography>
            }
          />
        </FormGroup>
      </FormControl>
    </Stack>
  );
};

export default FilteringPanel;

const filterOptionStyles = {
  borderRadius: '12px',
  borderColor: 'primary.light',
  borderStyle: 'solid',
  borderWidth: 'thin',
  padding: '1em',
  position: 'relative',
};
