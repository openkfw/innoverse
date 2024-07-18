'use client';

import React, { useEffect, useState } from 'react';

import { Search } from '@mui/icons-material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { NewsFeedFilters } from '@/app/contexts/news-feed-context';

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
      updateFilters(inputValue); // Update filters with input value
    }, 300);

    return () => {
      clearTimeout(timeoutId); // Clear the timeout if inputValue changes or component unmounts
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <Box sx={{ margin: 3 }}>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <Typography mb={1} color="white" variant="button">
          Search
        </Typography>
        <TextField
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
              '& input': {
                color: 'white',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'white' }} />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </Box>
  );
}
