export default {
  graphql: {
    config: {
      generateArtifacts: true,
      artifacts: {
        schema: "/tmp/schema.graphql",
      },
      v4CompatibilityMode: true,
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
};
