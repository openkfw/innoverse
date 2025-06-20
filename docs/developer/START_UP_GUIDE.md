# InnoVerse Platform – Developer Startup Guide

Welcome to the InnoVerse Platform! This guide walks you through setting up the development environment and running the platform locally.

---

## 📚 Table of Contents

- [Quick Start (TL;DR)](#-quick-start-tldr)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Running the App Locally](#running-the-app-locally)
- [CMS Setup (Strapi)](#cms-setup-strapi)
- [Push Notifications](#push-notifications)
- [Viewing the Database](#viewing-the-database)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Final Verification](#-final-verification)

---

## 🚀 Quick Start (TL;DR)

1. Copy environment files

   ```bash
   cp ./postgres/.env.example ./postgres/.env
   cp ./app/.env.example ./app/.env
   cp ./strapi/.env.example ./strapi/.env
   ```

2. Fill out environment variables in all 3 .env files (check out [environment_variables.md](../environment_variables.md))

3. Start all services using Docker

   ```bash
   sh startDev.sh
   ```

4. Create an API Token in the strapi admin dashboard, set it in the ./app/.env under STRAPI_TOKEN, then restart the app container.

5. (Optional) Run app locally for hot-reloading

---

## 🛠️ Prerequisites

Ensure the following tools are installed:

- [Node.js](https://nodejs.org/) >= 18.x
- [pnpm](https://pnpm.io/) >= 8.x
- [Docker & Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## 🧰 Project Setup

1. Copy the example `.env` files into place:

   ```bash
   cp ./postgres/.env.example ./postgres/.env
   cp ./app/.env.example ./app/.env
   cp ./strapi/.env.example ./strapi/.env
   ```

2. Fill in any missing environment variables in each file.

3. Start the services:

   ```bash
   sh startDev.sh
   ```

This will launch:

- InnoVerse App
- Strapi CMS
- Redis
- PostgreSQL Database

---

## 🖥 (Optional) Running the App Locally

While Docker runs everything, it is faster to run the Next.js app locally, and it also includes hot reloading while developing:

```bash
cd ./app
pnpm install
pnpm run prisma migrate deploy
pnpm run dev
```

> 💡 The local app will be available at [http://localhost:3000](http://localhost:3000)

---

## ✍️ CMS Setup (Strapi)

1. Open [http://localhost:1337/admin](http://localhost:1337/admin)
2. Create a new admin user
3. Go to [API Tokens](http://localhost:1337/admin/settings/api-tokens)
4. Generate a new token:
   - Duration: Unlimited
   - Type: Full Access
5. Paste this token into `./app/.env` under `STRAPI_TOKEN`
6. After this, you need to start (or restart) your InnoVerse application

---

## 🔔 Push Notifications

1. Generate VAPID keys:

   ```bash
   npx web-push generate-vapid-keys
   ```

2. Add to `app/.env`:

   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VAPID_ADMIN_EMAIL="mailto:your_email"`

3. In Strapi admin:

   - Navigate to **Settings > Webhooks**
   - Create webhook with URL:
     - Local: `http://host.docker.internal:3000/api/hooks/push`
     - Docker container: `http://innoverse:3000/api/hooks/push`
     - InnoVerse production instance: `https://${YOUR-DOMAIN}/api/hooks/push`
   - Add header:
     - `Authorization: <STRAPI_PUSH_NOTIFICATION_SECRET>`
   - Enable all events

---

## Email Notifications

1. Set the correct environment variables in the `/app/.env` file as mentioned [here](../environment_variables.md#-email--notification-configs)
2. The webhook for weekly email notifications is created automatically, but also needs to be populated with similar values. The placeholder value in the URL needs to be replaced with the correct origin (`http://innoverse:3000`, `https://${YOUR-DOMAIN}`, etc). Currently, the authorization header reuses `STRAPI_PUSH_NOTIFICATION_SECRET`

---

## 🧪 Viewing the Database

Use Prisma Studio to browse the database:

```bash
cd ./app
pnpm run prisma studio
```

To apply schema changes:

```bash
pnpm run prisma migrate deploy
```

---

## Azure Application Insights

> **Optional:**
> Application Insights is **not required** for the application to run.  
> If telemetry and performance monitoring are not needed, you can **skip this section** entirely.  
> Simply leave the related environment variables **unset** or remove them from the `.env` file — the app will automatically skip initializing Application Insights in that case.

- Configure all required components for Azure Application Insights in the Azure Portal or via IaC.
- Set the following environment variables in the `.env` file:
  - `NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING`: Can be found in the Azure Portal
  - `NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY`: Can be found in the Azure Portal
  - `APP_INSIGHTS_SERVICE_NAME`: Can be chosen freely
- Note: The logs will only be published if the environment variable `NODE_ENV` is set to `production`!

## Analyze the build

You can analyze the bundle size running `pnpm run build:analyze`, this will generate a report and can help identify large chunks.
The main focus should here be the `client` report, as we do not use any edge functions.

## 🔐 Environment Variables

For a full list, see [environment_variables.md](../environment_variables.md)

Some critical ones include:

- `DATABASE_URL`
- `STRAPI_TOKEN`
- `REDIS_URL`
- `NEXTAUTH_URL`
- `STRAPI_PUSH_NOTIFICATION_SECRET`

---

## ❌ Troubleshooting

**Issue:** App can't connect to Strapi\
**Fix:** Ensure `STRAPI_TOKEN` is valid and present in `/app/.env`

**Issue:** Database connection refused\
**Fix:** Docker not running or invalid `DATABASE_URL`

**Issue:** Webhook errors in Strapi\
**Fix:** Ensure `Authorization` header matches `STRAPI_PUSH_NOTIFICATION_SECRET`

---

## ✅ Final Verification

- [ ] App loads on http://localhost:3000
- [ ] Strapi is accessible at http://localhost:1337/admin
- [ ] Prisma migration runs successfully
- [ ] .env files are filled with all required variables
- [ ] The app can connect to strapi (via the STRAPI_TOKEN)

Happy developing with InnoVerse! ✨
