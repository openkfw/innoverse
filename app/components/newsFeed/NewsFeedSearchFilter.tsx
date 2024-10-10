'use client';

import React, { useEffect, useState } from 'react';

import { Search } from '@mui/icons-material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { NewsFeedFilters } from '@/app/contexts/news-feed-context';
import * as m from '@/src/paraglide/messages.js';

type NewsFeedSearchFilterProps = {
  isLoading: boolean;
  filters: NewsFeedFilters;
  setFilters: (filters: NewsFeedFilters) => void;
};

export default function NewsFeedSearchFilter(props: NewsFeedSearchFilterProps) {
  const { filters, setFilters } = props;

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: { target: { value: string } }) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  const updateFilters = (searchString: string) => {
    const updatedFilters = { ...filters, searchString };
    setFilters(updatedFilters);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters(inputValue);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <Box sx={{ margin: 3 }}>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <Typography mb={1} color="white" variant="button">
          {m.components_newsFeed_newsFeedSearchFilter_search()}
        </Typography>
        <TextField
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'common.white',
              },
              '&:hover fieldset': {
                borderColor: 'common.white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'action.hover',
              },
              '& input': {
                color: 'common.white',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'common.white' }} />
              </InputAdornment>
            ),
          }}
          inputProps={{
            'aria-label': 'Search field',
          }}
        />
      </FormControl>
    </Box>
  );
}
