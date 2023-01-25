# nextjs skeleton

todo:

- description of skeleton
- dynamic badges

# Getting Started

Just created a new project using this template? Here are some pointers to get started:

#### Frontend

- Add members to the respository
- Create high level diagram in draw.io and upload it to the repo (optional)
- Test this template by `cd app` and start it by running `npm install` and `npm dev`. The app should be visible under `http://localhost:3000`. You should see a NextJs example app.
- Adapt the `package.json` to your requirements

#### API: Create API routes in NextJS

- Under the `pages/api` folder, create the respective API services
- Test them via direct browser requests or curl/postman

#### Containerize frontend locally

- Before creating the container, run `npm build` locally to make sure the application builds.
- Add additional entries to `.dockerignore` file in the `app` directory to ignore (sensitive) files during container build:
- Run `docker build .` in the `app` folder to verify that the container builds locally.
- Run `docker run ` with the respective image to see if the container runs

#### Database: Run DB using docker

- Run `docker-compose -f docker-compose.db.yaml up` in the root folder to spin up an empty database for development.

#### Database: Configure Prisma for your DB

- Create `.env` file in the `app` folder that points to a local database:

```bash
DATABASE_URL="postgresql://inno:hub@localhost:5432/mydb?schema=inno"
```

- Add `.env` to `.gitignore` if not present yet

- Create Prisma instance: `npm run prisma init --datasource-provider postgresql`
- Update the `schema.prisma` with the respective entities. Make sure that the data source is configured to Postgres and the respective environment variable.

```js
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- In the `repository` folder, create helper functions to create entities in the database
- In the `entities` folder, create helper responses for the API
- Create or copy a `seed.ts` to create a seeding script
- Copy `prisma.ts` from the template project into the `prisma` folder

#### Database: Migrations/Init your tables/data

You have 2 options for local development with a database now. Either start frontend locally and database from container. Or start everything in a container.

- Follow these steps for DB only (for local development)

```bash
# from root
# starts a "naked" postgre db
docker-compose -f docker-compose.db.yaml down
docker-compose -f docker-compose.db.yaml up -d

# init (migrate and seed) our database
cd frontend
npm run prisma migrate deploy
npm run prisma db seed

# get started with your local development
yarn dev
```

#### Quickstart for trying out the application locally without development

```bash
# from root
# starts postgre db and the app
# migrations are run on app startup
docker-compose up
```

#### Database: Accessing/Viewing the DB (Prisma Studio)

- Run `npm run prisma studio` to run the database browser and check that the seed data is in the database.

YOU MADE IT! (locally)
