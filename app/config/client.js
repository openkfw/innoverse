/* eslint-disable @typescript-eslint/no-var-requires */

const { z } = require('zod');
const { env } = require('next-runtime-env');
const { createEnvConfig, createZodSchemaFromEnvConfig } = require('./envConfig');

const clientEnvConfig = createEnvConfig({
  variables: {
    // DO NOT remove the stage environment variable from this config
    STAGE: {
      defaultRule: z.enum(['development', 'test', 'build', 'production', 'lint']).default('development'),
      required: true,
    },

    // Strapi
    NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT: {
      defaultRule: z.string().default(''),
      required: true,
      stages: [],
    },
    NEXT_PUBLIC_STRAPI_ENDPOINT: {
      defaultRule: z.string().default(''),
      required: true,
      stages: [],
    },

    // Push notifications
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: {
      defaultRule: z.string().default(''),
      required: true,
      stages: [],
    },

    // Application insights
    NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING: {
      defaultRule: z.string().optional(),
    },
    NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY: {
      defaultRule: z.string().optional(),
    },

    // Version info
    NEXT_PUBLIC_BUILDTIMESTAMP: {
      defaultRule: z.string().optional(),
    },
    NEXT_PUBLIC_CI_COMMIT_SHA: {
      defaultRule: z.string().optional(),
    },
  },
  groups: [
    {
      variables: ['NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING', 'NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY'],
      mode: 'none_or_all',
      stages: ['development', 'test', 'production'],
      errorMessage: 'All Application Insights variables are required to enable Azure Application Insights',
    },
  ],
});

const schema = createZodSchemaFromEnvConfig(clientEnvConfig);

const clientConfig = schema.safeParse({
  NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING: env('NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING'),
  NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY: env('NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY'),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: env('NEXT_PUBLIC_VAPID_PUBLIC_KEY'),
  NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT: env('NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT'),
  NEXT_PUBLIC_STRAPI_ENDPOINT: env('NEXT_PUBLIC_STRAPI_ENDPOINT'),
  NEXT_PUBLIC_BUILDTIMESTAMP: env('NEXT_PUBLIC_BUILDTIMESTAMP'),
  NEXT_PUBLIC_CI_COMMIT_SHA: env('NEXT_PUBLIC_CI_COMMIT_SHA'),
});

if (!clientConfig.success) {
  console.error(clientConfig.error.issues);
  throw new Error('There is an error with the client environment variables');
}

module.exports.clientConfig = clientConfig.data;
