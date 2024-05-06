import { Page } from "@playwright/test";
import { PageLayout } from "./components/PageLayout";

export class LandingPage extends PageLayout {
  constructor(readonly page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/");
  }

  getProjectsSection() {
    return this.projectsSection;
  }

  async getNthProjectFromCarousel(index: number) {
    const projectCard = this.projectCards.nth(index);
    const projectLink = projectCard.locator("a");
    const projectTitle = await projectLink.textContent();
    return { title: projectTitle, link: projectLink };
  }

  async getActiveFeaturedProject() {
    const link = this.activeFeaturedProject.locator("a");
    const projectTitle = await link.textContent();
    return {
      title: projectTitle,
      link,
    };
  }

  private get projectCards() {
    return this.projectsSection.locator(".MuiPaper-root");
  }

  private get projectsSection() {
    return this.page.locator("#initiativen");
  }

  private get activeFeaturedProject() {
    return this.featuredProjectSlider
      .locator(".slick-slide.slick-active")
      .getByTestId("featured-project");
  }

  private get featuredProjectSlider() {
    return this.page.getByTestId("featured-project-slider");
  }
}
