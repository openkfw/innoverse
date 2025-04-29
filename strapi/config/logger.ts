"use strict";

const {
  winston,
  formats: { prettyPrint, levelFilter },
} = require("@strapi/logger");

export default {
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        levelFilter("http"),
        prettyPrint({ timestamps: "DD-MM-YYYY hh:mm:ss.SSS" })
      ),
    }),
  ],
};
