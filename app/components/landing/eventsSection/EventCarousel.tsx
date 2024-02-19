import { Event } from '@/common/types';

import Carousel from '../Carousel';

import { EventCard } from './EventCard';

interface EventCarouselProps {
  events: Event[];
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
    />
  );
};
