import { MainPageData } from '@/common/types';
import { RequestError } from '@/entities/error';
import getLogger from '@/utils/logger';

import { strapiError } from '../errors';

import { getCountsForProject, getMainData } from './requests';

const logger = getLogger();

export async function getMainPageData() {
  try {
    const { futureEvents, updates, projects, featuredProjects } = await getMainData();

    const sliderContent = await Promise.all(
      featuredProjects.map(async (project) => {
        const { eventCount, updateCount, collaborationQuestionCount, opportunityCount, surveyQuestionCount } =
          await getCountsForProject(project.id);
        const collaborationActivities = collaborationQuestionCount + opportunityCount + surveyQuestionCount;

        return {
          ...project,
          description: {
            ...project.description,
            collaborationTags: [
              { Zusammenarbeit: collaborationActivities ?? 0 },
              { News: updateCount },
              { Events: eventCount },
            ],
          },
        };
      }),
    );

    return {
      projects,
      sliderContent,
      updates,
      events: futureEvents,
      featuredProjects,
    } as MainPageData;
  } catch (err) {
    const error = strapiError('Getting All featured projects', err as RequestError);
    logger.error(error);
    throw err;
  }
}
