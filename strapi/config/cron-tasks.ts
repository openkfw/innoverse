export default {

    // Setup weekly strapi cron job  
    weeklyEmailJob: {
      task: async ({ strapi }) => {
  
        try {
          // TODO - uncomment following code to use the actual user fetching logic 
         
          // const users = await strapi.entityService.findMany('api::inno-user.inno-user', {
          //   // before MR #24 is merged, use 'name' instead of 'username'
          //   fields: ['email', 'username']
          // });
  
          // DEV - mock data for testing
          const users = [
            // DEV - replace with your own email address for testing  
            { id: 63, email: 's.hrmo@accenture.com', username: 'Hrmo, S.' }
          ];
  
          for (const user of users) {
            try {
              
              // Send email to every user
              await strapi.plugin('email').service('email').send({
                to: user.email,

                // TODO - edit subject
                subject: 'Weekly Update',

                // TODO - replace with real content
                text: `Hello ${user.username}, this is a test email!`,
                
                // TODO - replace with real content
                html: `<p>Hello ${user.username},</p><p>This is a test email!</p>`,
              });
  
              console.log(`Email sent to ${user.email}`);
            } catch (error) {
              console.error(`Failed to send email to ${user.email}:`, error);
            }
          }
  
          // TODO - execute additional logic if needed
          console.log('Weekly email cron job executed successfully');
        } catch (error) {
          console.error('Error executing weekly email cron job:', error);
        }
      },
      options: {
        // DEV - this runs every hour 
        // rule: '0 * * * *',

        // DEV - this runs every minute 
        // rule: '*/1 * * * *',

        // DEV - this runs once a week, every Sunday at 20:00
        rule: '0 20 * * 0',

      }
    }
  }
  