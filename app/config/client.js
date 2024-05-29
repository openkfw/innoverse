/* eslint-disable @typescript-eslint/no-var-requires */

const { z } = require('zod');
const { someOrAllNotSet } = require('./helper');

const Config = z
  .object({
    NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT: z.string({
      errorMap: () => ({ message: 'NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT must be set!' }),
    }),
    NEXT_PUBLIC_STRAPI_ENDPOINT: z.string({
      errorMap: () => ({ message: 'NEXT_PUBLIC_STRAPI_ENDPOINT must be set!' }),
    }),
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: z
      .string({
        errorMap: () => ({ message: 'NEXT_PUBLIC_VAPID_PUBLIC_KEY must be set!' }),
      })
      .default(''),
    NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING: z
      .string({
        errorMap: () => ({ message: 'NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING must be set!' }),
      })
      .default(''),
    NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY: z
      .string({
        errorMap: () => ({ message: 'NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY must be set!' }),
      })
      .default(''),
  })
  .superRefine((values, ctx) => {
    // The checking of the counterparts is done in the server config to limit the possibility of cross-imports.
    // Assignment to default as
    const { NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING, NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY } = values;
    const appInsights = [NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING, NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY];

    if (someOrAllNotSet(appInsights)) {
      ctx.addIssue({
        message: 'All Application Insights variables are required to enable Azure Application Insights.',
        code: z.ZodIssueCode.custom,
        path: ['NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING', 'NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY'],
      });
    }
  });

const clientConfig = Config.safeParse({
  NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING: process.env.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING,
  NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY: process.env.NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY,
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT,
  NEXT_PUBLIC_STRAPI_ENDPOINT: process.env.NEXT_PUBLIC_STRAPI_ENDPOINT,
});

if (!clientConfig.success) {
  console.error(clientConfig.error.issues);
  throw new Error('There is an error with the client environment variables');
}

module.exports.clientConfig = clientConfig.data;
