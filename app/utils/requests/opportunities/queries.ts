import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const OpportunityFragment = graphql(
  `
    fragment Opportunity on Opportunity @_unmask {
      documentId
      title
      description
      contactPerson {
        ...InnoUser
      }
      updatedAt
      expense
      participants {
        ...InnoUser
      }
    }
  `,
  [InnoUserFragment],
);

export const GetOpportunitiesByIdQuery = graphql(
  `
    query GetOpportunities($opportunityId: ID) {
      opportunities(filters: { documentId: { eq: $opportunityId } }) {
        ...Opportunity
      }
    }
  `,
  [OpportunityFragment],
);

export const GetBasicOpportunityByIdQuery = graphql(
  `
    query GetBasicOpportunityById($opportunityId: ID!) {
      opportunity(documentId: $opportunityId) {
        ...Opportunity
        project {
          documentId
          title
        }
      }
    }
  `,
  [OpportunityFragment],
);

export const GetOpportunityWithParticipantQuery = graphql(
  `
    query GetOpportunities($opportunityId: ID!, $userId: String) {
      opportunities(
        filters: { documentId: { eq: $opportunityId }, and: { participants: { providerId: { eq: $userId } } } }
      ) {
        ...Opportunity
      }
    }
  `,
  [OpportunityFragment],
);

export const UpdateOpportunityParticipantsQuery = graphql(
  `
    query UpdateOpportunity($opportunityId: ID!, $userId: ID!) {
      updateOpportunityParticipants(documentId: $opportunityId, participantId: $userId) {
        ...Opportunity
      }
    }
  `,
  [OpportunityFragment],
);

export const GetUpdatedOpportunitiesQuery = graphql(
  `
    query GetUpdatedOpportunities($from: DateTime) {
      opportunities(filters: { createdAt: { gte: $from }, or: { updatedAt: { gte: $from } } }) {
        ...Opportunity
      }
    }
  `,
  [OpportunityFragment],
);
