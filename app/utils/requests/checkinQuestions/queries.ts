import { graphql } from '@/types/graphql';

export const CheckinQuestionFragment = graphql(`
  fragment CheckinQuestion on CheckinQuestion @_unmask {
    documentId
    question
    updatedAt
    createdAt
    validFrom
    validTo
  }
`);

export const GetCheckinQuestionByIdQuery = graphql(
  `
    query GetCheckinQuestionById($id: ID!) {
      checkinQuestion(documentId: $id) {
        ...CheckinQuestion
      }
    }
  `,
  [CheckinQuestionFragment],
);

export const GetCheckinQuestionByValidDates = graphql(
  `
    query GetCheckinQuestionByValidDates($validFrom: Date, $validTo: Date) {
      checkinQuestions(filters: { validFrom: { eq: $validFrom }, validTo: { eq: $validTo } }) {
        ...CheckinQuestion
      }
    }
  `,
  [CheckinQuestionFragment],
);
