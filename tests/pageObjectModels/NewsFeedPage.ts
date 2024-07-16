import { Locator, Page, test } from "@playwright/test";
import { PageLayout } from "./components/PageLayout";
import { AddUpdateDialog } from "./components/AddUpdateDialog";

type NewsFilter = {
  checkbox: Locator;
  label: string;
  count: number;
};

export class NewsFeedPage extends PageLayout {
  constructor(readonly page: Page) {
    super(page);
  }

  async getNewsCardCount() {
    return await this.newsCards.count();
  }

  async getNthNews(index: number) {
    const newsCard = this.newsCards.nth(index);
    return await this.mapToNewsItemWithProject(newsCard);
  }

  async getNthNewsWith(
    index: number,
    filters: {
      text?: string;
    }
  ) {
    let newsCards = this.newsCards.nth(index);

    if (filters.text !== undefined) {
      newsCards = newsCards.filter({
        has: this.page.getByTestId("text").getByText(filters.text),
      });
    }
    return this.mapToNewsItem(newsCards);
  }

  async getNthNewsWithProject(
    index: number,
    filters: {
      text?: string;
      projectTitle?: string;
    }
  ) {
    let newsCards = this.newsCards.nth(index);

    if (filters.text !== undefined) {
      newsCards = newsCards.filter({
        has: this.page.getByTestId("text").getByText(filters.text),
      });
    }

    if (filters.projectTitle !== undefined) {
      newsCards = newsCards.filter({
        has: this.page
          .getByTestId("project-link")
          .getByText(filters.projectTitle),
      });
    }

    return this.mapToNewsItemWithProject(newsCards);
  }

  async addUpdate(content: string) {
    await this.addNewsButton.click();

    const dialog = new AddUpdateDialog(this.page);
    await dialog.fillComment(content);
    await dialog.selectNthProject(1);
    await dialog.submit();
  }

  async addPost(content: string) {
    await this.addNewsButton.click();

    const dialog = new AddUpdateDialog(this.page);
    await dialog.fillComment(content);
    await dialog.submit();
  }

  async getFilters() {
    const projectFilters = await this.parseFilters(this.projectFilters);
    const typeFilters = await this.parseFilters(this.typeFilters);
    return {
      projectFilters,
      typeFilters,
    };
  }

  async applyFilter(filter: NewsFilter) {
    await filter.checkbox.click();
  }

  private async mapToNewsItemWithProject(newsCard: Locator) {
    const text = await newsCard.getByTestId("text").textContent();
    const projectLink = newsCard.getByTestId("project-link");
    const projectTitle = await projectLink.textContent();
    return { text, projectTitle, projectLink };
  }

  private async mapToNewsItem(newsCard: Locator) {
    const text = await newsCard.getByTestId("text").textContent();
    return { text };
  }

  private async parseFilters(labelsSelector: Locator): Promise<NewsFilter[]> {
    // locator.all() does not wait for elements, that is why we wait for the first filter

    await this.typeFilters.first().waitFor();
    await this.projectFilters.first().waitFor();
    const labels = await labelsSelector.all();

    const parseLabels = labels.map(async (label) => {
      const countString = await label.getAttribute("data-testdata-count");
      const labelText = await label.getAttribute("data-testdata-label");
      const count = parseInt(countString ?? "0");
      return { checkbox: label, label: labelText ?? "", count };
    });

    return await Promise.all(parseLabels);
  }

  private get projectFilters() {
    return this.newsFilterContainer.getByTestId("news-project-filter");
  }

  private get typeFilters() {
    return this.newsFilterContainer.getByTestId("news-type-filter");
  }

  private get newsCards() {
    return this.newsContainer.locator(".MuiPaper-root");
  }

  private get newsFilterContainer() {
    return this.page.getByTestId("news-filter");
  }

  private get newsContainer() {
    return this.page.getByTestId("news-container");
  }

  private get addNewsButton() {
    return this.page.getByRole("button", {
      name: "Beitrag hinzufügen",
    });
  }
}
