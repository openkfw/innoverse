import { useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

import useHydration from '@/components/common/Hydration';

export type FilterOption = { name: string; label: string; count: number };

export default function FilterSelect(props: {
  title: string;
  options: FilterOption[];
  maxOptionsToDisplayCollapsed?: number;
  onSelect: (selectedFilters: string[]) => void;
}) {
  const { title, options, maxOptionsToDisplayCollapsed = 20, onSelect } = props;

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const { hydrated } = useHydration();

  const filterIsChecked = (filter: Pick<FilterOption, 'name'>) => selectedFilters.includes(filter.name);

  const getFilterLabel = (filter: FilterOption) => `${filter.label} (${filter.count})`;

  const selectFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const name = event.target.name;

    if (checked && !filterIsChecked({ name })) {
      const newFilters = [...selectedFilters, name];
      setSelectedFilters(newFilters);
      onSelect(newFilters);
    } else if (!checked && filterIsChecked({ name })) {
      const newFilters = selectedFilters.filter((filter) => filter !== name);
      setSelectedFilters(newFilters);
      onSelect(newFilters);
    }
  };

  const toggleExpand = () => setExpanded((expanded) => !expanded);

  if (!options.length) return <></>;

  return (
    <Box sx={{ m: 3 }}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">{title}</FormLabel>
        <FormGroup>
          {options.slice(0, maxOptionsToDisplayCollapsed).map((option, key) => (
            <FormControlLabel
              key={key}
              control={<Checkbox name={option.name} checked={filterIsChecked(option)} onChange={selectFilter} />}
              label={getFilterLabel(option)}
              disabled={!hydrated}
              data-testid="news-project-filter"
              data-testdata-count={option.count}
              data-testdata-label={option.label}
            />
          ))}
          {options.length > maxOptionsToDisplayCollapsed && !expanded && (
            <Typography onClick={toggleExpand} color="secondary" sx={{ textDecoration: 'underline' }}>
              Mehr anzeigen
            </Typography>
          )}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {options.slice(maxOptionsToDisplayCollapsed).map((option, key) => (
              <FormControlLabel
                key={key}
                control={<Checkbox name={option.name} checked={filterIsChecked(option)} onChange={selectFilter} />}
                label={getFilterLabel(option)}
                disabled={!hydrated}
              />
            ))}
            {options.length > maxOptionsToDisplayCollapsed && expanded && (
              <Typography onClick={toggleExpand} color="secondary" sx={{ textDecoration: 'underline' }}>
                Weniger anzeigen
              </Typography>
            )}
          </Collapse>
        </FormGroup>
      </FormControl>
    </Box>
  );
}
