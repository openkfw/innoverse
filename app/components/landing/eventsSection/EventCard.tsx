import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Event } from '@/common/types';
import { EventEmojiReactionCard } from '@/components/collaboration/emojiReactions/EventEmojiReactionCard';
import EventTimeDate from '@/components/project-details/events/EventTimeDate';
import IcsDownload from '@/components/project-details/events/IcsDownload';
import theme from '@/styles/theme';
dayjs.extend(customParseFormat);

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const date = dayjs(event.startTime, 'YYYY-MM-DDTHH:mm:ss.SSS');

  const defaultImage = '/images/energy_01.png';

  const renderEventType = (event: Event) => {
    switch (event.type) {
      case 'In_office':
        return 'In-office';
      case 'Remote':
        return 'Remote';
      case 'Remote_und_In_office':
        return 'Remote und In-office';
      default:
        return '';
    }
  };

  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={cardHeaderStyles}
        title={
          <Stack direction="row" alignItems="center" justifyContent="start">
            <Stack direction="column">
              <Typography variant="h2" sx={dateStyles}>
                {date.format('DD')}
              </Typography>
              <Typography variant="caption" sx={captionStyles}>
                {date.format('MMM')}
              </Typography>
            </Stack>
            <Stack direction="column" marginLeft="0.5em">
              <EventTimeDate event={event} sx={subtitleStyles} />
              {event.location && (
                <Typography variant="subtitle1" sx={subtitleStyles}>
                  {event.location}
                </Typography>
              )}
              {event.type && (
                <Typography variant="subtitle1" sx={subtitleStyles}>
                  {renderEventType(event)}
                </Typography>
              )}
            </Stack>
            <IcsDownload event={event} />
          </Stack>
        }
      />
      <CardContent sx={cardContentStyles}>
        <Box sx={titleWrapperStyles}>
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
        </Box>
      </CardContent>

      <CardActions sx={cardActionsStyles}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={7} sx={{ marginBottom: '0.5em' }}>
            <Link href={`/projects/${encodeURIComponent(event.projectId)}`} style={linkStyle}>
              <Stack direction="row" alignItems="center">
                <ArrowForwardIcon sx={{ fontSize: '14px', color: 'secondary.main' }} />
                <Typography variant="subtitle2" sx={{ fontSize: '14px' }} noWrap>
                  Mehr Details
                </Typography>
              </Stack>
            </Link>
          </Grid>

          <Grid item xs={12}>
            <EventEmojiReactionCard eventId={event.id} />
          </Grid>
        </Grid>
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
  paddingTop: 0,
  padding: 0,
  margin: 0,
  marginTop: '0.25em',
  textAlign: 'left',
};

const cardActionsStyles = {
  mt: 'auto',
  p: 0,
  pt: 1,
};

const titleWrapperStyles = {
  marginTop: 10 / 8,
  marginBotom: 10 / 8,
};

const titleStyles = {
  minHeight: '60px',
  lineHeight: '1.25',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: 3,
  lineClamp: 3,
  color: 'text.primary',
  fontSize: '16px',
};

const titleImageStyles: React.CSSProperties = {
  marginTop: '1em',
  objectFit: 'cover',
  objectPosition: 'center',
  width: '100%',
  height: '200px',
};

const dateStyles = {
  color: 'primary.main',
  fontSize: '48px',
};

const captionStyles = {
  textTransform: 'uppercase',
  fontSize: '12px',
  textAlign: 'center',
  color: 'text.primary',
};

const subtitleStyles = {
  color: 'text.primary',
  fontSize: '14px',
  lineHeight: '1.5',
  WebkitLineClamp: 1,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const linkStyle = {
  textDecoration: 'none',
};
