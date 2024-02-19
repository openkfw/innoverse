'use client';

import { useEffect, useState } from 'react';

import { Event } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import { getUpcomingEvents } from '@/utils/requests';

import { LandingPageSection } from '../LandingPageSection';

import { EventCarousel } from './EventCarousel';

export const EventSection = () => {
  const [events, setEvents] = useState<Event[]>();

  useEffect(function loadEvents() {
    async function loadEvents() {
      const events = await getUpcomingEvents();
      setEvents(events);
    }
    loadEvents();
  }, []);

  return (
    <>
      {events && events.length > 0 && (
        <LandingPageSection
          id="events"
          title="Events"
          subtitle="Aktuelle Events"
          topRightMenu={<CustomButton>Mehr Events</CustomButton>}
        >
          <EventCarousel events={events} />
        </LandingPageSection>
      )}
    </>
  );
};
