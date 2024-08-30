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
    { type: "build", hidden: true }, // Build system changes will be hidden in the CHANGELOG
    { type: "chore", hidden: true }, // Chores will be hidden in the CHANGELOG
    { type: "pipeline", hidden: true }, // CI-related changes will be hidden in the CHANGELOG
    { type: "docs", section: "Documentation" }, // Documentation changes will show up under "Documentation"
    { type: "feat", section: "Features" }, // Features will show up under "Features" in the CHANGELOG
    { type: "fix", section: "Bug Fixes" }, // Bug Fixes will show up under "Bug Fixes" in the CHANGELOG
    { type: "perf", section: "Performance Improvements" }, // Performance Improvements will have their own section
    { type: "refactor", hidden: true }, // Refactoring will have their own section
    { type: "style", hidden: true }, // Style changes will be hidden in the CHANGELOG
    { type: "test", hidden: true }, // Test-related changes will be hidden in the CHANGELOG
    { type: "breaking", section: "Breaking Changes" }, // Breaking changes will have their own section
  ],
};
