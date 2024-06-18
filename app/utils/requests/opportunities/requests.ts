'use server';

import { StatusCodes } from 'http-status-codes';

import { BasicOpportunity, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { mapFirstToOpportunity, mapToOpportunity } from '@/utils/requests/opportunities/mappings';
import {
  GetBasicOpportunityByIdQuery,
  GetOpportunitiesByIdQuery,
  GetOpportunitiesByProjectIdQuery,
  GetOpportunityCountProjectIdQuery,
  GetOpportunityWithParticipantQuery,
  UpdateOpportunityParticipantsQuery,
} from '@/utils/requests/opportunities/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

const logger = getLogger();

export async function getOpportunitiesByProjectId(projectId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetOpportunitiesByProjectIdQuery, { projectId });
    const opportunitiesData = response.opportunities?.data ?? [];

    const mapToEntities = opportunitiesData.map(async (opportunityData) => {
      const { data: isParticipant } = await userParticipatesInOpportunity({ opportunityId: opportunityData.id });
      return mapToOpportunity(opportunityData, isParticipant);
    });

    const opportunities = await getPromiseResults(mapToEntities);
    return opportunities;
  } catch (err) {
    const error = strapiError('Getting project opportunities by project id', err as RequestError, projectId);
    logger.error(error);
  }
}

export async function getOpportunityById(opportunityId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetOpportunitiesByIdQuery, { opportunityId });
    const opportunity = mapFirstToOpportunity(response.opportunities?.data);
    return opportunity;
  } catch (err) {
    const error = strapiError('Getting an opporunity', err as RequestError, opportunityId);
    logger.error(error);
  }
}

export async function getBasicOpportunityById(opportunityId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetBasicOpportunityByIdQuery, { opportunityId });
    const opportunityData = response.opportunity?.data;
    const projectData = opportunityData?.attributes.project?.data;

    if (!opportunityData) throw new Error('Response contained no opportunity data');

    const attributes = opportunityData.attributes;
    const contactPersonData = attributes.contactPerson?.data;

    const opportunity: BasicOpportunity = {
      id: opportunityData.id,
      title: attributes.title,
      description: attributes.description,
      projectId: projectData?.id,
      contactPerson: contactPersonData ? mapToUser(contactPersonData) : undefined,
    };
    return opportunity;
  } catch (err) {
    const error = strapiError('Getting basic opportunity by id', err as RequestError, opportunityId);
    logger.error(error);
  }
}

export async function isUserParticipatingInOpportunity(body: { opportunityId: string; userId: string }) {
  try {
    const response = await strapiGraphQLFetcher(GetOpportunityWithParticipantQuery, {
      opportunityId: body.opportunityId,
      userId: body.userId,
    });
    const opportunitiesFound = response.opportunities?.data.length ?? 0;
    return opportunitiesFound > 0;
  } catch (err) {
    const error = strapiError(
      'Trying to get project opportunity and add participant',
      err as RequestError,
      body.opportunityId,
    );
    logger.error(error);
  }
}

export async function handleOpportunityAppliedBy(body: { opportunityId: string; userId: string }) {
  try {
    const response = await strapiGraphQLFetcher(UpdateOpportunityParticipantsQuery, body);
    const opportunityData = response.updateOpportunityParticipants?.data;

    if (!opportunityData) throw new Error('Response contained no opportunity data');

    const opportunity = mapToOpportunity(opportunityData);
    return opportunity;
  } catch (err) {
    const error = strapiError(
      'Trying to update project opportunity participants',
      err as RequestError,
      body.opportunityId,
    );
    logger.error(error);
  }
}

export const userParticipatesInOpportunity = withAuth(async (user: UserSession, body: { opportunityId: string }) => {
  try {
    const isParticipating = await isUserParticipatingInOpportunity({
      opportunityId: body.opportunityId,
      userId: user.providerId,
    });
    return {
      status: StatusCodes.OK,
      data: isParticipating ?? false,
    };
  } catch (err) {
    const error: InnoPlatformError = strapiError(
      `Find if user ${user.providerId} applied for opportunity ${body.opportunityId}`,
      err as RequestError,
      body.opportunityId,
    );
    logger.error(error);
    throw err;
  }
});

export const countOpportunitiesForProject = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const response = await strapiGraphQLFetcher(GetOpportunityCountProjectIdQuery, { projectId: body.projectId });
    const countResult = response.opportunities?.meta.pagination.total;

    return { status: StatusCodes.OK, data: countResult };
  } catch (err) {
    const error = strapiError('Error fetching opportunities count for project', err as RequestError);
    logger.error(error);
    throw err;
  }
});
