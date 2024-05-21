const { YupValidationError } = require("@strapi/utils").errors;

const VALIDATION_ERROR = "There was a validation error";

export const validateAuthorOnCreate = (data: any) => {
  if (
    data.author.disconnect?.length === 0 &&
    data.author.connect?.length === 0
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
};

export const validateAuthorOnUpdate = (data: any) => {
  const isPublish = !!data.publishedAt;
  const isUnpublish = data.publishedAt === null;

  // on publish/unpublish not all event data is provided
  // before publishing something, the user has to save the changes first anyway
  if (isPublish || isUnpublish) {
    return;
  }

  if (data.author.disconnect.length != 0 && data.author.connect.length === 0) {
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
};
