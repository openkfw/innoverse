'use client';

import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

import { useNewsFilter } from '@/app/contexts/news-filter-context';
import { NewsFilterProps } from '@/common/types';
import useHydration from '@/components/common/Hydration';

const MAX_AMOUNT = 3;

export default function TopicInput(props: NewsFilterProps) {
  const { filters, setFilters } = props;
  const { topics, amountOfNewsTopic, refetchNews } = useNewsFilter();
  const [values, setValues] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const { hydrated } = useHydration();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
    setFilters({ ...filters, topics: newValues });
    refetchNews({ filters: { ...filters, topics: newValues }, fullRefetch: false });
  };

  return (
    <Box sx={{ m: 3 }} data-testid="topic-filters">
      {topics && (
        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">Themen</FormLabel>
          <FormGroup>
            {topics.slice(0, MAX_AMOUNT).map((topic, key) => (
              <FormControlLabel
                key={key}
                control={<Checkbox checked={values.includes(topic) || false} onChange={handleChange} name={topic} />}
                label={`${topic} (${amountOfNewsTopic[topic]})`}
                disabled={!hydrated}
                data-testid="news-topic-filter"
                data-testdata-count={amountOfNewsTopic[topic]}
                data-testdata-label={topic}
              />
            ))}
            {topics.length > MAX_AMOUNT && !expanded && (
              <Typography onClick={handleExpandClick} color="secondary" sx={{ textDecoration: 'underline' }}>
                Mehr anzeigen
              </Typography>
            )}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              {topics.slice(MAX_AMOUNT).map((topic, key) => (
                <FormControlLabel
                  key={key}
                  control={<Checkbox checked={values.includes(topic) || false} onChange={handleChange} name={topic} />}
                  label={`${topic} (${amountOfNewsTopic[topic]})`}
                  disabled={!hydrated}
                />
              ))}
              {topics.length > MAX_AMOUNT && expanded && (
                <Typography onClick={handleExpandClick} color="secondary" sx={{ textDecoration: 'underline' }}>
                  Weniger anzeigen
                </Typography>
              )}
            </Collapse>
          </FormGroup>
        </FormControl>
      )}
    </Box>
  );
}
