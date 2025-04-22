import Image from 'next/image';

import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Event, NewsFeedEntry } from '@/common/types';
import EventCardHeader from '@/components/landing/eventsSection/EventCardHeader';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getImageByBreakpoint } from '@/utils/helpers';
import { HighlightText } from '@/utils/highlightText';

import { NewsCardActions } from './common/NewsCardActions';

interface NewsEventCardProps {
  entry: NewsFeedEntry;
}

function NewsEventCard(props: NewsEventCardProps) {
  const { entry } = props;
  const event = entry.item as Event;

  const defaultImage = '/public/images/energy_01.png';
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
            <HighlightText text={event.title} />
          </Typography>
          <Typography variant="body1" sx={descriptionStyles} data-testid="text">
            <HighlightText text={event.description} />
          </Typography>
        </CardContent>
      </Box>
      <NewsCardActions entry={entry} />
    </>
  );
}

export default NewsEventCard;

// News Survey Card Styles
const cardMediaStyles = {
  [theme.breakpoints.down('sm')]: {
    height: '100%',
    width: '100%',
  },
};

const cardHeaderStyles = {
  textAlign: 'left',
  padding: 0,
  mb: 1.5,
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
  margin: 0,
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  alignItems: 'flex-start',
  wordBreak: 'break-word',
};

const titleStyles = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  width: 'fit-content',
  color: 'text.primary',
  fontSize: 16,
  fontStyle: 'normal',
  fontWeight: 900,
  lineHeight: '140%',
  letterSpacing: -0.5,
};

const descriptionStyles = {
  minHeight: '75px',
  color: 'text.primary',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: 3,
};
