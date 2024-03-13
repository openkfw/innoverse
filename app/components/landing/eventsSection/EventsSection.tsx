'use client';

import { useEffect, useState } from 'react';

import { Event } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { getUpcomingEvents } from '@/utils/requests';

import { LandingPageSection } from '../LandingPageSection';

import { EventCarousel } from './EventCarousel';

export const EventSection = () => {
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getUpcomingEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
        errorMessage({ message: 'Failed to load events. Please try again later.' });
      }
    }
    fetchEvents();
  }, []);

  return (
    <>
      {events && events.length > 0 && (
        <LandingPageSection id="events" title="Events" subtitle="Aktuelle Events">
          <EventCarousel events={events} />
        </LandingPageSection>
      )}
    </>
  );
};
