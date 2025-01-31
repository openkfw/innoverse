module.exports = {
    async up() {
      console.info('Starting the "update_innousers_username" migration');
      await strapi.db.transaction(async () => {
        const innoUsers = await strapi.entityService.findMany('api::inno-user.inno-user');
        innoUsers.map(async (user) => {
          if (!user.username) {
              const username = user.email.split('@')[0];
              await strapi.entityService.update(
                  "api::inno-user.inno-user",
                  user.id,
                  {
                    data: {
                      username: username
                    },
                  }
                )
                strapi.log.info(
                  `[Migration]: Username for the InnoUser with id ${user.id} was updated.`
                )
            }
        });
        strapi.log.info('Usernames for all Inno Users were updated.');
      });
    },
  };