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
    { type: "chore", hidden: true },
    { type: "pipeline", hidden: true },
    { type: "docs", section: "Documentation" },
    { type: "feat", section: "Features" },
    { type: "fix", section: "Bug Fixes" },
    { type: "perf", section: "Performance Improvements" },
    { type: "refactor", hidden: true },
    { type: "style", hidden: true },
    { type: "security", section: "Security" },
    { type: "test", hidden: true },
    { type: "breaking", section: "Breaking Changes" },
  ],
};
