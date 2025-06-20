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

```bash
# 1. Copy environment files
cp ./postgres/.env.example ./postgres/.env
cp ./app/.env.example ./app/.env
cp ./strapi/.env.example ./strapi/.env

# 2. Start all services using Docker
sh startDev.sh

# 3. (Optional) Run app locally for hot-reloading
cd app
pnpm install
pnpm run dev
```

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

## 🖥 Running the App Locally

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
   - Add header:
     - `Authorization: <STRAPI_PUSH_NOTIFICATION_SECRET>`
   - Enable all events

---

## 🧪 Viewing the Database

Use Prisma Studio to browse the database:

```bash
cd ./app
pnpm run prisma studio
```

To apply schema changes:

```bash
pnpm run prisma migrate dev
```

---

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
