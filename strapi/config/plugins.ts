export default ({ env }) => ({
  graphql: {
    config: {
      generateArtifacts: true,
      artifacts: {
        schema: "/opt/app/types/schema.graphql",
      },
    },
  },
  healthcheck: {
    enabled: true,
    resolve: "./src/plugins/healthcheck",
  },
  upload: {
    config: {
      breakpoints: {
        xxlarge: 2200,
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
      sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
    },
  },
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('SENDGRID_VERIFIED_EMAIL_ADDRESS'),
        defaultReplyTo: env('SENDGRID_VERIFIED_EMAIL_ADDRESS'), 
      },
    },
  },
});
