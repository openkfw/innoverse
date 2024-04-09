import { EventWithAdditionalData } from '@/common/types';

import Carousel from '../Carousel';

import { EventCard } from './EventCard';

interface EventCarouselProps {
  events: EventWithAdditionalData[];
}

export const EventCarousel = ({ events }: EventCarouselProps) => {
  return (
    <Carousel
      items={events}
      renderItem={(event) => <EventCard key={event.id} event={event} />}
      sliderSettings={{
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 1,
      }}
      sx={{ zIndex: 2, minHeight: '504px' }}
    />
  );
};
