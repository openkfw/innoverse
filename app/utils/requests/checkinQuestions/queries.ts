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

export const GetCheckinQuestionByValidDates = graphql(`
  query GetCheckinQuestionByValidDates($currentDate: Date) {
    checkinQuestions(filters: { validFrom: { lte: $currentDate }, validTo: { gte: $currentDate } }) {
      documentId
      question
    }
  }
`);
export const GetAllCheckinQuestions = graphql(
  `
    query GetAllCheckinQuestions {
      checkinQuestions {
        ...CheckinQuestion
      }
    }
  `,
  [CheckinQuestionFragment],
);
