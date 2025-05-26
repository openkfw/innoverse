import { ResultOf } from 'gql.tada';

import { ObjectType, Opportunity } from '@/common/types';
import { toDate } from '@/utils/helpers';
import { mapToUser } from '@/utils/requests/innoUsers/mappings';
import { OpportunityFragment } from '@/utils/requests/opportunities/queries';

export const mapToOpportunities = (
  opportunities: ResultOf<typeof OpportunityFragment>[] | undefined,
): Opportunity[] => {
  const mappedOpportunities = opportunities?.map(mapToOpportunity) ?? [];
  return mappedOpportunities.filter((e) => e !== undefined) as Opportunity[];
};

export function mapToOpportunity(opportunityData: ResultOf<typeof OpportunityFragment>): Opportunity {
  const contactPerson = opportunityData.contactPerson;
  const participants = opportunityData.participants;

  return {
    id: opportunityData.documentId,
    ...opportunityData,
    contactPerson: contactPerson ? mapToUser(contactPerson) : null,
    participants: participants ? participants.map(mapToUser) : [],
    updatedAt: toDate(opportunityData.updatedAt),
    createdAt: toDate(opportunityData.createdAt),
    objectType: ObjectType.OPPORTUNITY,
  };
}
