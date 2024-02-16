'use server';

import { StatusCodes } from 'http-status-codes';

import { User, UserSession } from '@/common/types';
import { withAuth } from '@/utils/auth';
import {
  getInnoUserByProviderId,
  getOpportunityAndUserParticipant,
  handleOpportunityAppliedBy,
} from '@/utils/requests';
import { validateParams } from '@/utils/validationHelper';

import { handleOpportunitySchema } from './validationSchema';

export const handleApplyForOpportunity = withAuth(async (user: UserSession, body: { opportunityId: string }) => {
  const validatedParams = validateParams(handleOpportunitySchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const innoUser = (await getInnoUserByProviderId(user.providerId)) as User;
    const result = await handleOpportunityAppliedBy({
      opportunityId: body.opportunityId,
      userId: innoUser.id as string,
    });
    return { status: StatusCodes.OK, data: result };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const hasAppliedForOpportunity = withAuth(async (user: UserSession, body: { opportunityId: string }) => {
  const validatedParams = validateParams(handleOpportunitySchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const innoUser = (await getInnoUserByProviderId(user.providerId)) as User;
    if (innoUser) {
      const result = await getOpportunityAndUserParticipant({
        opportunityId: body.opportunityId,
        userId: innoUser.id as string,
      });

      return { status: StatusCodes.OK, data: result !== undefined };
    }
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});
