'use client';

import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';

import { useNewsFilter } from '@/app/contexts/news-filter-context';
import { NewsFilterProps } from '@/common/types';

export default function ProjectsInput(props: NewsFilterProps) {
  const { setFilters, filters } = props;
  const { projects, amountOfNewsProject, refetchNews } = useNewsFilter();
  const [values, setValues] = useState(filters.projects);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const name = event.target.name;
    let newValues = [...values];
    if (checked && !values.includes(name)) {
      setValues((values) => [...values, name]);
      newValues = [...values, name];
    } else if (!checked && values.includes(name)) {
      setValues(values.filter((value) => value != name));
      newValues = values.filter((value) => value != name);
    } else if (checked && values.includes(name)) {
      setValues((values) => values.filter((value) => value === name));
      newValues = values.filter((value) => value === name);
    }
    setFilters({ ...filters, projects: newValues });
    refetchNews({ ...filters, projects: newValues });
  };

  return (
    <Box sx={{ m: 3 }}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Initiativen</FormLabel>
        <FormGroup>
          {projects.map((title, key) => (
            <FormControlLabel
              key={key}
              control={<Checkbox checked={values.includes(title) || false} onChange={handleChange} name={title} />}
              label={`${title} (${amountOfNewsProject[title]})`}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
}
