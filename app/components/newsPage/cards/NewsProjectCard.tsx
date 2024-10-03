import Image from 'next/image';
import Link from 'next/link';

import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Project } from '@/common/types';
import ProgressBar from '@/components/common/ProgressBar';
import { defaultImage } from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import VisibleContributors from '@/components/project-details/VisibleContributors';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getImageByBreakpoint } from '@/utils/helpers';
import { HighlightText } from '@/utils/highlightText';

import CommentOverview from './common/CommentOverview';

interface NewsProjectCardProps {
  project: Project;
}

function NewsProjectCard(props: NewsProjectCardProps) {
  const { project } = props;

  const isWideScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const image = getImageByBreakpoint(!isWideScreen, project.image) || defaultImage;

  if (project?.comments?.length > 0) {
    return (
      <>
        <CommentOverview title={project.title} description={project.summary} image={image} />
      </>
    );
  }

  return (
    <>
      <Box sx={bodyStyles}>
        <CardMedia sx={cardMediaStyles}>
          <Image
            src={image}
            width={280}
            height={0}
            alt={m.components_newsPage_cards_projectCard_imageAlt()}
            style={{
              objectFit: 'cover',
              width: isWideScreen ? 270 : '100%',
              height: isWideScreen ? 132 : 177,
            }}
          />
          <Box sx={progressBarMobileStyles}>
            <ProgressBar active={project.status} />
          </Box>
        </CardMedia>

        <CardContent sx={cardContentStyles}>
          <VisibleContributors contributors={project.team} />
          <Typography variant="h5" sx={titleStyles}>
            <Link href={`/projects/${encodeURIComponent(project.id)}`} style={linkStyles}>
              <HighlightText text={project.title} />
            </Link>
          </Typography>
          <Typography
            variant="body1"
            sx={{ ...descriptionStyles, WebkitLineClamp: isWideScreen ? 4 : 6 }}
            data-testid="text"
          >
            <HighlightText text={project.summary} />
          </Typography>
        </CardContent>
      </Box>
      <Box sx={progressBarStyles}>
        <ProgressBar active={project.status} />
      </Box>
    </>
  );
}

export default NewsProjectCard;

const cardMediaStyles = {
  [theme.breakpoints.down('sm')]: {
    height: '100%',
    width: '100%',
  },
};

// News Project Card Styles
const bodyStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  columnGap: 3,
  margin: 0,
  padding: 0,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
};

const cardContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  margin: 0,
  padding: '0 !important',
  wordBreak: 'break-word',

  [theme.breakpoints.down('sm')]: {
    marginTop: 1,
  },
};

const titleStyles = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  width: 'fit-content',
  color: 'text.primary',
  fontSize: '20px',
  mb: 1,

  [theme.breakpoints.down('sm')]: {
    margin: '8px 0',
  },
};

const linkStyles = {
  textDecoration: 'none',
  cursor: 'pointer',
  color: 'inherit',
};

const descriptionStyles = {
  color: 'secondary.contrastText',
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
};

const progressBarStyles = {
  marginTop: 1.5,

  [theme.breakpoints.up('sm')]: {
    visibility: 'hidden',
    marginTop: -5,
  },
};

const progressBarMobileStyles = {
  marginTop: 1.5,

  [theme.breakpoints.down('sm')]: {
    visibility: 'hidden',
    marginTop: -5,
  },
};
