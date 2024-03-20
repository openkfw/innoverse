import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { ProjectUpdate } from '@/common/types';
import theme from '@/styles/theme';

import { CommentCard } from '../common/CommentCard';

import { ProjectTimeLineDate } from './ProjectTimeLineDate';
import { YearField } from './YearField';

function getYear(date: string) {
  return new Date(date).getFullYear().toString();
}

interface ProjectTimeLineProps {
  projectUpdates: ProjectUpdate[];
  widthOfDateColumn?: React.CSSProperties['width'];
}

export const ProjectTimeLine = ({ projectUpdates, widthOfDateColumn }: ProjectTimeLineProps) => {
  const getYears = useCallback(() => {
    return (
      projectUpdates
        .map((update) => {
          return getYear(update.date);
        })
        // Remove duplicates
        .filter((value, index, array) => array.indexOf(value) === index)
    );
  }, [projectUpdates]);

  const getUpdatesForYear = useCallback(
    (year: string) => {
      return projectUpdates.filter((item) => getYear(item?.date) == year);
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

  const updatesByYear = getUpdatesByYear();
  return (
    <div>
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
          <CommentCard
            sx={updateCommentCardStyles}
            headerSx={updateCommentCardHeaderStyles}
            content={{ author: update.author, comment: update.comment }}
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
