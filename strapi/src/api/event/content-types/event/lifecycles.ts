import {
  validateAuthorOnCreate,
  validateAuthorOnUpdate,
} from "../../../../lifecycles/validateAuthor";

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
    validateAuthorOnCreate(data);
    validateStartTime(data);
  },

  beforeUpdate(event) {
    const { data } = event.params;
    validateAuthorOnUpdate(data);
    validateStartTime(data);
  },
};
