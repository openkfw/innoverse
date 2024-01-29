'use client';

import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

import { AmountOfNews, NewsFilterProps } from '@/common/types';

import { getUpdatesTopics, mapUpdatesTopics } from './actions';

const MAX_AMOUNT = 3;

export default function TopicInput(props: NewsFilterProps) {
  const { filters, setFilters } = props;
  const [topics, setTopics] = useState<string[]>([]);
  const [values, setValues] = useState(filters.projects);
  const [expanded, setExpanded] = useState(false);
  const [amountOfNews, setAmountOfNews] = useState<AmountOfNews>({});

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const name = event.target.name;
    if (checked && !values.includes(name)) {
      setValues((values) => [...values, name]);
    } else if (!checked && values.includes(name)) {
      setValues(values.filter((value) => value != name));
    } else if (checked && values.includes(name)) {
      setValues((values) => values.filter((value) => value === name));
    }
  };

  useEffect(() => {
    setFilters({ ...filters, topics: values });
  }, [values]);

  useEffect(() => {
    const setFilterTopics = async () => {
      const topics = await getUpdatesTopics();
      setAmountOfNews(await mapUpdatesTopics());
      setTopics(topics);
    };
    setFilterTopics();
  }, []);

  return (
    <Box sx={{ m: 3 }}>
      {topics && (
        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">Themen</FormLabel>
          <FormGroup>
            {topics.slice(0, MAX_AMOUNT).map((topic, key) => (
              <FormControlLabel
                key={key}
                control={<Checkbox checked={values.includes(topic) || false} onChange={handleChange} name={topic} />}
                label={`${topic} (${amountOfNews[topic]})`}
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
                  label={`${topic} (${amountOfNews[topic]})`}
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
