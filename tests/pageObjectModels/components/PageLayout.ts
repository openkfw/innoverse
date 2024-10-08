import { Page } from "@playwright/test";

export class PageLayout {
  constructor(protected page: Page) {}

  async navigateToNews() {
    await this.getUserMenu().waitFor();
    const newsLink = this.page.getByRole("link", { name: "News", exact: true });
    await newsLink.click();
    await this.page.waitForURL("/news");
  }

  getUserMenu() {
    return this.userMenu;
  }

  get userMenu() {
    return this.page.getByTestId("user-menu");
  }
}
