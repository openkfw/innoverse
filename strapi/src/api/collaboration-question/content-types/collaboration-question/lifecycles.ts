"use strict";
const { ApplicationError } = require("@strapi/utils").errors;

const formatCreateErrorMessage = (
  title: string
) => `Unable to create a collaboration question marked as platform feedback, 
because there already exists a collaboration question that is set as platform 
feedback (title: '${title}')`;

const formatUpdateErrorMessage = (
  title: string
) => `Unable to set this collaboration question as platform feedback, 
because there already exists a collaboration question that is set as platform 
feedback (title: '${title}')`;

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    console.log(
      `[Lifecycle-Hook]: Creating collaboration question (isPlatformFeedback: ${data.isPlatformFeedback}) ...`
    );

    if (!data.isPlatformFeedback) return;

    const feedbackQuestions = await getPlatformFeedbackQuestions();

    if (!feedbackQuestions.length) return;

    const feedbackQuestion = feedbackQuestions[0];
    throw new ApplicationError(
      formatCreateErrorMessage(feedbackQuestion.title)
    );
  },
  async beforeUpdate(event) {
    const { data } = event.params;

    console.log(
      `[Lifecycle-Hook]: Updating collaboration question (isPlatformFeedback: ${data.isPlatformFeedback}) ...`
    );

    if (!data.isPlatformFeedback) return;

    const feedbackQuestions = await getPlatformFeedbackQuestions();
    const otherFeedbackQuestions = feedbackQuestions.filter(
      (question) => question.id !== data.id
    );

    if (!otherFeedbackQuestions.length) return;

    const feedbackQuestion = otherFeedbackQuestions[0];
    throw new ApplicationError(
      formatUpdateErrorMessage(feedbackQuestion.title)
    );
  },
};

const getPlatformFeedbackQuestions = async () => {
  const platformFeedbackQuestions = await
    strapi.documents("api::collaboration-question.collaboration-question").findMany({
        filters: {
          isPlatformFeedback: true,
        }
      });
  
  console.info(
    `[Lifecycle-Hook]: Found ${platformFeedbackQuestions.length} platform feedback question(s)`
  );
  return platformFeedbackQuestions;
};
