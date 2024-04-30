import { Page } from "@playwright/test";

export class PageLayout {
  constructor(protected page: Page) {}

  async navigateToNews() {
    const newsLink = this.navbarLinks.filter({ hasText: "News" });
    await newsLink.click();
    await this.page.waitForURL("/news");
  }

  getUserMenu() {
    return this.userMenu;
  }

  get userMenu() {
    return this.page.getByTestId("user-menu");
  }

  get navbarLinks() {
    return this.page.getByTestId("navbar-link");
  }
}
