'use client';

import { Event } from '@/common/types';
import { LandingPageSection } from '@/components/landing/LandingPageSection';

import { EventCarousel } from './EventCarousel';

interface EventSectionProps {
  events: Event[];
}

export const EventSection = ({ events }: EventSectionProps) => {
  return (
    <>
      {events.length > 0 && (
        <LandingPageSection id="events" title="Events" subtitle="Aktuelle Events">
          <EventCarousel events={events} />
        </LandingPageSection>
      )}
    </>
  );
};
