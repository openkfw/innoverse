'use client';

import React, { useEffect, useState } from 'react';

import { Search } from '@mui/icons-material';
import { Box, FormControl, InputAdornment, TextField, Typography } from '@mui/material';

import { useProjects } from '@/app/contexts/project-page-context';

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
          search
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
