import { useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useHydration from '@/components/common/Hydration';
import { FiltersSkeleton } from '@/components/skeletons/FiltersSkeleton';

export type FilterOption = { name: string; label: string; count: number };

export default function FilterSelect(props: {
  title: string;
  isLoading?: boolean;
  options: FilterOption[] | undefined;
  maxOptionsToDisplayCollapsed?: number;
  onSelect: (selectedFilters: string[]) => void;
}) {
  const { title, options, maxOptionsToDisplayCollapsed = 20, isLoading = false, onSelect } = props;

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

  if (isLoading) return <FiltersSkeleton count={4} sx={{ mt: 2, mb: 3 }} />;
  if (!options?.length) return <></>;

  return (
    <>
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
              <Stack direction={'column'}>
                {options.slice(maxOptionsToDisplayCollapsed).map((option, key) => (
                  <FormControlLabel
                    key={key}
                    control={<Checkbox name={option.name} checked={filterIsChecked(option)} onChange={selectFilter} />}
                    label={getFilterLabel(option)}
                    disabled={!hydrated}
                  />
                ))}
              </Stack>
              {options.length > maxOptionsToDisplayCollapsed && expanded && (
                <Typography onClick={toggleExpand} color="secondary" sx={{ textDecoration: 'underline' }}>
                  Weniger anzeigen
                </Typography>
              )}
            </Collapse>
          </FormGroup>
        </FormControl>
      </Box>
    </>
  );
}
