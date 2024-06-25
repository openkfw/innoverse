'use client';

import { EventWithAdditionalData } from '@/common/types';
import { LandingPageSection } from '@/components/landing/LandingPageSection';
import * as m from '@/src/paraglide/messages.js';

import { EventCarousel } from './EventCarousel';

interface EventSectionProps {
  events: EventWithAdditionalData[];
}

export const EventSection = ({ events }: EventSectionProps) => {
  return (
    <>
      {events.length > 0 && (
        <LandingPageSection
          id="events"
          title={m.components_landing_eventsSection_eventsSection_events()}
          subtitle={m.components_landing_eventsSection_eventsSection_currentEvents()}
        >
          <EventCarousel events={events} />
        </LandingPageSection>
      )}
    </>
  );
};
