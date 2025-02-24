import { Strapi } from "@strapi/strapi";

export default {
  weeklyEmailJob: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      console.log("Running weekly email job");
      const webhooks = await strapi.webhookStore.findWebhooks();
      const weeklyEmailHook = webhooks.find(
        ({ name }) => name === "weekly email"
      );
      if (weeklyEmailHook)
        await strapi.webhookRunner
          .run(weeklyEmailHook, "trigger-cron")
          .then(console.log);
    },
    options: {
      rule: "0 6 * * 1",
    },
  },
  createWeeklyEmailWebhookIfNotExists: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      const webhooks = await strapi.webhookStore.findWebhooks();
      const weeklyEmailHook = webhooks.find(
        ({ name }) => name === "weekly email"
      );
      if (!weeklyEmailHook) {
        console.error("Weekly email webhook not found");
        await strapi.webhookStore.createWebhook({
          id: "weekly-email",
          name: "weekly email",
          url: "http://localhost:3000/api/hooks/weekly-email", //TODO
          headers: {
            Authorization: "<changeme>",
          },
          events: [],
          isEnabled: false,
        });
      }
    },
    // only run once after 10 seconds
    options: new Date(Date.now() + 10000),
  },
};
