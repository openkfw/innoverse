import { Page } from "@playwright/test";
import { PageLayout } from "./components/PageLayout";

export class ProjectPage extends PageLayout {
  constructor(readonly page: Page) {
    super(page);
  }

  async getProjectTitle() {
    return await this.projectTitle.textContent();
  }

  getTabs() {
    return this.tabs;
  }

  async followProject() {
    const isFollowed = await this.projectIsFollowed();
    if (!isFollowed) {
      await this.followButton.click();
    }
  }

  async likeProject() {
    const isLiked = await this.projectIsLiked();
    if (!isLiked) {
      await this.likeButton.click();
    }
  }

  async projectIsFollowed() {
    const active = await this.followButton.getAttribute(
      "data-teststate-active"
    );
    return active === "true";
  }

  async projectIsLiked() {
    const active = await this.likeButton.getAttribute("data-teststate-active");
    return active === "true";
  }

  private get likeButton() {
    return this.page.locator("button[data-user-interaction-id='like-button']");
  }

  private get followButton() {
    return this.page.locator(
      "button[data-user-interaction-id='project-follow-button']"
    );
  }

  private get tabs() {
    return this.page.getByTestId("tab");
  }

  private get projectTitle() {
    return this.page.getByTestId("project-title");
  }
}
