import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

import { ProjectUpdate } from '@/common/types';

import { UpdateCard } from './UpdateCard';
import { YearField } from './YearField';

interface UpdatesTabProps {
  updates: ProjectUpdate[];
}

function getYear(date: string) {
  const [, , year] = date.split(' ');
  return year;
}

export const UpdatesTab = (props: UpdatesTabProps) => {
  const { updates } = props;

  const years = updates
    .map((update) => {
      return getYear(update.date);
    })
    .filter((value, index, array) => array.indexOf(value) === index);

  const datesByYear = years.map((uniqueYear) => {
    return updates
      .map((update) => {
        if (getYear(update.date) == uniqueYear) {
          return update as ProjectUpdate;
        }
      })
      .filter((item) => item) as ProjectUpdate[];
  });

  return (
    <Card sx={cardStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        {datesByYear.map((updates, index) => {
          const year = getYear(updates[0].date);
          return (
            <Grid container key={index}>
              <YearField year={year} />
              {updates.map(
                (update, i) => update && <UpdateCard key={i} content={update} divider={i !== updates.length - 1} />,
              )}
            </Grid>
          );
        })}
      </CardContent>
    </Card>
  );
};

// Updates Tab Styles
const cardStyles = {
  borderRadius: '24px',
  background: '#FFF',
  position: 'relative',
  zIndex: 0,
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
};

const colorOverlayStyles = {
  width: 320,
  height: '100%',
  borderRadius: 'var(--2, 16px) 0px 0px var(--2, 16px)',
  opacity: 0.6,
  background: 'linear-gradient(90deg, rgba(240, 238, 225, 0.00) 10.42%, #F0EEE1 100%)',
  position: 'absolute',
  zIndex: -1,
};

const cardContentStyles = {
  marginTop: 11,
  marginBottom: 11,
  '&.MuiCardContent-root': {
    padding: 0,
  },
};
