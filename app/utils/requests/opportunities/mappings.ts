import { ResultOf } from 'gql.tada';

import { Opportunity } from '@/common/types';
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
  const attributes = opportunityData.attributes;
  const contactPerson = attributes.contactPerson?.data;
  const participants = attributes.participants?.data;

  return {
    id: opportunityData.id,
    ...attributes,
    description: attributes.description ?? undefined,
    expense: attributes.expense ?? undefined,
    contactPerson: contactPerson ? mapToUser(contactPerson) : undefined,
    participants: participants ? participants.map(mapToUser) : [],
    hasApplied,
  };
}
