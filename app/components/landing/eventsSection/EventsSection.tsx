'use client';

import { useEffect, useState } from 'react';

import { Event } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';

import { LandingPageSection } from '../LandingPageSection';

import { getUpcomingEvents } from './actions';
import { EventCarousel } from './EventCarousel';

export const EventSection = () => {
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await getUpcomingEvents();
        setEvents(response.data);
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
