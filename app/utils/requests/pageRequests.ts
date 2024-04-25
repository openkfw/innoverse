import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getEventsWithAdditionalData, getUpcomingEvents } from '@/utils/requests/events/requests';
import { getProjects } from '@/utils/requests/project/requests';
import { getProjectUpdates } from '@/utils/requests/updates/requests';

const logger = getLogger();

export async function getMainPageData() {
  const events = (await getUpcomingEvents()) ?? [];
  const data = await getDataWithFeaturedFiltering();
  const eventsWithAdditionalData = await getEventsWithAdditionalData(events);

  return {
    projects: data?.projects,
    sliderContent: data?.sliderContent,
    updates: data?.updates ?? [],
    events: eventsWithAdditionalData,
  };
}

export async function getDataWithFeaturedFiltering() {
  try {
    const projects = (await getProjects()) ?? [];
    const projectUpdates = await getProjectUpdates(10);
    const featuredProjects = projects.filter((project) => project.featured);

    return {
      sliderContent: featuredProjects,
      projects: projects ?? [],
      updates: projectUpdates ?? [],
    };
  } catch (err) {
    const error = strapiError('Getting All featured projects', err as Error);
    logger.error(error);
  }
}
