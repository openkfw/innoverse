// Specifies the ruleset that makes up a valid git commit message
// Based on conventional commits: https://www.conventionalcommits.org/
// Commit message format: <type>(<scope>): <subject>

const Configuration = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type must be lowercase
    "type-case": [2, "always", ["lower-case"]],
    // Scope must be lowercase
    "scope-case": [2, "always", ["lower-case"]],
    // Subject may have any case
    "subject-case": [0],
    // Type must be in the following list
    "type-enum": [
      2, // Causes an error on violation
      "always",
      [
        "build", // Changes that affect the build system
        "chore", // No change to source code or tests, e.g. changing docker-compose, auxiliary tools, etc.
        "docs", // Documentation only changes
        "feat", // A new feature
        "fix", // A bug fix
        "perf", // A code change that improves performance
        "pipeline", // Changes to the pipeline or any CI/CD related change
        "refactor", // A code change that neither fixes a bug nor adds a feature
        "style", // Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
        "test", // Adding missing tests or correcting existing tests
      ],
    ],
    // Document suggestions for scopes
    "scope-enum": [
      0, // Disabled
      "always",
      ["next", "strapi", "redis", "postgres"],
    ],
  },
};

export default Configuration;
