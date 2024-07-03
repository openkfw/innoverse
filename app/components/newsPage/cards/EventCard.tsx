import Image from 'next/image';

import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Event } from '@/common/types';
import EventCardHeader from '@/components/landing/eventsSection/EventCardHeader';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getImageByBreakpoint } from '@/utils/helpers';

interface NewsSurveyCardProps {
  event: Event;
}

function NewsEventCard(props: NewsSurveyCardProps) {
  const { event } = props;

  const defaultImage = '/images/energy_01.png';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isWideScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const image = getImageByBreakpoint(isSmallScreen, event?.image) || defaultImage;

  return (
    <>
      <CardHeader sx={cardHeaderStyles} title={<EventCardHeader event={event} />} />
      <Box sx={bodyStyles}>
        <CardMedia sx={cardMediaStyles}>
          <Image
            src={image}
            width={280}
            height={0}
            alt={m.components_newsPage_cards_eventCard_imageAlt()}
            style={{
              objectFit: 'cover',
              width: isWideScreen ? 270 : '100%',
              height: isWideScreen ? 132 : 177,
            }}
          />
        </CardMedia>
        <CardContent sx={cardContentStyles}>
          <Typography variant="h6" sx={titleStyles}>
            {event.title}
          </Typography>
          <Typography variant="body1" sx={descriptionStyles}>
            {event.description}
          </Typography>
        </CardContent>
      </Box>
    </>
  );
}

export default NewsEventCard;

const cardMediaStyles = {
  [theme.breakpoints.down('sm')]: {
    height: '100%',
    width: '100%',
  },
};

// News Survey Card Styles
const cardHeaderStyles = {
  textAlign: 'left',
  padding: 0,
};

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
  padding: 0,
  marginTop: '12px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 3,
};

const titleStyles = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  width: 'fit-content',
  color: 'text.primary',
  fontSize: '16px',
};

const descriptionStyles = {
  minHeight: '75px',
  color: 'text.primary',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: 5,
  lineClamp: 5,
};
