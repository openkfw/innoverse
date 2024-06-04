import { Page } from "@playwright/test";

export class GitlabLoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/gitlab");
  }

  async loginUsingCredentials(username: string, password: string) {
    await this.loginWithCredentialsButtton.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  private get loginWithCredentialsButtton() {
    return this.page.getByRole("button", {
      name: "Mit Testbenutzer einloggen",
    });
  }

  private get usernameInput() {
    return this.page.getByLabel("Benutzername");
  }

  private get passwordInput() {
    return this.page.getByLabel("Passwort");
  }

  private get loginButton() {
    return this.page.getByRole("button", { name: "Login" });
  }
}
