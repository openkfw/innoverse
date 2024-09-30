'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { Project } from '@/common/types';
import ContinueIcon from '@/components/icons/ContinueIcon';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { parseStringForLinks } from '../common/LinkString';
import ProgressBar from '../common/ProgressBar';

interface TimingDataProps {
  project: Project;
}

const ProjectStageCard = (props: TimingDataProps) => {
  const { project } = props;
  const { filters } = useNewsFeed();
  const { searchString } = filters;

  function readMore() {
    const newUrl = `${window.location.pathname}?tab=0`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    setTimeout(() => {
      const scroll = () => {
        const section = document.getElementById('project-progress-tab')?.offsetTop;
        if (section) {
          window.scrollTo({
            top: section,
            behavior: 'smooth',
          });
        }
      };

      scroll();
    }, 100);
  }

  return (
    <>
      <Typography variant="overline" sx={titleStyles}>
        {m.components_projectdetails_projectStageCard_infoStatus()}
      </Typography>
      <Card sx={{ height: project?.team?.length > 2 ? '209px' : 'fit-content', ...cardStyles }} elevation={0}>
        <CardContent sx={cardContentStyles}>
          <ProgressBar active={project.status} />
          <Stack sx={descriptionWrapperStyles}>
            <Typography variant="body1" sx={descriptionStyles}>
              {parseStringForLinks(project.summary, searchString)}
            </Typography>
            <Button onClick={readMore} sx={buttonStyles} startIcon={<ContinueIcon />}>
              <Typography variant="button" sx={buttonTextStyles}>
                {m.components_projectdetails_projectStageCard_readMore()}
              </Typography>
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default ProjectStageCard;

// Project stage card Styles
const titleStyles = {
  textAlign: 'center',
  color: 'primary.light',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
};

const cardStyles = {
  border: '1px solid rgba(0, 90, 140, 0.10)',
  background: 'rgba(240, 238, 225, 0.10)',
  borderRadius: '8px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  mt: 2,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '411px',
  },
};

const cardContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const descriptionWrapperStyles = {
  flex: 1,
  marginTop: 2,
};

const descriptionStyles = {
  color: 'text.primary',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  flexGrow: 1,
  [theme.breakpoints.down('md')]: {
    WebkitLineClamp: 10,
  },
};

const buttonStyles = {
  marginTop: 2,
  background: 'none',
  display: 'flex',

  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px 18px',
  borderRadius: '48px',
  border: '1px solid rgba(0, 0, 0, 0.10)',
  backdropFilter: 'blur(24px)',
  maxWidth: 'fit-content',

  '&:hover': {
    border: '1px solid rgba(255, 255, 255, 0.40)',
  },
};

const buttonTextStyles = {
  color: 'rgba(0, 0, 0, 0.56)',
};
