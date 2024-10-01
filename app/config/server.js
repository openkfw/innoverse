/* eslint-disable @typescript-eslint/no-var-requires */

const { z } = require('zod');
const { clientConfig } = require('./client');
const { someOrAllNotSet } = require('./helper');
const { cond } = require('lodash');
const { env } = require('next-runtime-env');

if (typeof window !== 'undefined') {
  throw new Error('The server config should not be imported on the frontend!');
}

const RequiredBuildTimeEnv = z
  .object({
    STAGE: z.enum(['development', 'test', 'build', 'production', 'lint']).default('development'),
    NEXT_PUBLIC_BUILDTIMESTAMP: z
      .string({ errorMap: () => ({ message: 'NEXT_PUBLIC_BUILDTIMESTAMP is not set' }) })
      .default(''),
    NEXT_PUBLIC_CI_COMMIT_SHA: z
      .string({ errorMap: () => ({ message: 'NEXT_PUBLIC_CI_COMMIT_SHA is not set' }) })
      .default('')
  })
  .superRefine((values, ctx) => {
    const { STAGE } = values;
    const requiredKeys = ['NEXT_PUBLIC_BUILDTIMESTAMP', 'NEXT_PUBLIC_CI_COMMIT_SHA'];

    const checkAndAddIssue = (condition, message, ctx) => {
      if (condition && STAGE === 'build') {
        ctx.addIssue({
          message: message,
          code: z.ZodIssueCode.custom,
        });
      }
    };

    const validateEnvVariables = (ctx) => {
      requiredKeys.forEach((env) =>
        checkAndAddIssue(
          values[env].trim().length === 0,
          `Required build time environment variable ${env} is not set`,
          ctx,
        ),
      );
    };

    validateEnvVariables(ctx);
  });

// Required at run-time
const RequiredRunTimeEnv = z
  .object({
    DATABASE_URL: z.string().default(''),
    POSTGRES_USER: z.string({ errorMap: () => ({ message: 'POSTGRES_USER must be set!' }) }).default(''),
    POSTGRES_PASSWORD: z.string({ errorMap: () => ({ message: 'POSTGRES_PASSWORD must be set!' }) }).default(''),
    NEXTAUTH_URL: z.string({ errorMap: () => ({ message: 'NEXTAUTH_URL must be set!' }) }).default(''),
    NEXTAUTH_SECRET: z.string({ errorMap: () => ({ message: 'NEXTAUTH_SECRET must be set!' }) }).default(''),
    STRAPI_TOKEN: z.string({ errorMap: () => ({ message: 'STRAPI_TOKEN must be set!' }) }).default(''),
    HTTP_BASIC_AUTH: z.string().default(''),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    STAGE: z.enum(['development', 'test', 'build', 'production', 'lint']).default('development'),
    REDIS_URL: z.string({ errorMap: () => ({ message: 'REDIS_URL must be set!' }) }).default(''),
    NEWS_FEED_SYNC_SECRET: z
      .string({ errorMap: () => ({ message: 'NEWS_FEED_SYNC_SECRET must be set!' }) })
      .default(''),
  })
  .superRefine((values, ctx) => {
    const {
      DATABASE_URL,
      NEXTAUTH_URL,
      NEXTAUTH_SECRET,
      STRAPI_TOKEN,
      HTTP_BASIC_AUTH,
      STAGE,
      REDIS_URL,
      NEWS_FEED_SYNC_SECRET,
    } = values;
    const required = [
      DATABASE_URL,
      NEXTAUTH_URL,
      NEXTAUTH_SECRET,
      STRAPI_TOKEN,
      HTTP_BASIC_AUTH,
      REDIS_URL,
      NEWS_FEED_SYNC_SECRET,
    ];

    const checkAndAddIssue = (condition, message, ctx) => {
      if (condition && STAGE !== 'build' && STAGE !== 'lint') {
        ctx.addIssue({
          message: message,
          code: z.ZodIssueCode.custom,
        });
      }
    };

    const validateEnvVariables = (required, DATABASE_URL, REDIS_URL, HTTP_BASIC_AUTH, ctx) => {
      checkAndAddIssue(
        required.some((el) => el === ''),
        'Not all required env variables are set!',
        ctx,
      );

      checkAndAddIssue(
        !/^(postgres|postgresql):\/\//.test(DATABASE_URL),
        'DB_URL is not a valid postgres connection string',
        ctx,
      );

      checkAndAddIssue(!/^(redis):\/\//.test(REDIS_URL), 'REDIS_URL is not a valid postgres connection string', ctx);

      checkAndAddIssue(
        !/(.+?):(.+?)$/.test(HTTP_BASIC_AUTH),
        'HTTP_BASIC_AUTH must be of the format username:password',
        ctx,
      );
    };

    validateEnvVariables(required, DATABASE_URL, REDIS_URL, HTTP_BASIC_AUTH, ctx);
  });

// Optional at build-time
const OptionalBuildTimeEnv = z
  .object({
    ALLOWED_ORIGINS: z
      .string()
      .transform((origins) => origins.split(','))
      .optional()
  })

// Optional at run-time
const OptionalRunTimeEnv = z
  .object({
    NEXTAUTH_AZURE_CLIENT_ID: z.string().default(''),
    NEXTAUTH_AZURE_CLIENT_SECRET: z.string().default(''),
    NEXTAUTH_AZURE_TENANT_ID: z.string().default(''),
    NEXTAUTH_GITLAB_ID: z.string().default(''),
    NEXTAUTH_GITLAB_SECRET: z.string().default(''),
    NEXTAUTH_GITLAB_URL: z.string().default(''),
    NEXTAUTH_CREDENTIALS_USERNAME: z.string().default(''),
    NEXTAUTH_CREDENTIALS_PASSWORD: z.string().default(''),
    VAPID_PRIVATE_KEY: z.string().default(''),
    VAPID_ADMIN_EMAIL: z.string().default(''),
    STRAPI_PUSH_NOTIFICATION_SECRET: z.string().default(''),
    APP_INSIGHTS_SERVICE_NAME: z.string().default(''),
    ANALYZE: z.boolean().default(false),
  })
  .superRefine((values, ctx) => {
    //Ignore the validation at build stage
    if (process.env.STAGE === 'build' || process.env.STAGE === 'lint') return true;
    //For each auth option we check if eiter all required fields or set or none (= method disabled)
    const {
      NEXTAUTH_AZURE_CLIENT_ID,
      NEXTAUTH_AZURE_CLIENT_SECRET,
      NEXTAUTH_AZURE_TENANT_ID,
      NEXTAUTH_GITLAB_ID,
      NEXTAUTH_GITLAB_SECRET,
      NEXTAUTH_GITLAB_URL,
      NEXTAUTH_CREDENTIALS_USERNAME,
      NEXTAUTH_CREDENTIALS_PASSWORD,
      VAPID_PRIVATE_KEY,
      VAPID_ADMIN_EMAIL,
      APP_INSIGHTS_SERVICE_NAME,
      STRAPI_PUSH_NOTIFICATION_SECRET,
    } = values;
    const {
      NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING,
      NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY,
      NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    } = clientConfig;

    const azureAuth = [NEXTAUTH_AZURE_CLIENT_ID, NEXTAUTH_AZURE_CLIENT_SECRET, NEXTAUTH_AZURE_TENANT_ID];
    const gitlabAuth = [NEXTAUTH_GITLAB_ID, NEXTAUTH_GITLAB_SECRET, NEXTAUTH_GITLAB_URL];
    const credentialsAuth = [NEXTAUTH_CREDENTIALS_USERNAME, NEXTAUTH_CREDENTIALS_PASSWORD];
    const allAuthMethods = [...azureAuth, ...gitlabAuth, ...credentialsAuth];
    const notificationsEnv = [
      VAPID_PRIVATE_KEY,
      VAPID_ADMIN_EMAIL,
      NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      STRAPI_PUSH_NOTIFICATION_SECRET,
    ];
    const appInsightsEnv = [NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING, NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY];

    // Check that at least one auth method is enabled
    if (!azureAuth.every((el) => el === '') && azureAuth.some((el) => el === '')) {
      ctx.addIssue({
        message: 'All Azure variables are required to enable Azure SSO.',
        code: z.ZodIssueCode.custom,
        path: ['NEXTAUTH_AZURE_CLIENT_ID', 'NEXTAUTH_AZURE_CLIENT_SECRET', 'NEXTAUTH_AZURE_TENANT_ID'],
      });
    }

    if (!gitlabAuth.every((el) => el === '') && gitlabAuth.some((el) => el === '')) {
      ctx.addIssue({
        message: 'All GitLab variables are required to enable GitLab SSO.',
        code: z.ZodIssueCode.custom,
        path: ['NEXTAUTH_GITLAB_ID', 'NEXTAUTH_GITLAB_SECRET', 'NEXTAUTH_GITLAB_URL'],
      });
    }

    if (!credentialsAuth.every((el) => el === '') && credentialsAuth.some((el) => el === '')) {
      ctx.addIssue({
        message: 'All relevant variables are required to enable login via credentials',
        code: z.ZodIssueCode.custom,
        path: ['NEXTAUTH_CREDENTIALS_USERNAME', 'NEXTAUTH_CREDENTIALS_PASSWORD'],
      });
    }

    if (allAuthMethods.every((el) => el === '')) {
      ctx.addIssue({
        message: 'At least one authentication method must be enabled!',
        code: z.ZodIssueCode.custom,
        path: [],
      });
    }

    // Some env variables require their counterpart in the UI be set and vice versa.
    // If notifications enabled...
    if (someOrAllNotSet(notificationsEnv)) {
      ctx.addIssue({
        message:
          'Looks like the required environment variables for push-notifications are not set in the UI but in the server (or vice versa)',
        code: z.ZodIssueCode.custom,
        path: [
          'VAPID_PRIVATE_KEY',
          'VAPID_ADMIN_EMAIL',
          'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
          'STRAPI_PUSH_NOTIFICATION_SECRET',
        ],
      });
    }

    // If ApplicationInsights enabled ...
    if (!appInsightsEnv.every((el) => el === '') || APP_INSIGHTS_SERVICE_NAME) {
      if (APP_INSIGHTS_SERVICE_NAME && appInsightsEnv.some((el) => el === '')) {
        ctx.addIssue({
          message:
            'Looks like the required environment variables for ApplicationInsights are not set in the UI but in the server (or vice versa)',
          code: z.ZodIssueCode.custom,
          path: ['APP_INSIGHTS_SERVICE_NAME'],
        });
      }
    }
  });

// If we run 'next build' the required runtime env variables can be empty, at run-time checks will be applied...
// NEXT_PUBLIC_* are checked in client.js
const requiredBuildEnv = RequiredBuildTimeEnv.parse(process.env);
const optionalBuildTimeEnv = OptionalBuildTimeEnv.parse(process.env);
const optionalRunTimeEnv = OptionalRunTimeEnv.parse(process.env);
const requiredRunTimeEnv = RequiredRunTimeEnv.parse(process.env);

module.exports.serverConfig = {
  ...requiredBuildEnv,
  ...optionalBuildTimeEnv,
  ...requiredRunTimeEnv,
  ...optionalRunTimeEnv,
};
