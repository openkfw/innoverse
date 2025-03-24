/* eslint-disable @typescript-eslint/no-var-requires */

const { z } = require('zod');
const { createEnvConfig, createZodSchemaFromEnvConfig } = require('./envConfig');
const { clientConfig } = require('./client');
const { formatErrors } = require('./helper');

if (typeof window !== 'undefined') {
  throw new Error('The server config should not be imported on the frontend!');
}

const runtimeStages = ['development', 'test', 'production'];

const serverEnvConfig = createEnvConfig({
  variables: {
    // DO NOT remove the stage environment variable from this config
    STAGE: {
      defaultRule: z.enum(['development', 'test', 'build', 'production', 'lint']).default('development'),
      required: true,
    },

    // Node
    NODE_ENV: {
      stages: runtimeStages,
      defaultRule: z.enum(['development', 'production', 'test']).default('development'),
      required: true,
    },

    // Version info
    NEXT_PUBLIC_BUILDTIMESTAMP: {
      stages: ['build'],
      defaultRule: z.string().default(''),
      required: true,
    },
    NEXT_PUBLIC_CI_COMMIT_SHA: {
      stages: ['build'],
      defaultRule: z.string().default(''),
      required: true,
    },

    // Database
    DATABASE_URL: {
      stages: runtimeStages,
      defaultRule: z.string().default(''),
      regex: /^(postgres|postgresql):\/\//,
      required: true,
    },

    // Strapi
    STRAPI_TOKEN: {
      stages: runtimeStages,
      defaultRule: z.string().default(''),
      required: true,
    },

    // Nextauth configuration
    NEXTAUTH_URL: {
      stages: runtimeStages,
      defaultRule: z.string().default(''),
      required: true,
    },
    NEXTAUTH_SECRET: {
      stages: runtimeStages,
      defaultRule: z.string().default(''),
      required: true,
    },
    HTTP_BASIC_AUTH: {
      stages: runtimeStages,
      defaultRule: z.string().default(''),
      regex: /(.+?):(.+?)$/,
      required: true,
    },

    // Redis
    REDIS_URL: {
      stages: runtimeStages,
      defaultRule: z.string().default(''),
      regex: /^(redis):\/\//,
      required: true,
    },
    NEWS_FEED_SYNC_SECRET: {
      stages: runtimeStages,
      defaultRule: z.string().default(''),
      required: true,
    },
    NEWS_FEED_SYNC_MONTHS: {
      stages: runtimeStages,
      defaultRule: z.string().default('36'),
      required: true,
    },

    // Azure auth
    NEXTAUTH_AZURE_CLIENT_ID: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    NEXTAUTH_AZURE_CLIENT_SECRET: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    NEXTAUTH_AZURE_TENANT_ID: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },

    // Gitlab auth
    NEXTAUTH_GITLAB_ID: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    NEXTAUTH_GITLAB_SECRET: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    NEXTAUTH_GITLAB_URL: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },

    // Credential auth
    NEXTAUTH_CREDENTIALS_USERNAME: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    NEXTAUTH_CREDENTIALS_PASSWORD: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },

    // Push notifications
    VAPID_PRIVATE_KEY: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    VAPID_ADMIN_EMAIL: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    STRAPI_PUSH_NOTIFICATION_SECRET: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: {
      stage: runtimeStages,
      defaultRule: z.string().optional(),
    },

    // Application Insights
    APP_INSIGHTS_SERVICE_NAME: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },
    NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY: {
      stages: runtimeStages,
      defaultRule: z.string().optional(),
    },

    // Bundle analyzer
    ANALYZE: {
      stages: runtimeStages,
      defaultRule: z.boolean().optional().default(false),
    },
  },
  groups: [
    {
      variables: ['NEXTAUTH_AZURE_CLIENT_ID', 'NEXTAUTH_AZURE_CLIENT_SECRET', 'NEXTAUTH_AZURE_CLIENT_SECRET'],
      mode: 'none_or_all',
      stages: runtimeStages,
      errorMessage: 'Azure auth env variables not all defined',
    },
    {
      variables: ['NEXTAUTH_GITLAB_URL', 'NEXTAUTH_GITLAB_ID', 'NEXTAUTH_GITLAB_SECRET'],
      mode: 'none_or_all',
      stages: runtimeStages,
      errorMessage: 'Gitlab auth env variables not all defined',
    },
    {
      variables: ['NEXTAUTH_CREDENTIALS_USERNAME', 'NEXTAUTH_CREDENTIALS_PASSWORD'],
      mode: 'none_or_all',
      stages: runtimeStages,
      errorMessage: 'Credential auth env variables not all defined',
    },
    {
      variables: [
        'NEXTAUTH_AZURE_CLIENT_ID',
        'NEXTAUTH_AZURE_CLIENT_SECRET',
        'NEXTAUTH_AZURE_CLIENT_SECRET',
        'NEXTAUTH_GITLAB_URL',
        'NEXTAUTH_GITLAB_ID',
        'NEXTAUTH_GITLAB_SECRET',
        'NEXTAUTH_CREDENTIALS_USERNAME',
        'NEXTAUTH_CREDENTIALS_PASSWORD',
      ],
      mode: 'at_least_one',
      stages: runtimeStages,
      errorMessage: 'At least one type of authentication has to be set',
    },
    {
      variables: [
        'VAPID_PRIVATE_KEY',
        'VAPID_ADMIN_EMAIL',
        'STRAPI_PUSH_NOTIFICATION_SECRET',
        'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
      ],
      mode: 'none_or_all',
      stages: runtimeStages,
      errorMessage:
        'Looks like the required environment variables for push-notifications are not set in the UI but in the server (or vice versa)',
    },
    {
      variables: [
        'APP_INSIGHTS_SERVICE_NAME',
        'NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING',
        'NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY',
      ],
      mode: 'none_or_all',
      stages: runtimeStages,
      errorMessage:
        'Looks like the required environment variables for ApplicationInsights are not set in the UI but in the server (or vice versa)',
    },
  ],
});

const schema = createZodSchemaFromEnvConfig(serverEnvConfig);
const serverConfig = schema.safeParse({
  ...process.env,
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: clientConfig.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING: clientConfig.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING,
  NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY: clientConfig.NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY,
});

if (!serverConfig.success) {
  const fatalErrorExists = serverConfig.error.issues.some((issue) => issue.fatal);
  const formatedErrors = formatErrors(serverConfig.error);
  if (fatalErrorExists) {
    console.error(formatedErrors);
    process.exit(1);
  } else {
    console.warn(formatedErrors);
  }
  throw new Error('There is an error with the server environment variables');
}

module.exports.serverConfig = serverConfig.data;
