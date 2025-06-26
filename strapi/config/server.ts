import cronTasks from "./cron-tasks";

export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  payload: {
    maxBytes: 10485760, // Set the maximum payload size to 10MB (adjust as needed)
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },

  // Enable strapi cron jons
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
});
