import Image from 'next/image';

import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Event } from '@/common/types';
import EventCardHeader from '@/components/landing/eventsSection/EventCardHeader';
import theme from '@/styles/theme';
import { getImageByBreakpoint } from '@/utils/helpers';

interface NewsSurveyCardProps {
  event: Event;
}

function NewsEventCard(props: NewsSurveyCardProps) {
  const { event } = props;

  const defaultImage = '/images/energy_01.png';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const image = getImageByBreakpoint(isSmallScreen, event?.image) || defaultImage;

  return (
    <>
      <CardHeader sx={cardHeaderStyles} title={<EventCardHeader event={event} />} />
      <CardContent sx={cardContentStyles}>
        {!isSmallScreen && (
          <Image width={0} height={0} sizes="50vw" src={image} alt="Event image" style={titleImageStyles} />
        )}

        <Stack>
          <Typography variant="h6" sx={titleStyles}>
            {event.title}
          </Typography>
          <Typography variant="body1" sx={descriptionStyles}>
            {event.description}
          </Typography>
        </Stack>
      </CardContent>
    </>
  );
}

export default NewsEventCard;

// News Survey Card Styles
const cardHeaderStyles = {
  textAlign: 'left',
  padding: 0,
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
  marginBottom: 1,
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

const titleImageStyles: React.CSSProperties = {
  objectFit: 'cover',
  objectPosition: 'center',
  height: 150,
  width: 270,
};
