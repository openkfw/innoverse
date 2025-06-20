# InnoVerse Platform – Environment Variables

This document lists and describes all environment variables used across the InnoVerse Platform. Variables are grouped by type.

---

## 📦 Common Structure

| Name                    | Required | Stage   | Component | Description                                     |
| ----------------------- | -------- | ------- | --------- | ----------------------------------------------- |
| `POSTGRES_USER`         | Yes      | Runtime | Strapi    | Database username for Strapi's DB connection    |
| `POSTGRES_PASSWORD`     | Yes      | Runtime | Strapi    | Password for the database user                  |
| `DATABASE_URL`          | Yes      | Runtime | InnoVerse | Full PostgreSQL connection URI for Prisma       |
| `REDIS_URL`             | Yes      | Runtime | InnoVerse | Redis instance URI used for caching news feed   |
| `NEXTAUTH_URL`          | Yes      | Runtime | InnoVerse | Public URL for NextAuth callbacks               |
| `NEWS_FEED_SYNC_MONTHS` | Yes      | Runtime | InnoVerse | Number of months to backfill/sync news feed     |
| `STRAPI_TOKEN`          | Yes      | Runtime | InnoVerse | API token used by the frontend to access Strapi |
| `HTTP_BASIC_AUTH`       | Yes      | Runtime | InnoVerse | Enables basic auth protection for app routes    |

---

## 🧱 Build-Time Variables

| Name                                  | Required | Stage     | Component | Description                                    |
| ------------------------------------- | -------- | --------- | --------- | ---------------------------------------------- |
| `NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT` | Yes      | Buildtime | InnoVerse | Public GraphQL endpoint for Strapi             |
| `NEXT_PUBLIC_STRAPI_ENDPOINT`         | Yes      | Buildtime | InnoVerse | Base URL for Strapi APIs                       |
| `NEXT_PUBLIC_BUILDTIMESTAMP`          | Yes      | Buildtime | InnoVerse | Timestamp of latest build for cache/versioning |
| `NEXT_PUBLIC_CI_COMMIT_HASH`          | Yes      | Buildtime | InnoVerse | Git commit hash for the build version          |
| `NEXT_PUBLIC_BODY_SIZE_LIMIT`         | Yes      | Buildtime | InnoVerse | Maximum accepted body size for API requests    |

---

## 🔑 Optional Auth Configs

| Name                            | Required | Stage   | Component | Description                                    |
| ------------------------------- | -------- | ------- | --------- | ---------------------------------------------- |
| `NEXTAUTH_AZURE_CLIENT_ID`      | Optional | Runtime | InnoVerse | Azure AD Client ID                             |
| `NEXTAUTH_AZURE_CLIENT_SECRET`  | Optional | Runtime | InnoVerse | Azure AD Client Secret                         |
| `NEXTAUTH_AZURE_TENANT_ID`      | Optional | Runtime | InnoVerse | Azure Tenant ID for Azure AD auth              |
| `NEXTAUTH_SECRET`               | Optional | Runtime | InnoVerse | Encryption key for NextAuth sessions           |
| `NEXTAUTH_GITLAB_ID`            | Optional | Runtime | InnoVerse | GitLab App Client ID                           |
| `NEXTAUTH_GITLAB_SECRET`        | Optional | Runtime | InnoVerse | GitLab App Client Secret                       |
| `NEXTAUTH_GITLAB_URL`           | Optional | Runtime | InnoVerse | Custom GitLab instance URL (if not gitlab.com) |
| `NEXTAUTH_CREDENTIALS_USERNAME` | Optional | Runtime | InnoVerse | Username for credentials-based auth            |
| `NEXTAUTH_CREDENTIALS_PASSWORD` | Optional | Runtime | InnoVerse | Password for credentials-based auth            |

---

## 🔔 Push Notification Configs

| Name                              | Required | Stage     | Component | Description                                             |
| --------------------------------- | -------- | --------- | --------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`    | Optional | Buildtime | InnoVerse | Public key for Web Push API                             |
| `VAPID_PRIVATE_KEY`               | Optional | Runtime   | InnoVerse | Private key for signing Web Push messages               |
| `VAPID_ADMIN_EMAIL`               | Optional | Runtime   | InnoVerse | Email used in VAPID claims                              |
| `STRAPI_PUSH_NOTIFICATION_SECRET` | Optional | Runtime   | InnoVerse | Secret string used to authenticate Strapi push webhooks |

---

## 📊 Monitoring & Insights

| Name                                           | Required | Stage     | Component | Description                                    |
| ---------------------------------------------- | -------- | --------- | --------- | ---------------------------------------------- |
| `NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING`   | Optional | Buildtime | InnoVerse | Azure App Insights connection string           |
| `NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY` | Optional | Buildtime | InnoVerse | Azure App Insights instrumentation key         |
| `APP_INSIGHTS_SERVICE_NAME`                    | Optional | Runtime   | InnoVerse | Logical name of the app for insights dashboard |


## 📧 Email & Notification Configs

| Name                          | Required | Stage   | Component | Description                                 |
| ----------------------------- | -------- | ------- | --------- | ------------------------------------------- |
| `SMTP_HOST`                   | Yes      | Runtime | InnoVerse | SMTP server host for sending emails         |
| `SMTP_USER`                   | Yes      | Runtime | InnoVerse | Username for SMTP authentication            |
| `SMTP_PASS`                   | Yes      | Runtime | InnoVerse | Password for SMTP authentication            |
| `NOTIFICATIONS_EMAIL_ADDRESS` | Yes      | Runtime | InnoVerse | Sender address used for notification emails |

---

> 🔐 **Note:** At least one `NEXTAUTH_*` provider config must be enabled for authentication to function.
