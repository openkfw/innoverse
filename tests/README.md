# Playwright End-to-End Tests

This repository contains the end-to-end tests for the innobuddy web app. The tests are written using [Playwright](https://playwright.dev/).

## Setup

To set up the test environment, follow these steps:

1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install`
3. Set following environment variables in `../app/.env`
   - `NEXTAUTH_CREDENTIALS_USERNAME=<Username for test user>`
   - `NEXTAUTH_CREDENTIALS_PASSWORD=<Password for test user>`
4. Set the same credentials in `./configuration.ts` for Playwright to authenticate with it

## Running Tests

To run the tests, execute the following command:

```bash
npx playwright test
```

To **launch the Playwright UI** for developing tests run:

```bash
npx playwright test --ui
```

You can also run tests in a specific file by providing the file path:

```bash
npx playwright test test-cases/news-page.spec.ts
```

## Configuration

### Test Projects (Devices)

Playwright is currently configured for one test project:

- Chromium (Desktop Chrome)
  - as we need to ensure Innobuddy works on Edge.

The configuration can be found in `playwright.config.ts`.
It might be worth adding a test project for mobile chromium as well.

### Authentication

To share authentication/session information throughout test cases, we use the strategy described in the [Playwright Authentication docs](https://playwright.dev/docs/auth)

### Timeout

Tests are configured to have a timeout of 45 seconds, an increase from the default 30 seconds, to accommodate the additional load when tests are run in parallel.
This setting helps prevent timeouts due to slower execution under heavy load.

The configuration can be found in `playwright.config.ts`.

## Test Design / Adding tests

When adding new tests, please

- look at the [Playwright documentation on best practices](https://playwright.dev/docs/best-practices)
- and how to write tests using the [Page Object Model (POM)](https://playwright.dev/docs/pom)
- keep in mind that end-to-end tests are expensive (timewise) to run and therefore should be kept to a reasonable minimum
