import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { ProjectUpdate } from '@/common/types';
import theme from '@/styles/theme';

import { TextCard } from '../common/TextCard';

import { ProjectTimeLineDate } from './ProjectTimeLineDate';
import { YearField } from './YearField';

function getYear(date: string) {
  return new Date(date).getFullYear().toString();
}

interface ProjectTimeLineProps {
  projectUpdates: ProjectUpdate[];
  widthOfDateColumn?: React.CSSProperties['width'];
}

interface useProjectTimeLineProps {
  projectUpdates: ProjectUpdate[];
}

export const ProjectTimeLine = ({ projectUpdates, widthOfDateColumn }: ProjectTimeLineProps) => {
  const { updatesByYear } = useProjectTimeLine({ projectUpdates });

  return (
    <div style={{ width: '100%' }}>
      {updatesByYear.map(({ year, updates }, idx) => {
        const isLastYear = idx === updatesByYear.length - 1;
        return (
          <ProjectYearTimeline
            widthOfDateColumn={widthOfDateColumn}
            key={idx}
            year={year}
            projectUpdates={updates}
            isLastYear={isLastYear}
          />
        );
      })}
    </div>
  );
};

function useProjectTimeLine({ projectUpdates }: useProjectTimeLineProps) {
  const getYears = useCallback(() => {
    return (
      projectUpdates
        .map((update) => {
          return getYear(update.updatedAt);
        })
        // Remove duplicates
        .filter((value, index, array) => array.indexOf(value) === index)
    );
  }, [projectUpdates]);

  const getUpdatesForYear = useCallback(
    (year: string) => {
      return projectUpdates.filter((item) => getYear(item?.updatedAt) == year);
    },
    [projectUpdates],
  );

  const getUpdatesByYear = useCallback(
    () =>
      getYears().map((uniqueYear) => ({
        year: uniqueYear,
        updates: getUpdatesForYear(uniqueYear),
      })),
    [getYears, getUpdatesForYear],
  );

  return {
    updatesByYear: getUpdatesByYear(),
  };
}

interface ProjectYearTimelineProps {
  year: string;
  projectUpdates: ProjectUpdate[];
  isLastYear: boolean;
  widthOfDateColumn?: React.CSSProperties['width'];
}

const ProjectYearTimeline = ({ year, projectUpdates, isLastYear, widthOfDateColumn }: ProjectYearTimelineProps) => {
  return (
    <Box>
      <YearField sx={yearFieldStyles} year={year} />
      {projectUpdates.map((update, idx) => (
        <Stack key={idx} direction={'row'}>
          <Box sx={{ width: '100%', maxWidth: widthOfDateColumn }} flexShrink={0}>
            <ProjectTimeLineDate
              sx={timeLineDateStyles}
              update={update}
              showDivider={!isLastYear || idx < projectUpdates.length - 1}
            />
          </Box>
          <TextCard
            sx={updateCommentCardStyles}
            headerSx={updateCommentCardHeaderStyles}
            content={{ author: update.author, text: update.comment }}
          />
        </Stack>
      ))}
    </Box>
  );
};

const yearFieldStyles: SxProps = {
  maxWidth: '172px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '75px',
  },
};

const timeLineDateStyles: SxProps = {
  maxWidth: '172px',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: '75px',
  },
};

const updateCommentCardStyles: SxProps = {
  marginBottom: '68px',
  [theme.breakpoints.down('md')]: {
    marginBottom: '13px',
  },
};

const updateCommentCardHeaderStyles: SxProps = {
  paddingTop: 1.5,
  [theme.breakpoints.down('md')]: {
    paddingTop: '2px',
    paddingBottom: 0,
  },
};
