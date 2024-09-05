# InnoVerse Release guide

This guide descibribes how to create a new release of the InnoVerse platform.

To create a release

1. Creata a branch for this release
2. Bump the version, generate the release changelog and create a git tag:

   `npm run release`

3. Push changes and the newly created git tag:

   `git push --follow-tags origin <branch>`

4. Create a pull request
5. Wait for approval and then merge the the pull request
6. Visit this [repository's release page](https://github.com/openkfw/innoverse/releases)
7. Create a new release based on the new git tag

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
