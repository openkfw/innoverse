const nextPackageFile = {
  filename: "app/package.json",
  type: "json",
};

const strapiPackageFile = {
  filename: "strapi/package.json",
  type: "json",
};

module.exports = {
  packageFiles: [nextPackageFile, strapiPackageFile],
  bumpFiles: [nextPackageFile, strapiPackageFile],
  types: [
    { type: "build", hidden: true },
    { type: "chore", section: "Chore" },
    { type: "pipeline", section: "Pipeline" },
    { type: "docs", section: "Documentation" },
    { type: "feat", section: "Features" },
    { type: "fix", section: "Bug Fixes" },
    { type: "perf", section: "Performance Improvements" },
    { type: "refactor", section: "Refactor" },
    { type: "style", hidden: true },
    { type: "security", section: "Security" },
    { type: "test", hidden: true },
    { type: "breaking", section: "Breaking Changes" },
  ],
};
