import { ResultOf } from 'gql.tada';

import { ObjectType, Opportunity } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { OpportunityFragment } from '@/utils/requests/opportunities/queries';

export function mapToOpportunity(
  opportunityData: ResultOf<typeof OpportunityFragment>,
  hasApplied: boolean = false,
): Opportunity {
  const contactPerson = opportunityData.contactPerson;
  const participants = opportunityData.participants;

  return {
    id: opportunityData.documentId,
    ...opportunityData,
    contactPerson: contactPerson ? mapToUser(contactPerson) : null,
    participants: participants ? participants.map(mapToUser) : [],
    hasApplied,
    updatedAt: toDate(opportunityData.updatedAt),
    objectType: ObjectType.OPPORTUNITY,
  };
}
