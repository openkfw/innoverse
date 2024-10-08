import Image from 'next/image';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { EventWithAdditionalData, ObjectType } from '@/common/types';
import EventEmojiReactionCard from '@/components/collaboration/emojiReactions/cards/EventEmojiReactionCard';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { getImageByBreakpoint } from '../../../utils/helpers';
import { LinkWithArrowLeft } from '../../common/LinkWithArrowLeft';

import EventCardHeader from './EventCardHeader';

interface EventCardProps {
  event: EventWithAdditionalData;
}

export const EventCard = ({ event }: EventCardProps) => {
  const defaultImage = '/images/energy_01.png';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const image = getImageByBreakpoint(isSmallScreen, event?.image) || defaultImage;

  return (
    <Card sx={cardStyles}>
      <CardHeader sx={cardHeaderStyles} title={<EventCardHeader event={event} />} />
      <CardContent sx={cardContentStyles}>
        <Stack spacing="12px">
          <Typography variant="h6" sx={titleStyles}>
            {event.title}
          </Typography>
          <Image
            width={0}
            height={0}
            sizes="50vw"
            src={image}
            alt={m.components_landing_eventsSection_eventCard_imageAlt()}
            style={titleImageStyles}
          />
        </Stack>
      </CardContent>

      <CardActions sx={cardActionsStyles}>
        <Stack direction="column">
          <LinkWithArrowLeft
            title={m.components_landing_eventsSection_eventCard_moreDetails()}
            href={`/projects/${encodeURIComponent(event.projectId)}?tab=3`}
          />
          <EventEmojiReactionCard item={event} type={ObjectType.EVENT} />
        </Stack>
      </CardActions>
    </Card>
  );
};

// News Card Styles
const cardStyles = {
  paddingX: 3,
  paddingY: 4,
  borderRadius: '8px',
  marginRight: 3,
  paddingRight: 3,
  height: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '368px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
  display: 'flex',
  flexDirection: 'column',
};

const cardHeaderStyles = {
  textAlign: 'left',
  padding: 0,
};

const cardContentStyles = {
  padding: 0,
  marginTop: '12px',
};

const cardActionsStyles = {
  mt: '12px',
  p: 0,
};

const titleStyles = {
  minHeight: '75px',
  color: 'text.primary',
  fontFamily: 'SansHeadingsMed',
  fontSize: '17px',
  fontWeight: 900,
  lineHeight: '140%',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: 3,
  lineClamp: 3,
};

const titleImageStyles: React.CSSProperties = {
  objectFit: 'cover',
  objectPosition: 'center',
  width: '100%',
  height: '200px',
};
