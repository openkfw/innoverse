export default {
  weeklyEmailJob: {
    task: async ({ strapi }) => {
      try {
        // Uncomment and use the actual user fetching logic as needed
        // const users = await strapi.entityService.findMany('api::inno-user.inno-user', {
        //   fields: ['email', 'name'],
        // });

        // Mock data for testing - replace with your own email address for testing
        const users = [
          { id: 63, email: "s.hrmo@example.com", name: "Hrmo, S." },
        ];

        for (const user of users) {
          try {
            await strapi
              .plugin("email")
              .service("email")
              .send({
                to: user.email,
                subject: "Weekly Update",
                text: `Hello ${user.name}, this is a test email!`,
                html: `<p>Hello ${user.name},</p><p>This is a test email!</p>`,
              });

            console.log(`Email sent to ${user.email}`);
          } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
          }
        }

        console.log("Weekly email cron job executed successfully");
      } catch (error) {
        console.error("Error executing weekly email cron job:", error);
      }
    },
    options: {
      rule: "*/1 * * * *",
    },
  },
};
