export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");

    const extension = ({}) => ({
      typeDefs: `
        type Query {
          updateOpportunityParticipants(documentId: ID!, participantId: ID!): Opportunity
        }
      `,
      resolvers: {
        Query: {
          updateOpportunityParticipants: async (_parent, args) => {
            const { toEntityResponse } = strapi.service(
              "plugin::graphql.format"
            ).returnTypes;
            const { id, participantId } = args;
            return await strapi.db.transaction(
              async ({ trx, rollback, commit, onCommit, onRollback }) => {
                const entries = await strapi
                  .documents("api::opportunity.opportunity")
                  .findOne({
                    documentId: id,
                    fields: ["documentId", "title"],
                    populate: { participants: { fields: ["documentId"] } },
                  });
                const participantIds = entries.participants.map(
                  (participant) => participant.documentId
                );

                // If participant is already saved in list of participants, remove the participandId from the array
                if (participantIds.includes(parseInt(participantId))) {
                  const updateRequest = await strapi
                    .documents("api::opportunity.opportunity")
                    .update({
                      documentId: id,
                      data: {
                        participants: participantIds.filter((id) => {
                          return id != participantId;
                        }),
                      },
                    });
                  return toEntityResponse(updateRequest);
                }

                // If participant is not saved in list of participants, add the participandId to the array
                const updateRequest = await strapi
                  .documents("api::opportunity.opportunity")
                  .update({
                    documentId: id,
                    data: {
                      participants: [participantId, ...participantIds],
                    },
                  });

                return toEntityResponse(updateRequest);
              }
            );
          },
        },
      },
    });
    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
