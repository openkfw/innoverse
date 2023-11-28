# InnoBuddy-Platform StartUp Guide

This is the StartUp Guide for the InnoBuddy Platform.
As a short introduction, the main components of the InnoBuddy Platform are shown in the diagram below:

![arch](./docs/innoplatform.png)

For starting the platform, you need to start at least the Strapi CMS, the Database and the Innobuddy app.
Optionally, you can also start up Umami to get an overview of the user analytics, but this is not needed for local development.

## InnoBuddy App locally, strapi & umami with docker

The most common way to stat up the platform is by starting all components with docker except the InnoBuddy Next.js App.
For this you can use the `docker-compose-strapi.yaml` for strapi & DB or the `docker-compose-full.yaml` for strapi & umami & DB

First set up the correct env vars:

- For the Azure and Gitlab Env vars (`./app/.env.example`) some examples can be found in GitLab in the [CICD Variable](***URL_REMOVED***) `InnoBuddyAppEnv`.
- For some of the Strapi env vars (`./strapi/.env.example`) some examples can be found in GitLab in the [CICD Variable](***URL_REMOVED***) `StrapiEnv`.

```bash
# from project root
cp .env.example .en
cp ./app/.env.example .env # and then fill the missing env vars
cp ./strapi/.env.example .env # and then fill the missing env vars
```

then start the components:

```bash
docker-compose -f up docker-compose-strapi.yaml # for starting the project with strapi
```

or

```bash
docker-compose -f up docker-compose-full.yaml # for starting the project with strapi and umami
```

> **IMPORTANT:**
> Now you need to generate & set the Strapi API Token

Please go the strapi admin dashboard [http://localhost:1337/admin](http://localhost:1337/admin), create an admin user and after login go to the [API Tokens settings Page](http://localhost:1337/admin/settings/api-tokens) and generate a new API Token (Token duration - Unlimited, Token type - Full Access) - then copy and save the token, and paste the token in the `./app/.env` file under NEXT_PUBLIC_STRAPI_TOKEN

```bash
cd app
npm run dev
```

now your app should be visible under [http://localhost:3000](http://localhost:3000)

> **Important:**
> The CMS is not filled with data by default. You can create your own data or opt for importing data from an existing strapi instance - check the docs in [./strapi/README.md](./strapi/README.md##Export&Import)

#### Database: Accessing/Viewing the DB (Prisma Studio)

- Run `npm run prisma studio` to run the database browser and check the database.

YOU MADE IT! (locally)
