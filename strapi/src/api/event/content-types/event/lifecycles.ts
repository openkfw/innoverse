const { YupValidationError } = require("@strapi/utils").errors;

const VALIDATION_ERROR = "There was a validation error";

const validateStartTime = (data) => {
  if (data.startTime && data.endTime && data.startTime > data.endTime) {
    throw new YupValidationError(
      {
        value: data.startTime,
        type: "warning",
        path: "startTime",
        name: "ValidationError",
        message: "Start time has to be earlier than end time",
        inner: [],
      },
      VALIDATION_ERROR
    );
  }
};

export default {
  beforeCreate(event) {
    const { data } = event.params;
    if (
      data.author.disconnect.length === 0 &&
      data.author.connect.length === 0
    ) {
      throw new YupValidationError(
        {
          value: data.author,
          type: "warning",
          path: "author",
          name: "ValidationError",
          message: "The author is required",
          inner: [],
        },
        VALIDATION_ERROR
      );
    }
    validateStartTime(data);
  },

  beforeUpdate(event) {
    const { data } = event.params;
    const isPublish = !!data.publishedAt;
    const isUnpublish = data.publishedAt === null;

    // on publish/unpublish not all event data is provided
    // before publishing something, the user has to save the changes first anyway
    if (isPublish || isUnpublish) {
      return;
    }

    if (
      data.author.disconnect.length != 0 &&
      data.author.connect.length === 0
    ) {
      throw new YupValidationError(
        {
          value: data.author,
          data: data,
          type: "warning",
          path: "author",
          name: "ValidationError",
          message: "The author is required",
          inner: [],
        },
        VALIDATION_ERROR
      );
    }
    validateStartTime(data);
  },
};
