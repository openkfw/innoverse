"use strict";

import {
  validateAuthorOnCreate,
  validateAuthorOnUpdate,
} from "../../../../lifecycles/validateAuthor";

export default {
  beforeCreate(event) {
    const { data } = event.params;
    validateAuthorOnCreate(data);
  },

  beforeUpdate(event) {
    const { data } = event.params;
    validateAuthorOnUpdate(data);
  },
};
