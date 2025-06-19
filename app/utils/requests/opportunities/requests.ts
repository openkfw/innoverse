'use server';

import { StatusCodes } from 'http-status-codes';

import { BasicOpportunity, Opportunity, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { mapToOpportunity } from '@/utils/requests/opportunities/mappings';
import {
  GetBasicOpportunityByIdQuery,
  GetOpportunityWithParticipantQuery,
  UpdateOpportunityParticipantsQuery,
} from '@/utils/requests/opportunities/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

const logger = getLogger();

export async function getBasicOpportunityById(opportunityId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetBasicOpportunityByIdQuery, { opportunityId });
    const opportunityData = response.opportunity;
    const projectData = opportunityData?.project;

    if (!opportunityData) throw new Error('Response contained no opportunity data');
    if (!projectData) throw new Error('Opportunity contained no project data');
    const contactPersonData = opportunityData.contactPerson;

    const opportunity: BasicOpportunity = {
      id: opportunityData.documentId,
      title: opportunityData.title,
      description: opportunityData.description,
      projectId: projectData.documentId,
      projectName: projectData.title,
      contactPerson: contactPersonData ? mapToUser(contactPersonData) : undefined,
    };
    return opportunity;
  } catch (err) {
    const error = strapiError('Getting basic opportunity by id', err as RequestError, opportunityId);
    logger.error(error);
    throw err;
  }
}

export async function isUserParticipatingInOpportunity(body: { opportunityId: string; userId: string }) {
  try {
    const response = await strapiGraphQLFetcher(GetOpportunityWithParticipantQuery, {
      opportunityId: body.opportunityId,
      userId: body.userId,
    });
    const opportunitiesFound = response.opportunities.length ?? 0;
    return opportunitiesFound > 0;
  } catch (err) {
    const error = strapiError(
      'Trying to get project opportunity and add participant',
      err as RequestError,
      body.opportunityId,
    );
    logger.error(error);
    throw err;
  }
}

export async function handleOpportunityAppliedBy(body: { opportunityId: string; userId: string }) {
  try {
    const response = await strapiGraphQLFetcher(UpdateOpportunityParticipantsQuery, body);
    const opportunityData = response.updateOpportunityParticipants;

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
    throw err;
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

export async function getOpportunitiesWithAdditionalData(opportunities: Opportunity[]) {
  const getAdditionalData = opportunities.map(getOpportunityWithAdditionalData);
  const opportunitiesWithAdditionalData = await getPromiseResults(getAdditionalData);
  return opportunitiesWithAdditionalData;
}

export async function getOpportunityWithAdditionalData(opportunity: Opportunity): Promise<Opportunity> {
  try {
    const { data: isParticipant } = await userParticipatesInOpportunity({
      opportunityId: opportunity.id,
    });
    return {
      ...opportunity,
      hasApplied: isParticipant,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting additional data for opportunity with id: ${opportunity.id}`,
      err as RequestError,
      opportunity.id,
    );
    logger.error(error);
    throw err;
  }
}
