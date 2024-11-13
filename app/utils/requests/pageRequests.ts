import { MainPageData } from '@/common/types';
import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import {
  countFutureEventsForProject,
  getEventsWithAdditionalData,
  getUpcomingEvents,
} from '@/utils/requests/events/requests';
import { getProjects } from '@/utils/requests/project/requests';
import { countUpdatesForProject, getProjectUpdates } from '@/utils/requests/updates/requests';

import { countCollaborationQuestionsForProject } from './collaborationQuestions/requests';
import { countOpportunitiesForProject } from './opportunities/requests';
import { countSurveyQuestionsForProject } from './surveyQuestions/requests';

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
  } as MainPageData;
}

export async function getDataWithFeaturedFiltering() {
  try {
    const projects = (await getProjects()) ?? [];
    const projectUpdates = await getProjectUpdates(10);
    const featuredProjects = projects.filter((project) => project.featured);

    const sliderContent = await Promise.all(
      featuredProjects.map(async (project) => {
        const eventCount = await countFutureEventsForProject({ projectId: project.id });
        const updateCount = await countUpdatesForProject({ projectId: project.id });
        const collaborationQuestionCount = await countCollaborationQuestionsForProject(project.id);
        const opportunityCount = await countOpportunitiesForProject(project.id);
        const surveyQuestionCount = await countSurveyQuestionsForProject(project.id);
        const collaborationActivities =
          (collaborationQuestionCount?.data ?? 0) + (opportunityCount?.data ?? 0) + (surveyQuestionCount?.data ?? 0);

        return {
          ...project,
          description: {
            ...project.description,
            collaborationTags: [
              { Zusammenarbeit: collaborationActivities ?? 0 },
              { News: updateCount.data ?? 0 },
              { Events: eventCount.data ?? 0 },
            ],
          },
        };
      }),
    );
    return {
      sliderContent: sliderContent,
      projects: projects ?? [],
      updates: projectUpdates ?? [],
    };
  } catch (err) {
    const error = strapiError('Getting All featured projects', err as RequestError);
    logger.error(error);
  }
}
