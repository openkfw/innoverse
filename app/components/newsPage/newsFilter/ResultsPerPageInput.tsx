'use client';

import React, { useState } from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { NewsFilterProps } from '@/common/types';
import theme from '@/styles/theme';

export default function ResultsPerPageRadio(props: NewsFilterProps) {
  const { filters, setFilters } = props;
  const [value, setValue] = useState(filters.resultsPerPage);

  const controlLabels = [
    { value: 10, label: '10' },
    { value: 30, label: '30' },
    { value: 100, label: '100' },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt((event.target as HTMLInputElement).value);
    setValue(newValue);
    setFilters({ ...filters, resultsPerPage: newValue });
  };

  return (
    <Box sx={{ m: 3 }}>
      <FormControl>
        <FormLabel>Ergebnisse pro Seite</FormLabel>
        <RadioGroup
          defaultValue={filters.resultsPerPage}
          name="records-radio-buttons"
          value={value}
          onChange={handleChange}
        >
          {controlLabels.map((controlLabel, key) => (
            <FormControlLabel
              color="red"
              key={key}
              value={controlLabel.value}
              control={<Radio sx={radioStyles} />}
              label={controlLabel.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

// Results Per Page Input Styles
const radioStyles = {
  '&.Mui-checked': { color: theme.palette.secondary.main },
};
