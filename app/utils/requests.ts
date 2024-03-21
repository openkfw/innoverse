'use server';
import { SurveyVote } from '@prisma/client';
import dayjs from 'dayjs';

import { Filters, UserSession, Event } from '@/common/types';
import { getSurveyQuestionVotes } from '@/components/collaboration/survey/actions';
import { AddUpdateFormData } from '@/components/newsPage/addUpdate/form/AddUpdateForm';
import { SortValues } from '@/components/newsPage/News';

import { InnoPlatformError, strapiError } from './errors';
import { getPromiseResults } from './helpers';
import logger from './logger';
import {
  CreateInnoUserQuery,
  CreateProjectUpdateQuery,
  GetAllEventsFilterQuery,
  GetCollaborationQuestionsByProjectIdQuery,
  GetFutureEventCountQuery,
  GetInnoUserByEmailQuery,
  GetInnoUserByProviderIdQuery,
  GetOpportunitiesByIdQuery,
  GetOpportunitiesByProjectIdQuery,
  GetOpportunityParticipantQuery,
  GetProjectByIdQuery,
  GetProjectsQuery,
  GetQuestionsByProjectIdQuery,
  GetSurveyQuestionsByProjectIdQuery,
  GetUpcomingEventsQuery,
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

    const response = await strapiFetcher(CreateInnoUserQuery, {
      ...body,
      avatarId: uploadedImage ? uploadedImage.id : null,
    });
    const resultUser = await withResponseTransformer(STRAPI_QUERY.CreateInnoUser, response);

    return resultUser;
  } catch (err) {
    const error = strapiError('Create Inno User', err as Error, body.name);
    logger.error(error);
  }
}

export async function getProjectById(id: string) {
  try {
    const response = await strapiFetcher(GetProjectByIdQuery, { id });
    const project = await withResponseTransformer(STRAPI_QUERY.GetProjectById, response);
    return project;
  } catch (err) {
    const e: InnoPlatformError = strapiError('Getting Project by ID', err as Error, id);
    logger.error(e);
  }
}

export async function getInnoUserByEmail(email: string) {
  try {
    const response = await strapiFetcher(GetInnoUserByEmailQuery, { email });
    const user = await withResponseTransformer(STRAPI_QUERY.GetInnoUser, response);
    return user;
  } catch (err) {
    const error = strapiError('Getting Inno user by email', err as Error, email);
    logger.error(error);
  }
}

export async function getInnoUserByProviderId(providerId: string) {
  try {
    const response = await strapiFetcher(GetInnoUserByProviderIdQuery, { providerId });
    const user = await withResponseTransformer(STRAPI_QUERY.GetInnoUser, response);
    return user;
  } catch (err) {
    const error = strapiError('Getting Inno user by providerId', err as Error, providerId);
    logger.error(error);
    throw err;
  }
}

export async function getEvents(startingFrom: Date) {
  try {
    const dateFromString = dayjs(startingFrom).format('YYYY-MM-DD');
    const requestEvents = await strapiFetcher(GetUpcomingEventsQuery, { startingFrom: dateFromString });
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
export async function getMainPageData() {
  const today = new Date();
  const events = await getEvents(today);
  const data = await getDataWithFeaturedFiltering();

  return {
    events: events ?? [],
    projects: data?.projects,
    sliderContent: data?.sliderContent,
    updates: data?.updates,
  };
}

export async function getDataWithFeaturedFiltering() {
  try {
    const response = await strapiFetcher(GetProjectsQuery);
    const result = await withResponseTransformer(STRAPI_QUERY.GetProjects, response);

    // Filter projects which are featured
    const featuredProjects = result.projects.filter((project) => project.featured);

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
    const response = await strapiFetcher(GetProjectsQuery);
    const result = await withResponseTransformer(STRAPI_QUERY.GetProjects, response);
    return result.projects;
  } catch (err) {
    console.info(err);
  }
}

export async function getProjectsUpdates() {
  try {
    const response = await strapiFetcher(GetUpdatesQuery);
    const updates = await withResponseTransformer(STRAPI_QUERY.GetUpdates, response);
    return updates;
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

    const response = await strapiFetcher(GetUpdatesFilterQuery(filterParams, filter, sort), variables);
    const result = await withResponseTransformer(STRAPI_QUERY.GetUpdates, response);
    return result;
  } catch (err) {
    const error = strapiError('Getting all project updates with filter', err as Error);
    logger.error(error);
  }
}

export async function getUpdatesByProjectId(projectId: string) {
  try {
    const response = await strapiFetcher(GetUpdatesByProjectIdQuery, { projectId });
    const updates = await withResponseTransformer(STRAPI_QUERY.GetUpdates, response);
    return updates;
  } catch (err) {
    const error = strapiError('Getting all project updates', err as Error, projectId);
    logger.error(error);
  }
}

export async function getOpportunitiesByProjectId(projectId: string) {
  try {
    const response = await strapiFetcher(GetOpportunitiesByProjectIdQuery, { projectId });
    const opportunities = await withResponseTransformer(STRAPI_QUERY.GetOpportunitiesByProjectId, response);
    return opportunities;
  } catch (err) {
    const error = strapiError('Getting project opportunities by project id', err as Error, projectId);
    logger.error(error);
  }
}

export async function getOpportunityById(projectId: string) {
  try {
    const response = await strapiFetcher(GetOpportunitiesByIdQuery, { projectId });
    const opportunities = await withResponseTransformer(STRAPI_QUERY.GetOpportunitiesByProjectId, response);
    return opportunities[0];
  } catch (err) {
    const error = strapiError('Getting all project opportunities', err as Error, projectId);
    logger.error(error);
  }
}

export async function getProjectQuestionsByProjectId(projectId: string) {
  try {
    const response = await strapiFetcher(GetQuestionsByProjectIdQuery, { projectId });
    const questions = await withResponseTransformer(STRAPI_QUERY.GetProjectQuestionsByProjectId, response);
    return questions;
  } catch (err) {
    const error = strapiError('Getting all project questions', err as Error, projectId);
    logger.error(error);
  }
}

export async function getSurveyQuestionsByProjectId(projectId: string) {
  try {
    const response = await strapiFetcher(GetSurveyQuestionsByProjectIdQuery, { projectId });
    const surveyQuestions = await withResponseTransformer(STRAPI_QUERY.GetSurveyQuestionsByProjectId, response);

    const getVotes = surveyQuestions.map(async (surveyQuestion) => {
      const { data: surveyVotes } = await getSurveyQuestionVotes({ surveyQuestionId: surveyQuestion.id });
      surveyQuestion.votes = surveyVotes?.map((vote) => ({ votedBy: vote.votedBy?.id }) as SurveyVote) ?? [];
      return surveyQuestion;
    });

    const surveyQuestionsWithVotes = await getPromiseResults(getVotes);
    return surveyQuestionsWithVotes;
  } catch (err) {
    const error = strapiError('Getting all survey questions', err as Error, projectId);
    logger.error(error);
  }
}

export async function getCollaborationQuestionsByProjectId(projectId: string) {
  try {
    const response = await strapiFetcher(GetCollaborationQuestionsByProjectIdQuery, { projectId });
    const collaborationQuestions = await withResponseTransformer(
      STRAPI_QUERY.GetCollaborationQuestionsByProjectId,
      response,
    );
    return collaborationQuestions;
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
    const response = await strapiFetcher(CreateProjectUpdateQuery, body);
    const resultUpdate = await withResponseTransformer(STRAPI_QUERY.CreateProjectUpdate, response);
    return resultUpdate;
  } catch (err) {
    const error = strapiError('Trying to to create project update', err as Error, body.projectId);
    logger.error(error);
  }
}

export async function getOpportunityAndUserParticipant(body: { opportunityId: string; userId: string }) {
  try {
    const response = await strapiFetcher(GetOpportunityParticipantQuery, body);
    const opportunity = await withResponseTransformer(STRAPI_QUERY.GetOpportunityParticipant, response);
    return opportunity;
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
    const response = await strapiFetcher(UpdateOpportunityParticipantsQuery, body);
    const opportunity = await withResponseTransformer(STRAPI_QUERY.UpdateOpportunityParticipants, response);
    return opportunity;
  } catch (err) {
    const error = strapiError(
      'Trying to get uodate project opportunity participants',
      err as Error,
      body.opportunityId,
    );
    logger.error(error);
  }
}

export async function getCountOfFutureEvents(projectId: string) {
  try {
    const result = await strapiFetcher(GetFutureEventCountQuery, { projectId, currentDate: new Date() });
    const EventCount = await withResponseTransformer(STRAPI_QUERY.GetEventCount, result);
    return EventCount as number;
  } catch (err) {
    const error = strapiError('Getting count of future events', err as Error);
    logger.error(error);
  }
}

export async function getUpcomingEvents() {
  try {
    const today = new Date();
    const requestEvents = await strapiFetcher(GetUpcomingEventsQuery, { today: today });
    const events = await withResponseTransformer(STRAPI_QUERY.GetEvents, requestEvents);
    return events;
  } catch (err) {
    const error = strapiError('Getting upcoming events', err as Error);
    logger.error(error);
  }
}

export async function getEventsFilter(
  projectId: string,
  amountOfEventsPerPage: number,
  currentPage: number,
  timeframe?: 'past' | 'future' | 'all',
) {
  try {
    const variables = {
      projectId,
      currentPage,
      amountOfEventsPerPage,
      timeframe,
    };

    let filter = '';
    let filterParams = '';

    if (timeframe === 'all') {
      filterParams += '$projectId: ID!';
      filter += 'filters: { project: { id: { eq: $projectId } } }';
    }

    if (timeframe === 'future') {
      filterParams += '$projectId: ID!, $currentDate: DateTime';
      filter += 'filters: {project: { id: { eq: $projectId } }and: { startTime: { gte: $currentDate } }}';
    }

    if (timeframe === 'past') {
      filterParams += '$projectId: ID!, $currentDate: DateTime';
      filter += 'filters: {project: { id: { eq: $projectId } }and: { startTime: { lt: $currentDate } }}';
    }

    filterParams += ',$currentPage: Int, $amountOfEventsPerPage: Int';
    filter += 'pagination: { page: $currentPage, pageSize: $amountOfEventsPerPage },';

    if (filterParams.length) {
      filterParams = `(${filterParams})`;
    }

    const result = await strapiFetcher(GetAllEventsFilterQuery(filterParams, filter), variables);

    const formattedResult = (await withResponseTransformer(STRAPI_QUERY.GetEvents, result)) as Event[];

    return formattedResult;
  } catch (err) {
    const error = strapiError('Getting all events', err as Error);
    logger.error(error);
  }
}
