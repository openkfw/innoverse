# InnoVerse Release guide

This guide descibribes how to create a new release of the InnoVerse platform.

To create a release

1. Create a branch for this release:

   `git checkout -b <branch_name>`

2. Bump the version, generate the release changelog and create a git tag with the following command:

   `npm run release`

   This bumps the version according to semver. Alternatively a specific version can be set using:

   `npm run release --release-as <release_version>`

   For more options, see the [commit and tag version github page](https://github.com/absolute-version/commit-and-tag-version/tree/master?tab=readme-ov-file#cli-usage)

3. Review the changelog, edit it and commit if needed
4. Push changes **without** the newly created tag (we create the tag on GitHub later)

   `git push`

5. Create a pull request
6. Wait for approval
7. Set the branch merge strategy to squash and merge (squashed commit message: `chore(release): <release_version>`)
8. Visit this [repository's release page](https://github.com/openkfw/innoverse/releases)
9. Create a new release

- Create a new git tag pointing to correct commit on the main branch:
- Check the option "Create a discussion for this release" and select the category "Announcements"

## Configuration

Which commits should be part of the changelog and what headings are part of a releases's changelog can be configured in the [.versionrc.js](/.versionrc.js) file

## In-depth explanation

The command `npm run release` command does the following:

- Extract the versions stored in `app/package.json` and `strapi/package.json`
- Bump the version number up according to semantic versioning
- Write the new version number in the two `package.json` files from above
- Append the changes to the `CHANGELOG.md`
- Create a commit `chore(release): <version>`
- Create a git tag for this commit using this version number

The version bump and the changelog generation are based on the commits added since the last git tag. We use [conventional commits](https://www.conventionalcommits.org/) in combination with the [commit-and-tag-version package](https://github.com/absolute-version/commit-and-tag-version) to achieve this.
