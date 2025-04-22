import { ResultOf } from 'gql.tada';

import { ObjectType, Opportunity } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { OpportunityFragment } from '@/utils/requests/opportunities/queries';

export function mapFirstToOpportunity(opportunities: ResultOf<typeof OpportunityFragment>[] | undefined) {
  if (!opportunities || !opportunities.length) {
    throw new Error('Response contained no opportunities');
  }
  const opportunity = opportunities[0];
  return mapToOpportunity(opportunity);
}

export function mapToOpportunity(
  opportunityData: ResultOf<typeof OpportunityFragment>,
  hasApplied: boolean = false,
): Opportunity {
  const contactPerson = opportunityData.contactPerson;
  const participants = opportunityData.participants;

  return {
    id: opportunityData.documentId,
    ...opportunityData,
    description: opportunityData.description ?? undefined,
    expense: opportunityData.expense ?? undefined,
    contactPerson: contactPerson ? mapToUser(contactPerson) : undefined,
    participants: participants ? participants.map(mapToUser) : [],
    hasApplied,
    updatedAt: toDate(opportunityData.updatedAt),
    objectType: ObjectType.OPPORTUNITY,
  };
}
