ARG BUILDTIMESTAMP
ARG CI_COMMIT_SHA

FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
ARG BUILDTIMESTAMP
ARG CI_COMMIT_SHA
ARG BODY_SIZE_LIMIT

# Install pnpm
RUN npm install -g pnpm

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

ENV NEXT_PUBLIC_BUILDTIMESTAMP ${BUILDTIMESTAMP}
ENV NEXT_PUBLIC_CI_COMMIT_SHA ${CI_COMMIT_SHA}
ENV NEXT_PUBLIC_BODY_SIZE_LIMIT ${BODY_SIZE_LIMIT}

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Run Prisma migration
RUN pnpm run prisma generate --schema ./repository/db/prisma/schema.prisma
# RUN pnpm run prisma db push
# RUN pnpm run prisma migrate dev --name init

RUN pnpm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
ARG BUILDTIMESTAMP
ARG CI_COMMIT_SHA



ENV NEXT_PUBLIC_BUILDTIMESTAMP ${BUILDTIMESTAMP}
ENV NEXT_PUBLIC_CI_COMMIT_SHA ${CI_COMMIT_SHA}
ENV NEXT_PUBLIC_BODY_SIZE_LIMIT ${BODY_SIZE_LIMIT}

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install pnpm
RUN npm install -g pnpm


# You only need to copy next.config.ts if you are NOT using the default configuration
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/config ./config
COPY --from=builder /app/public/fonts ./public/fonts
COPY --from=builder /app/public/manifest.json ./public/manifest.json
COPY --from=builder /app/public/robots.txt ./public/robots.txt
COPY --from=builder /app/public/sw.js ./public/sw.js
COPY --from=builder --chown=nextjs:nodejs /app/public/images ./public/images

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


CMD [ "pnpm", "run", "start:migrate:prod" ]