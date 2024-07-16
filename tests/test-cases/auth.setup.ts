import { test as setup, expect } from "@playwright/test";
import { GitlabLoginPage } from "../pageObjectModels/GitLabLoginPage";
import { LandingPage } from "../pageObjectModels/LandingPage";
import configuration from "../configuration";

const authFile = "./playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const loginPage = new GitlabLoginPage(page);
  await loginPage.goto();

  await loginPage.loginUsingCredentials(
    configuration.auth.username,
    configuration.auth.password
  );

  const landingPage = new LandingPage(page);
  const userMenu = landingPage.getUserMenu();

  await expect(userMenu).toBeVisible({ timeout: 20 * 1000 });

  // Saves storage state to file for other tests to use
  await page.context().storageState({ path: authFile });
});
