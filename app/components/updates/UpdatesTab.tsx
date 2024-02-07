import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

import { ProjectUpdate } from '@/common/types';

import { getProjectUpdates } from './actions';
import { AddUpdateCard } from './AddUpdateCard';
import { UpdateCard } from './UpdateCard';
import { YearField } from './YearField';

interface UpdatesTabProps {
  projectId: string;
}

function getYear(date: string) {
  return new Date(date).getFullYear().toString();
}

export const UpdatesTab = (props: UpdatesTabProps) => {
  const { projectId } = props;
  const [updateAdded, setUpdateAdded] = useState<boolean>(false);
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([]);

  const getYears = useCallback(() => {
    return projectUpdates
      .map((update) => {
        return getYear(update.date);
      })
      .filter((value, index, array) => array.indexOf(value) === index);
  }, [projectUpdates]);

  const getDatesByYear = useCallback(
    () =>
      getYears().map((uniqueYear) => {
        return projectUpdates
          .map((update) => {
            if (getYear(update.date) == uniqueYear) {
              return update as ProjectUpdate;
            }
          })
          .filter((item) => item) as ProjectUpdate[];
      }),
    [getYears()],
  );

  useEffect(() => {
    const refetchUpdates = async () => {
      const { data } = await getProjectUpdates({ projectId });
      if (data) {
        setProjectUpdates([...data]);
      }
    };
    if (updateAdded) {
      refetchUpdates();
    }
  }, [updateAdded]);

  useEffect(() => {
    const fetchUpdates = async () => {
      const { data } = await getProjectUpdates({ projectId });
      if (data) {
        setProjectUpdates([...data]);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <Card sx={cardStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        <Grid container>
          <Grid container item xs={8}>
            {getDatesByYear().map((updates, index) => {
              const year = getYear(updates[0].date);
              return (
                <Grid container key={index}>
                  <YearField year={year} />
                  {projectUpdates.map(
                    (update, i) => update && <UpdateCard key={i} content={update} divider={i !== updates.length - 1} />,
                  )}
                </Grid>
              );
            })}
          </Grid>
          <AddUpdateCard projectId={projectId} setUpdateAdded={setUpdateAdded} />
        </Grid>
      </CardContent>
    </Card>
  );
};

// Updates Tab Styles
const cardStyles = {
  borderRadius: '24px',
  background: 'common.white',
  position: 'relative',
  zIndex: 0,
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
};

const colorOverlayStyles = {
  width: 354,
  height: '100%',
  borderRadius: 'var(--2, 16px) 0px 0px var(--2, 16px)',
  opacity: 0.6,
  background: 'linear-gradient(90deg, rgba(240, 238, 225, 0.00) 10.42%, #F0EEE1 100%)',
  position: 'absolute',
  zIndex: -1,
};

const cardContentStyles = {
  my: 11,
  mx: 6,
  '&.MuiCardContent-root': {
    padding: 0,
  },
};
