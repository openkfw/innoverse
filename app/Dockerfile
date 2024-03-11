# Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# If using npm with a `package-lock.json` comment out above and use below instead
# COPY package.json package-lock.json ./ 
# RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT
ARG NEXT_PUBLIC_STRAPI_ENDPOINT
ARG NEXT_PUBLIC_STRAPI_TOKEN
ARG NEXT_PUBLIC_UMAMI_URL
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY
ARG VAPID_PRIVATE_KEY
ARG VAPID_ADMIN_EMAIL
ARG STRAPI_PUSH_NOTIFICATION_SECRET

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Run Prisma migration
RUN npm run prisma generate --schema ./repository/db/prisma/schema.prisma
# RUN yarn run prisma db push
# RUN yarn run prisma migrate dev --name init

ENV NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT ${NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT}
ENV NEXT_PUBLIC_STRAPI_ENDPOINT ${NEXT_PUBLIC_STRAPI_ENDPOINT}
ENV NEXT_PUBLIC_STRAPI_TOKEN ${NEXT_PUBLIC_STRAPI_TOKEN}
ENV NEXT_PUBLIC_UMAMI_URL ${NEXT_PUBLIC_UMAMI_URL}
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID ${NEXT_PUBLIC_UMAMI_WEBSITE_ID}
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY ${NEXT_PUBLIC_VAPID_PUBLIC_KEY}
ENV VAPID_PRIVATE_KEY ${VAPID_PRIVATE_KEY}
ENV VAPID_ADMIN_EMAIL ${VAPID_ADMIN_EMAIL}
ENV STRAPI_PUSH_NOTIFICATION_SECRET ${STRAPI_PUSH_NOTIFICATION_SECRET}


RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1



RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/repository/db/prisma ./repository/db/prisma

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD [  "npm", "run", "start:prod" ]