import Image from 'next/image';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { EventWithAdditionalData } from '@/common/types';
import EventEmojiReactionCard from '@/components/collaboration/emojiReactions/EventEmojiReactionCard';
import theme from '@/styles/theme';

import { LinkWithArrowLeft } from '../../common/LinkWithArrowLeft';

import EventCardHeader from './EventCardHeader';

interface EventCardProps {
  event: EventWithAdditionalData;
}

export const EventCard = ({ event }: EventCardProps) => {
  const defaultImage = '/images/energy_01.png';

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
            src={event.image ?? defaultImage}
            alt="Event image"
            style={titleImageStyles}
          />
        </Stack>
      </CardContent>

      <CardActions sx={cardActionsStyles}>
        <Stack direction="column">
          <LinkWithArrowLeft title="Mehr Details" href={`/projects/${encodeURIComponent(event.projectId)}?tab=3`} />
          <EventEmojiReactionCard event={event} />
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
  fontFamily: 'PFCentroSansProMed',
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
