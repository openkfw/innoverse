'use client';

import React, { useEffect, useState } from 'react';

import { Search } from '@mui/icons-material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useProjects } from '@/app/contexts/project-page-context';
import * as m from '@/src/paraglide/messages.js';

export default function ProjectFilter() {
  const { filters, setFilters } = useProjects();
  const [inputValue, setInputValue] = useState('');

  const updateFilters = (searchString: string) => {
    const updatedFilters = { ...filters, searchString };
    setFilters(updatedFilters);
  };

  const handleInputChange = (event: { target: { value: string } }) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  useEffect(() => {
    // if (inputValue !== filters.searchString) {
    //   const timeoutId = setTimeout(() => {
    //     updateFilters(inputValue);
    //   }, 300);
    //   return () => {
    //     clearTimeout(timeoutId);
    //   };
    // }
    //todo to be fixed

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
          {m.components_projectpage_projectPageContainer_search()}
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
          inputProps={{
            'aria-label': 'Search field',
          }}
        />
      </FormControl>
    </Box>
  );
}
