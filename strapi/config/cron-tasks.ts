export default {
  weeklyEmailJob: {
    task: async ({ strapi }) => {
      console.log("Running weekly email job");
      const webhookStore = strapi.serviceMap.get("webhookStore");
      const webhooks = await webhookStore.findWebhooks();
      const weeklyEmailHook = webhooks.find(
        ({ name }) => name === "weekly email"
      );
      if (weeklyEmailHook)
        await strapi.serviceMap
          .get("webhookRunner")
          .run(weeklyEmailHook, "trigger-cron")
          .then(console.log);
    },
    options: {
      rule: "0 6 * * 1",
    },
  },
  createWeeklyEmailWebhookIfNotExists: {
    task: async ({ strapi }) => {
      const webhookStore = strapi.serviceMap.get("webhookStore");
      const webhooks = await webhookStore.findWebhooks();
      const weeklyEmailHook = webhooks.find(
        ({ name }) => name === "weekly email"
      );
      if (!weeklyEmailHook) {
        console.error("Weekly email webhook not found");
        await webhookStore.createWebhook({
          id: "weekly-email",
          name: "weekly email",
          url: "https://<backend_url>/api/hooks/weekly-email",
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
