# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.4.1](https://github.com/openkfw/innoverse/compare/v1.4.0...v1.4.1) (2025-04-14)

### Chore

- remove migrations for posts and documentId ([#219](https://github.com/openkfw/innoverse/pull/219))

### Bug Fixes

- use NextJS Image for avatar images ([#216](https://github.com/openkfw/innoverse/issues/216))
- adjust form inputs styling ([#214](https://github.com/openkfw/innoverse/issues/214))
- pass the avatar to post creation ([#221](https://github.com/openkfw/innoverse/issues/221))
- remove unused fragment in graphql delete query ([#218](https://github.com/openkfw/innoverse/issues/218))

## [1.4.0](https://github.com/openkfw/innoverse/compare/v1.3.0...v1.4.0) (2025-04-08)

### Chore

- update strapi to version v5 ([#175](https://github.com/openkfw/innoverse/issues/175))
- create migration that moves posts to strapi ([#195](https://github.com/openkfw/innoverse/issues/195))
- create migration that migrates ids to documentIds after strapi v5 update ([#196](https://github.com/openkfw/innoverse/pull/196))

### Features

- implement user profile page to update profile picture and details ([#110](https://github.com/openkfw/innoverse/issues/110))

### Bug Fixes

- fix ordering of news feed, change updatedAt mapping ([#189](https://github.com/openkfw/innoverse/issues/189))
- rename id to documentId in strapi event after strapi v5 migration ([#200](https://github.com/openkfw/innoverse/issues/200))
- rename "status" Project field to "state" after strapi v5 migration ([#197](https://github.com/openkfw/innoverse/issues/197))
- set build env var for body size limit ([#207](https://github.com/openkfw/innoverse/issues/207))

### Refactor

- move the hide button, remove the comment header ([#185](https://github.com/openkfw/innoverse/issues/185))
- strapi graphql fetcher typing and error handling ([#186](https://github.com/openkfw/innoverse/issues/186))

## [1.3.0](https://github.com/openkfw/innoverse/compare/v1.2.0...v1.3.0) (2025-03-03)

### Features

- add button to collapse comment thread ([#176](https://github.com/openkfw/innoverse/issues/176))
- add initiatives page ([#107](https://github.com/openkfw/innoverse/issues/107))
- include discussions / comments in search ([#103](https://github.com/openkfw/innoverse/issues/103))
- initiatives search ([#109](https://github.com/openkfw/innoverse/issues/109))
- mention feature in comments thread ([#24](https://github.com/openkfw/innoverse/issues/24))

### Bug Fixes

- add a migration to update the usernames field in strapi ([#152](https://github.com/openkfw/innoverse/issues/152))
- adjust deleting comments ([#167](https://github.com/openkfw/innoverse/issues/167))
- bugs in comments ([#179](https://github.com/openkfw/innoverse/issues/179))
- change comment index type, fix multi filtering ([#140](https://github.com/openkfw/innoverse/issues/140))
- collaboration comment fixes ([#165](https://github.com/openkfw/innoverse/issues/165))
- fonts consistency ([#173](https://github.com/openkfw/innoverse/issues/173))
- get project name from entry directly instead of news feed context ([#163](https://github.com/openkfw/innoverse/issues/163))
- Layout shift in homepage ([#134](https://github.com/openkfw/innoverse/issues/134))
- limit comment levels to 2 for new comments ([#174](https://github.com/openkfw/innoverse/issues/174))
- move background arrows to news section so they show up but don't block interactive elements ([#148](https://github.com/openkfw/innoverse/issues/148))
- persist database in dev environment docker application ([#161](https://github.com/openkfw/innoverse/issues/161))

### Refactor

- database redesign ([#136](https://github.com/openkfw/innoverse/issues/136))
- migrate api routes to app router ([#160](https://github.com/openkfw/innoverse/issues/160))
- update next.js version to v15 ([#143](https://github.com/openkfw/innoverse/issues/143))

### Chore

- allow uppercase subject case ([#181](https://github.com/openkfw/innoverse/issues/181))
- introduce pnpm as a package manager ([#154](https://github.com/openkfw/innoverse/issues/154))

## [1.2.0](https://github.com/openkfw/innoverse/compare/v1.1.1...v1.2.0) (2024-11-19)

### Features

- add mininum length to the search field [#120](https://github.com/openkfw/innoverse/issues/120) PR[#123](https://github.com/openkfw/innoverse/pull/123)

### Bug Fixes

- error on user creation [#126](https://github.com/openkfw/innoverse/issues/126) PR[#128](https://github.com/openkfw/innoverse/pull/128) PR[#127](https://github.com/openkfw/innoverse/pull/127)
- feedback button now always visible [#97](https://github.com/openkfw/innoverse/issues/97) PR[#108](https://github.com/openkfw/innoverse/pull/108)
- fix project page scrolling [#124](https://github.com/openkfw/innoverse/issues/124) PR([#125](https://github.com/openkfw/innoverse/issues/125))
- remove time from main carousel pill [#94](https://github.com/openkfw/innoverse/issues/94) PR[#102](https://github.com/openkfw/innoverse/issues/102)
- standardize wording from updates to news de/en [#96](https://github.com/openkfw/innoverse/issues/96) PR[#106](https://github.com/openkfw/innoverse/issues/106)

### Refactor

- change color of the progress bar [#95](https://github.com/openkfw/innoverse/issues/95) PR[#105](https://github.com/openkfw/innoverse/pull/105)
- remove allowed_origins from next.config.js [#99](https://github.com/openkfw/innoverse/issues/99) PR[#100](https://github.com/openkfw/innoverse/pull/100)

## [1.1.1](https://github.com/openkfw/innoverse/compare/v1.1.0...v1.1.1) (2024-10-07)

### Bug Fixes

- rename allowed_origins in next.config.js [#87](https://github.com/openkfw/innoverse/issues/87) PR[#88](https://github.com/openkfw/innoverse/issues/88)

## [1.1.0](https://github.com/openkfw/innoverse/compare/v1.0.1...v1.1.0) (2024-10-03)

### Documentation

- update release process [#42](https://github.com/openkfw/innoverse/issues/42) PR[#72](https://github.com/openkfw/innoverse/issues/72)

### Features

- allow parallel editing and responding to comments [#46](https://github.com/openkfw/innoverse/issues/46) PR[#69](https://github.com/openkfw/innoverse/issues/69)
- highlight news feed search filter in results [#34](https://github.com/openkfw/innoverse/issues/34) PR[#61](https://github.com/openkfw/innoverse/issues/61)
- **next:** add liveness and readiness endpoints [#74](https://github.com/openkfw/innoverse/issues/74) PR[#75](https://github.com/openkfw/innoverse/issues/75)
- upgrade emoji version [#48](https://github.com/openkfw/innoverse/issues/48) PR[#67](https://github.com/openkfw/innoverse/issues/67)

### Bug Fixes

- add allowed origin and format env variable errors [#73](https://github.com/openkfw/innoverse/pull/73) PR[#76](https://github.com/openkfw/innoverse/pull/76)
- close input field when clicking on 'antworten' again [#45](https://github.com/openkfw/innoverse/pull/45) PR[#68](https://github.com/openkfw/innoverse/pull/68)
- use relative strapi urls in the redis cache [#14](https://github.com/openkfw/innoverse/issues/14) PR[#25](https://github.com/openkfw/innoverse/issues/25)
- remove unused database env vars [#81](https://github.com/openkfw/innoverse/issues/81) PR[#82](https://github.com/openkfw/innoverse/issues/82)
- display unsaved changes dialog when responding [#83](https://github.com/openkfw/innoverse/issues/83) PR[#85](https://github.com/openkfw/innoverse/pull/85)

## [1.0.1](https://github.com/openkfw/innoverse/compare/v1.0.0...v1.0.1) (2024-09-24)

### Pipelines

- update container registry for releases [#50](https://github.com/openkfw/innoverse/issues/50)
- include additional files in docker image [#43](https://github.com/openkfw/innoverse/issues/43)

## [1.0.0](https://github.com/openkfw/innoverse/compare/v0.1.0...v1.0.0) (2024-09-17)

### Documentation

- fix typos in startup guide [#38](https://github.com/openkfw/innoverse/issues/38)([63a9a85](https://github.com/openkfw/innoverse/commit/63a9a8590756599d896a7147ae07c54c251eb119))

### Features

- add new startup script and update docs [#38](https://github.com/openkfw/innoverse/issues/38)([052ca33](https://github.com/openkfw/innoverse/commit/052ca336b6931fe74e064b7af0beaa03cdc61f4f))
- add version page and display build info in html root element and include in docker image ([#31](https://github.com/openkfw/innoverse/issues/31)) ([d2f3ecc](https://github.com/openkfw/innoverse/commit/d2f3ecc5b50fd6f9d356420504f2ff243651ffe3))

### Bug Fixes

- improve variable checks ([d3d890c](https://github.com/openkfw/innoverse/commit/d3d890cfe84e64946d6ffe60ebe5fa4a17f37cb0))
- fix bug in anonymous parameter in update [#20](https://github.com/openkfw/innoverse/issues/20)

### Pipelines

- implement GitHub Actions [#4](https://github.com/openkfw/innoverse/issues/4)[#7](https://github.com/openkfw/innoverse/issues/7)[#6](https://github.com/openkfw/innoverse/pull/6)

## 0.1.0 (2024-08-30)

First release of open-sourced InnoVerse
