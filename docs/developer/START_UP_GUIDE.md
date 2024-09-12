# InnoVerse-Platform StartUp Guide

This is the StartUp Guide for the InnoVerse Platform.
As a short introduction, the main components of the InnoVerse Platform are shown in the diagram below:

![arch](../innoplatform.png)

For starting the platform, you need to start at least the Strapi CMS, the Database and the InnoVerse app.

## Running InnoVerse locally

The most common way to start up the platform is by starting all components with Docker.
For this you can use the `docker-compose.yaml`.

You can find a full list of the environment variables in the [Environment variables section](#environment-variables).

```bash
# from project root
cp ./postgres/.env.example ./postgres/.env
cp ./app/.env.example ./app/.env # and then fill the missing env vars in /app
cp ./strapi/.env.example ./strapi/.env # and then fill the missing env vars in /strapi
```

Make sure you have three (3) .env files in total. One (1) in /postgres folder, one (1) in the /app folder and one (1) in the
/strapi folder.

First start the components:

```bash
docker compose up
```

then start the InnoVerse app locally

```bash
cd ./app
npm run dev
```

> **IMPORTANT:**
> Now you need to generate & set the Strapi API Token, so the app can access the strapi data.

Please go the strapi admin dashboard [http://localhost:1337/admin](http://localhost:1337/admin) and create an admin
user. Remember the login information, you might need it again to access the Strapi UI.

Next, after login, go to the [API Tokens settings Page](http://localhost:1337/admin/settings/api-tokens) and generate a
new API Token (Token duration - Unlimited, Token type - Full Access) - then copy and save the token, and paste the token
in the `./app/.env` file under STRAPI_TOKEN.

Now you need to migrate the database to prisma by running from inside the `app` folder:

```bash
npm run prisma migrate dev
```

now your app should be reachable under [http://localhost:3000](http://localhost:3000)

#### Database: Accessing/Viewing the DB (Prisma Studio)

- Run `npm run prisma studio` from inside the `app` folder to run the database browser and check the database.

> **Important:**
> The CMS is not filled with data by default. You can create your own data or opt for importing data from an existing
> strapi instance - check the docs in the [Strapi README.md](/strapi/README.md##Export&Import)

### Push Notifications

#### Platform Setup

- Generate following ENV variables `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`
  via `npx web-push generate-vapid-keys`
- Add the contact email to the `VAPID_ADMIN_EMAIL` environment variable in format "mailto:your_email"
- Set the `STRAPI_PUSH_NOTIFICATION_SECRET` environment variable to a secret string

### News Feed

The news feed uses Redis as a cache and should be refreshed manually or via a CURL command periodically. For this the API endpoint `/api/redis/full-refresh` is used. The caller must present a secret passed via the Authorization HTTP Header.
The secret can be defined in the environment variable `NEWS_FEED_SYNC_SECRET`.
You can find an Azure Function App which can handle the refresh for you. The Function App could be a good starting point if you want to deploy an automated task which handles the refresh for you. You can find the Function App in `tasks/news-feed/refresh`

#### CMS Setup

- Access the Strapi CMS on [http://localhost:3000](http://localhost:3000) > Settings > Webhooks > Create a new Webhook
- Add a meaningful name
- Add the URL of the push notifications
  - For InnoVerse running in local development mode: `http://host.docker.internal:3000/api/hooks/push`
  - For the InnoVerse docker container: `http://innoverse:3000/api/hooks/push`
  - For InnoVerse production instance: `https://${YOUR-DOMAIN}/api/hooks/push`
- Add the header `Authorization`, the value should be the value of the environment
  variable `STRAPI_PUSH_NOTIFICATION_SECRET`
- Add all the events to the webhook

### Azure Application Insights

- Configure all required components for Azure Application Insights in the Azure Portal or via IaC.
- Set the following environment variables in the `.env` file:
  - `NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING`: Can be found in the Azure Portal
  - `NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY`: Can be found in the Azure Portal
  - `APP_INSIGHTS_SERVICE_NAME`: Can be chosen freely`
- Note: The logs will only be published if the environment variable `NODE_ENV` is set to `production`!

### Analyze the build

You can analyze the bundle size running `npm run build:analyze`, this will generate a report and can help identify large chunks.
The main focus should here be the `client` report, as we do not use any edge functions.

### Environment variables

| Name                                         | Required | Default | Stage     | Component |
| -------------------------------------------- | -------- | ------- | --------- | --------- |
| POSTGRES_USER                                | Y        | -       | Runtime   | Strapi    |
| POSTGRES_PASSWORD                            | Y        | -       | Runtime   | Strapi    |
| DATABASE_URL                                 | Y        | -       | Runtime   | Innoverse |
| REDIS_URL                                    | Y        | -       | Runtime   | Innoverse |
| NEXTAUTH_URL                                 | Y        | -       | Runtime   | Innoverse |
| NEWS_FEED_SYNC_SECRET                        | Y        | -       | Runtime   | Innoverse |
| NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT          | Y        | -       | Buildtime | Innoverse |
| NEXT_PUBLIC_STRAPI_ENDPOINT                  | Y        | -       | Buildtime | Innoverse |
| STRAPI_TOKEN                                 | Y        | -       | Runtime   | Innoverse |
| HTTP_BASIC_AUTH                              | Y        | -       | Runtime   | Innoverse |
| POSTGRES_USER                                | N        | -       | Runtime   | Innoverse |
| POSTGRES_PASSWORD                            | N        | -       | Runtime   | Innoverse |
| NEXTAUTH_AZURE_CLIENT_ID                     | N(\*)    | -       | Runtime   | Innoverse |
| NEXTAUTH_AZURE_CLIENT_SECRET                 | N(\*)    | -       | Runtime   | Innoverse |
| NEXTAUTH_AZURE_TENANT_ID                     | N(\*)    | -       | Runtime   | Innoverse |
| NEXTAUTH_SECRET                              | N(\*)    | -       | Runtime   | Innoverse |
| NEXTAUTH_GITLAB_ID                           | N(\*)    | -       | Runtime   | Innoverse |
| NEXTAUTH_GITLAB_SECRET                       | N(\*)    | -       | Runtime   | Innoverse |
| NEXTAUTH_GITLAB_URL                          | N(\*)    | -       | Runtime   | Innoverse |
| NEXTAUTH_CREDENTIALS_USERNAME                | N(\*)    | -       | Runtime   | Innoverse |
| NEXTAUTH_CREDENTIALS_PASSWORD                | N(\*)    | -       | Runtime   | Innoverse |
| NEXT_PUBLIC_VAPID_PUBLIC_KEY                 | N        | -       | Buildtime | Innoverse |
| VAPID_PRIVATE_KEY                            | N        | -       | Runtime   | Innoverse |
| VAPID_ADMIN_EMAIL                            | N        | -       | Runtime   | Innoverse |
| STRAPI_PUSH_NOTIFICATION_SECRET              | N        | -       | Runtime   | Innoverse |
| NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING   | N        | -       | Buildtime | Innoverse |
| NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY | N        | -       | Buildtime | Innoverse |
| APP_INSIGHTS_SERVICE_NAME                    | N        | -       | Runtime   | Innoverse |

(\*) Note: At least one authentication method must be enabled
