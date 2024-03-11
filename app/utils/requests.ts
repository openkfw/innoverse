import { SurveyVote } from '@prisma/client';
import dayjs from 'dayjs';

import {
  CollaborationQuestion,
  Filters,
  Project,
  ProjectByIdQueryResult,
  ProjectQuestion,
  ProjectsQueryResult,
  ProjectUpdate,
  SurveyQuestion,
  User,
  UserSession,
} from '@/common/types';
import { getSurveyQuestionVotes } from '@/components/collaboration/survey/actions';
import { AddUpdateFormData } from '@/components/newsPage/addUpdate/form/AddUpdateForm';
import { SortValues } from '@/components/newsPage/News';

import { InnoPlatformError, strapiError } from './errors';
import { getFulfilledResults } from './helpers';
import logger from './logger';
import {
  CreateInnoUserQuery,
  CreateProjectUpdateQuery,
  GetCollaborationQuestionsByProjectIdQuery,
  GetEventsQuery,
  GetInnoUserByEmailQuery,
  GetInnoUserByProviderIdQuery,
  GetOpportunitiesByIdQuery,
  GetOpportunitiesByProjectIdQuery,
  GetOpportunityParticipantQuery,
  GetProjectByIdQuery,
  GetProjectsQuery,
  GetQuestionsByProjectIdQuery,
  GetSurveyQuestionsByProjectIdQuery,
  GetUpdatesByProjectIdQuery,
  GetUpdatesFilterQuery,
  GetUpdatesQuery,
  STRAPI_QUERY,
  UpdateOpportunityParticipantsQuery,
  withResponseTransformer,
} from './queries';
import strapiFetcher from './strapiFetcher';

async function uploadImage(imageUrl: string, fileName: string) {
  return fetch(imageUrl)
    .then((response) => response.blob())
    .then(async function (myBlob) {
      const formData = new FormData();
      formData.append('files', myBlob, fileName);
      formData.append('ref', 'api::event.event');
      formData.append('field', 'image');

      return fetch(`${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          return result;
        });
    });
}

export async function createInnoUser(body: UserSession, image?: string | null) {
  try {
    const uploadedImages = image ? await uploadImage(image, `avatar-${body.name}`) : null;
    const uploadedImage = uploadedImages ? uploadedImages[0] : null;

    const requestUser = await strapiFetcher(CreateInnoUserQuery, {
      ...body,
      avatarId: uploadedImage ? uploadedImage.id : null,
    });
    const resultUser = await withResponseTransformer(STRAPI_QUERY.CreateInnoUser, requestUser);

    return resultUser;
  } catch (err) {
    const error = strapiError('Create Inno User', err as Error, body.name);
    logger.error(error);
  }
}

export async function getProjectById(id: string) {
  try {
    const requestProject = await strapiFetcher(GetProjectByIdQuery, { id });
    const resultProject = (await withResponseTransformer(
      STRAPI_QUERY.GetProjectById,
      requestProject,
    )) as ProjectByIdQueryResult;

    return {
      ...resultProject.project,
    };
  } catch (err) {
    const e: InnoPlatformError = strapiError('Getting Project by ID', err as Error, id);
    logger.error(e);
  }
}

export async function getInnoUserByEmail(email: string) {
  try {
    const requestUser = await strapiFetcher(GetInnoUserByEmailQuery, { email });
    const resultUser = await withResponseTransformer(STRAPI_QUERY.GetInnoUser, requestUser);

    return resultUser;
  } catch (err) {
    const error = strapiError('Getting Inno user by email', err as Error, email);
    logger.error(error);
  }
}

export async function getInnoUserByProviderId(providerId: string) {
  try {
    const requestUser = await strapiFetcher(GetInnoUserByProviderIdQuery, { providerId });
    const resultUser = (await withResponseTransformer(STRAPI_QUERY.GetInnoUser, requestUser)) as unknown as User;
    return resultUser;
  } catch (err) {
    const error = strapiError('Getting Inno user by providerId', err as Error, providerId);
    logger.error(error);
  }
}

export async function getUpcomingEvents() {
  try {
    const today = new Date();
    const todayString = dayjs(today).format('YYYY-MM-DD');
    const requestEvents = await strapiFetcher(GetEventsQuery, { today: todayString });
    const events = await withResponseTransformer(STRAPI_QUERY.GetEvents, requestEvents);
    return events;
  } catch (err) {
    const error = strapiError('Getting upcoming events', err as Error);
    logger.error(error);
  }
}

// As this is used in the "Main" Page no ISR here. Fetch data from Endpoint via fetch
// Revalidate the cache every 2 mins.
// Use fetch here as we want to revalidate the data from the CMS.
export async function getFeaturedProjects() {
  try {
    const requestProjects = await strapiFetcher(GetProjectsQuery);
    const result = (await withResponseTransformer(STRAPI_QUERY.GetProjects, requestProjects)) as ProjectsQueryResult;

    // Filter projects which are featured
    const featuredProjects = result.projects.filter((project: Project) => project.featured == true) as Project[];

    return {
      sliderContent: featuredProjects,
      projects: result.projects,
      updates: result.updates,
    };
  } catch (err) {
    const error = strapiError('Getting All featured projects', err as Error);
    logger.error(error);
  }
}

export async function getProjects() {
  try {
    const requestProjects = await strapiFetcher(GetProjectsQuery);
    const result = (await withResponseTransformer(STRAPI_QUERY.GetProjects, requestProjects)) as ProjectsQueryResult;

    return result.projects;
  } catch (err) {
    console.info(err);
  }
}

export async function getProjectsUpdates() {
  try {
    const requestProjects = await strapiFetcher(GetUpdatesQuery);
    const result = await withResponseTransformer(STRAPI_QUERY.GetUpdates, requestProjects);
    return result;
  } catch (err) {
    const error = strapiError('Getting all project updates', err as Error);
    logger.error(error);
  }
}

export async function getProjectsUpdatesFilter(sort: SortValues, filters: Filters, page?: number, pageSize?: number) {
  try {
    const { projects, topics } = filters;
    const variables = {
      projects,
      topics,
      page,
      pageSize,
    };

    let filter = '';
    let filterParams = '';

    // Concat the filter strings (passed to Strapi query) based on the current filters
    if (projects.length && topics.length) {
      filterParams += '$projects: [String], $topics: [String]';
      filter += 'filters: { project: { title: { in: $projects } }, and: { topic: { in: $topics } }} ';
    } else if (projects.length) {
      filterParams += '$projects: [String]';
      filter += 'filters: { project: { title: { in: $projects } }} ';
    } else if (topics.length) {
      filterParams += '$topics: [String]';
      filter += 'filters: { topic: { in: $topics }} ';
    }
    filterParams += '$page: Int, $pageSize: Int';
    filter += 'pagination: { page: $page, pageSize: $pageSize }';

    if (filterParams.length) {
      filterParams = `(${filterParams})`;
    }

    const requestProjects = await strapiFetcher(GetUpdatesFilterQuery(filterParams, filter, sort), variables);
    const result = await withResponseTransformer(STRAPI_QUERY.GetUpdates, requestProjects);
    return result;
  } catch (err) {
    const error = strapiError('Getting all project updates with filter', err as Error);
    logger.error(error);
  }
}

export async function getUpdatesByProjectId(projectId: string) {
  try {
    const res = await strapiFetcher(GetUpdatesByProjectIdQuery, { projectId });
    const updates = await withResponseTransformer(STRAPI_QUERY.GetUpdatesByProjectId, res);
    return updates as ProjectUpdate[];
  } catch (err) {
    const error = strapiError('Getting all project updates', err as Error, projectId);
    logger.error(error);
  }
}

export async function getOpportunitiesByProjectId(projectId: string) {
  try {
    const res = await strapiFetcher(GetOpportunitiesByProjectIdQuery, { projectId });
    const opportunities = await withResponseTransformer(STRAPI_QUERY.GetOpportunitiesByProjectId, res);
    return opportunities;
  } catch (err) {
    const error = strapiError('Getting project opportunities by project id', err as Error, projectId);
    logger.error(error);
  }
}

export async function getOpportunityById(projectId: string) {
  try {
    const res = await strapiFetcher(GetOpportunitiesByIdQuery, { projectId });
    const opportunities = await withResponseTransformer(STRAPI_QUERY.GetOpportunitiesId, res);
    return opportunities[0];
  } catch (err) {
    const error = strapiError('Getting all project opportunities', err as Error, projectId);
    logger.error(error);
  }
}

export async function getProjectQuestionsByProjectId(projectId: string) {
  try {
    const res = await strapiFetcher(GetQuestionsByProjectIdQuery, { projectId });
    const questions = await withResponseTransformer(STRAPI_QUERY.GetProjectQuestionsByProjectId, res);
    return questions as ProjectQuestion[];
  } catch (err) {
    const error = strapiError('Getting all project questions', err as Error, projectId);
    logger.error(error);
  }
}

export async function getSurveyQuestionsByProjectId(projectId: string) {
  try {
    const res = await strapiFetcher(GetSurveyQuestionsByProjectIdQuery, { projectId });
    const surveyQuestions = (await withResponseTransformer(
      STRAPI_QUERY.GetSurveyQuestionsByProjectId,
      res,
    )) as SurveyQuestion[];

    const surveyQuestionsVotes = await Promise.allSettled(
      surveyQuestions.map(async (surveyQuestion) => {
        const { data: surveyVotes } = await getSurveyQuestionVotes({ surveyQuestionId: surveyQuestion.id });
        surveyQuestion.votes = surveyVotes?.map((vote) => ({ votedBy: vote.votedBy?.id }) as SurveyVote) ?? [];
        return surveyQuestion;
      }),
    ).then((results) => getFulfilledResults(results));

    return surveyQuestionsVotes as SurveyQuestion[];
  } catch (err) {
    const error = strapiError('Getting all survey questions', err as Error, projectId);
    logger.error(error);
  }
}

export async function getCollaborationQuestionsByProjectId(projectId: string) {
  try {
    const res = await strapiFetcher(GetCollaborationQuestionsByProjectIdQuery, { projectId });
    const collaborationQuestions = await withResponseTransformer(
      STRAPI_QUERY.GetCollaborationQuestionsByProjectId,
      res,
    );
    return collaborationQuestions as CollaborationQuestion[];
  } catch (err) {
    const error = strapiError('Getting all collaboration questions', err as Error, projectId);
    logger.error(error);
  }
}

export async function createInnoUserIfNotExist(body: UserSession, image?: string | null) {
  try {
    if (body.email) {
      const user = await getInnoUserByEmail(body.email);
      return user ? user : await createInnoUser(body, image);
    }
  } catch (err) {
    const error = strapiError('Trying to create a InnoUser if it does not exist', err as Error, body.name);
    logger.error(error);
  }
}

export async function createProjectUpdate(body: Omit<AddUpdateFormData, 'author'>) {
  try {
    const requestUpdate = await strapiFetcher(CreateProjectUpdateQuery, body);
    const resultUpdate = await withResponseTransformer(STRAPI_QUERY.CreateProjectUpdate, requestUpdate);
    return resultUpdate;
  } catch (err) {
    const error = strapiError('Trying to to create project update', err as Error, body.projectId);
    logger.error(error);
  }
}

export async function getOpportunityAndUserParticipant(body: { opportunityId: string; userId: string }) {
  try {
    const requestGet = await strapiFetcher(GetOpportunityParticipantQuery, body);
    const resultGet = await withResponseTransformer(STRAPI_QUERY.GetOpportunityParticipant, requestGet);
    return resultGet;
  } catch (err) {
    const error = strapiError(
      'Trying to get project opportunity and add participant',
      err as Error,
      body.opportunityId,
    );
    logger.error(error);
  }
}

export async function handleOpportunityAppliedBy(body: { opportunityId: string; userId: string }) {
  try {
    const requestGet = await strapiFetcher(UpdateOpportunityParticipantsQuery, body);
    const resultGet = await withResponseTransformer(STRAPI_QUERY.UpdateOpportunityParticipants, requestGet);
    return resultGet;
  } catch (err) {
    const error = strapiError(
      'Trying to get uodate project opportunity participants',
      err as Error,
      body.opportunityId,
    );
    logger.error(error);
  }
}
