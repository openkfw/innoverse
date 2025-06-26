'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { withAuth } from '@/utils/auth';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { handleOpportunityAppliedBy, isUserParticipatingInOpportunity } from '@/utils/requests/opportunities/requests';
import { validateParams } from '@/utils/validationHelper';

import { handleOpportunitySchema } from './validationSchema';

export const handleApplyForOpportunity = withAuth(async (user: UserSession, body: { opportunityId: string }) => {
  const validatedParams = validateParams(handleOpportunitySchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const innoUser = await getInnoUserByProviderId(user.providerId);
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
    const innoUser = await getInnoUserByProviderId(user.providerId);
    if (innoUser) {
      const result = await isUserParticipatingInOpportunity({
        opportunityId: body.opportunityId,
        userId: innoUser.providerId as string,
      });

      return { status: StatusCodes.OK, data: result ?? false };
    } else
      return {
        status: StatusCodes.UNAUTHORIZED,
        errors: [{ message: 'User not found' }],
      };
  } else {
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  }
});
