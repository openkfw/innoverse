'use server';
import { SurveyVote } from '@prisma/client';
import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';

import {
  Event,
  EventWithAdditionalData,
  Filters,
  ObjectWithReactions,
  Project,
  ProjectUpdate,
  ProjectUpdateWithAdditionalData,
  UserSession,
} from '@/common/types';
import { getSurveyQuestionVotes } from '@/components/collaboration/survey/actions';
import { getProjectAndUserFollowers, getProjectFollowers } from '@/repository/db/follow';
import { getProjectAndUserLikes, getProjectLikes } from '@/repository/db/like';
import dbClient from '@/repository/db/prisma/prisma';
import { countNumberOfReactions, findReaction } from '@/repository/db/reaction';
import { getSuveyQuestionAndUserVote } from '@/repository/db/survey_votes';

import { withAuth } from './auth';
import { dbError, InnoPlatformError, strapiError } from './errors';
import { getFulfilledResults, getPromiseResults } from './helpers';
import getLogger from './logger';
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
const logger = getLogger();
import { getCollaborationCommentUpvotedBy } from '@/repository/db/collaboration_comment';
import { getCommentUpvotedBy } from '@/repository/db/project_comment';
import { AddUpdateData } from '@/components/newsPage/addUpdate/form/AddUpdateForm';

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

export async function getAllProjectData(id: string) {
  const project = (await getProjectById(id)) as Project;
  const likes = await getProjectLikes(dbClient, id);
  const followers = await getProjectFollowers(dbClient, id);
  const { data: isLiked } = await authenticatedFindLiked({ projectId: id });
  const { data: isFollowed } = await authenticatedFindFollow({ projectId: id });
  const futureEvents = (await getEventsFilter(id, 2, 1, 'future')) || [];
  const pastEvents = (await getEventsFilter(id, 2, 1, 'past')) || [];

  const getCollabQuestionsWithUpvote = project.collaborationQuestions.map(async (question) => {
    const getCommentsWithUpvote = question.comments.map(async (comment) => {
      const { data: isUpvotedByUser } = await authenticatedCollabCommenUpvoted({ commentId: comment.id });
      return { ...comment, isUpvotedByUser };
    });

    return { ...question, comments: await getPromiseResults(getCommentsWithUpvote) };
  });

  const collaborationQuestions = await getPromiseResults(getCollabQuestionsWithUpvote);

  const getProjectCommentsWithUpvote = project.comments.map(async (comment) => {
    const { data: isUpvotedByUser } = await authenticatedProjectCommentUpvoted({ commentId: comment.id });

    return {
      ...comment,
      isUpvotedByUser,
    };
  });
  const projectComments = await getPromiseResults(getProjectCommentsWithUpvote);

  const getOpportunities = project.opportunities.map(async (opp) => {
    const { data: hasApplied } = await authenticatedAppliedForOpp({ oppId: opp.id });
    return {
      ...opp,
      hasApplied,
    };
  });

  const opportunities = await getPromiseResults(getOpportunities);

  const getSurveyQuestions = project.surveyQuestions.map(async (question) => {
    const { data: userVote } = await authenticatedGetSurveyQuestionVote({ surveyQuestionId: question.id });
    return {
      ...question,
      userVote: userVote?.vote,
    };
  });

  const surveyQuestions = await getPromiseResults(getSurveyQuestions);

  const futureEventsWithReactions = (await getObjectsWithAdditionalData(
    futureEvents,
    'EVENT',
  )) as EventWithAdditionalData[];
  const pastEventsWithReactions = (await getObjectsWithAdditionalData(
    pastEvents,
    'EVENT',
  )) as EventWithAdditionalData[];

  return {
    project: { ...project, opportunities, surveyQuestions, collaborationQuestions, comments: projectComments },
    likes,
    followers,
    isLiked: isLiked || false,
    isFollowed: isFollowed || false,
    futureEvents: futureEventsWithReactions,
    pastEvents: pastEventsWithReactions,
  };
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
    const error = strapiError('Getting events', err as Error);
    logger.error(error);
  }
}

export async function getMainPageData() {
  const events = await getUpcomingEvents();
  const data = await getDataWithFeaturedFiltering();
  if (!data) return;

  return {
    projects: data?.projects,
    sliderContent: data?.sliderContent,
    updates: data.updates ? await getObjectsWithAdditionalData(data.updates, 'UPDATE') : [],
    events: events ? await getObjectsWithAdditionalData(events, 'EVENT') : [],
  };
}

const authenticatedFindReaction = withAuth(
  async (user: UserSession, body: { objectType: 'UPDATE' | 'EVENT'; objectId: string }) => {
    try {
      const result = await findReaction(dbClient, user.providerId, body.objectType, body.objectId);
      return {
        status: StatusCodes.OK,
        data: result,
      };
    } catch (err) {
      const error: InnoPlatformError = strapiError(
        `Find reaction for ${user.providerId} and ${body.objectType} ${body.objectId} `,
        err as Error,
        body.objectId,
      );
      logger.error(error);
      throw err;
    }
  },
);

const authenticatedGetSurveyQuestionVote = withAuth(async (user: UserSession, body: { surveyQuestionId: string }) => {
  try {
    const result = await getSuveyQuestionAndUserVote(dbClient, body.surveyQuestionId, user.providerId);
    return {
      status: StatusCodes.OK,
      data: result,
    };
  } catch (err) {
    const error: InnoPlatformError = strapiError(
      `Find survey vote for user ${user.providerId} and survey question ${body.surveyQuestionId}`,
      err as Error,
      body.surveyQuestionId,
    );
    logger.error(error);
    throw err;
  }
});

const authenticatedCollabCommenUpvoted = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const result = await getCollaborationCommentUpvotedBy(dbClient, body.commentId, user.providerId);
    return { status: StatusCodes.OK, data: result.length > 0 };
  } catch (err) {
    const error: InnoPlatformError = strapiError(
      `Find upvote for comment${body.commentId} by user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    throw err;
  }
});

const authenticatedProjectCommentUpvoted = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const result = await getCommentUpvotedBy(dbClient, body.commentId, user.providerId);
    return { status: StatusCodes.OK, data: result.length > 0 };
  } catch (err) {
    const error: InnoPlatformError = strapiError(
      `Find upvote for comment${body.commentId} by user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    throw err;
  }
});

export async function getObjectsWithAdditionalData(
  objects: Event[] | ProjectUpdate[],
  objectType: 'UPDATE' | 'EVENT',
): Promise<ObjectWithReactions[]> {
  return (await Promise.allSettled(objects.map(async (object) => getAdditionalDataForObject(object, objectType))).then(
    (results) => getFulfilledResults(results),
  )) as ObjectWithReactions[];
}
export async function getAdditionalDataForObject(
  object: Event | ProjectUpdate,
  objectType: 'UPDATE' | 'EVENT',
): Promise<ObjectWithReactions> {
  const { data: reactionForUser } = await authenticatedFindReaction({ objectType, objectId: object.id });
  const reactionCountResult = await countNumberOfReactions(dbClient, objectType, object.id);

  const reactionCount = reactionCountResult.map((r) => ({
    count: r._count.shortCode,
    emoji: {
      shortCode: r.shortCode,
      nativeSymbol: r.nativeSymbol,
    },
  }));

  if (objectType === 'UPDATE') {
    const { data: followedByUser } = await authenticatedFindFollow({ projectId: object.projectId });
    return {
      ...object,
      reactionForUser: reactionForUser || undefined,
      followedByUser,
      reactionCount,
    };
  }

  return {
    ...object,
    reactionForUser: reactionForUser || undefined,
    reactionCount,
  };
}

const authenticatedFindFollow = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const result = await getProjectAndUserFollowers(dbClient, body.projectId, user.providerId);

    return {
      status: StatusCodes.OK,
      data: result.length > 0,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Find following for ${user.providerId} and ${body.projectId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    throw err;
  }
});

const authenticatedFindLiked = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const result = await getProjectAndUserLikes(dbClient, body.projectId, user.providerId);

    return {
      status: StatusCodes.OK,
      data: result.length > 0,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Find likes for ${user.providerId} and ${body.projectId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    throw err;
  }
});

const authenticatedAppliedForOpp = withAuth(async (user: UserSession, body: { oppId: string }) => {
  try {
    const result = await getOpportunityAndUserParticipant({ opportunityId: body.oppId, userId: user.providerId });
    return {
      status: StatusCodes.OK,
      data: result !== undefined,
    };
  } catch (err) {
    const error: InnoPlatformError = strapiError(
      `Find if user ${user.providerId} applied for opportunity ${body.oppId}`,
      err as Error,
      body.oppId,
    );
    logger.error(error);
    throw err;
  }
});

export async function getDataWithFeaturedFiltering() {
  try {
    const response = await strapiFetcher(GetProjectsQuery());
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

export async function getProjects(sort?: string) {
  try {
    const response = await strapiFetcher(GetProjectsQuery(sort));
    const result = await withResponseTransformer(STRAPI_QUERY.GetProjects, response);
    return result.projects;
  } catch (err) {
    const error = strapiError('Getting all projects', err as Error);
    logger.error(error);
  }
}

export async function getProjectsUpdates(limit: number = 100) {
  try {
    const response = await strapiFetcher(GetUpdatesQuery, { limit });
    const updates = await withResponseTransformer(STRAPI_QUERY.GetUpdates, response);
    const updatesWithAdditionalData = await getObjectsWithAdditionalData(updates, 'UPDATE');
    return updatesWithAdditionalData as ProjectUpdateWithAdditionalData[];
  } catch (err) {
    const error = strapiError('Getting all project updates', err as Error);
    logger.error(error);
  }
}

export async function getProjectsUpdatesFilter(
  sort: 'desc' | 'asc',
  page: number,
  filters: Filters = { projects: [], topics: [] },
): Promise<ProjectUpdateWithAdditionalData[] | undefined> {
  try {
    const { projects, topics } = filters;
    const variables = {
      projects,
      topics,
      page,
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
    filterParams += '$page: Int';
    filter += 'pagination: { page: $page, pageSize: 10 }';

    if (filterParams.length) {
      filterParams = `(${filterParams})`;
    }

    const response = await strapiFetcher(GetUpdatesFilterQuery(filterParams, filter, sort), variables);
    const result = await withResponseTransformer(STRAPI_QUERY.GetUpdates, response);
    const updatesWithAdditionalData = (await getObjectsWithAdditionalData(
      result,
      'UPDATE',
    )) as ProjectUpdateWithAdditionalData[];

    return updatesWithAdditionalData;
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

export async function createProjectUpdate(body: AddUpdateData) {
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
      currentDate: new Date(),
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
