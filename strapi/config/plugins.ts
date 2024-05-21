export default {
  graphql: {
    config: {
      generateArtifacts: true,
      artifacts: {
        schema: "/opt/app/types/schema.graphql",
      },
    },
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
