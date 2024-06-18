import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const OpportunityFragment = graphql(
  `
    fragment Opportunity on OpportunityEntity @_unmask {
      id
      attributes {
        title
        description
        contactPerson {
          data {
            ...InnoUser
          }
        }
        updatedAt
        expense
        participants {
          data {
            ...InnoUser
          }
        }
      }
    }
  `,
  [InnoUserFragment],
);

export const GetOpportunitiesByProjectIdQuery = graphql(
  `
    query GetOpportunities($projectId: ID) {
      opportunities(filters: { project: { id: { eq: $projectId } } }) {
        data {
          ...Opportunity
        }
      }
    }
  `,
  [OpportunityFragment],
);

export const GetOpportunitiesByIdQuery = graphql(
  `
    query GetOpportunities($opportunityId: ID) {
      opportunities(filters: { id: { eq: $opportunityId } }) {
        data {
          ...Opportunity
        }
      }
    }
  `,
  [OpportunityFragment],
);

export const GetBasicOpportunityByIdQuery = graphql(
  `
    query GetBasicOpportunityById($opportunityId: ID) {
      opportunity(id: $opportunityId) {
        data {
          id
          attributes {
            title
            description
            contactPerson {
              data {
                ...InnoUser
              }
            }
            project {
              data {
                id
                attributes {
                  title
                }
              }
            }
          }
        }
      }
    }
  `,
  [InnoUserFragment],
);

export const GetOpportunityWithParticipantQuery = graphql(
  `
    query GetOpportunities($opportunityId: ID!, $userId: String) {
      opportunities(filters: { id: { eq: $opportunityId }, and: { participants: { providerId: { eq: $userId } } } }) {
        data {
          ...Opportunity
        }
      }
    }
  `,
  [OpportunityFragment],
);

export const UpdateOpportunityParticipantsQuery = graphql(
  `
    query UpdateOpportunity($opportunityId: ID!, $userId: ID!) {
      updateOpportunityParticipants(id: $opportunityId, participantId: $userId) {
        data {
          ...Opportunity
        }
      }
    }
  `,
  [OpportunityFragment],
);

export const GetOpportunityCountProjectIdQuery = graphql(`
  query GetOpportunities($projectId: ID) {
    opportunities(filters: { project: { id: { eq: $projectId } } }) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`);

export const GetUpdatedOpportunitiesQuery = graphql(
  `
    query GetUpdatedOpportunities($from: DateTime) {
      opportunities(filters: { createdAt: { gte: $from }, or: { updatedAt: { gte: $from } } }) {
        data {
          ...Opportunity
        }
      }
    }
  `,
  [OpportunityFragment],
);
