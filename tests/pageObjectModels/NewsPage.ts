import { Locator, Page } from "@playwright/test";
import { PageLayout } from "./components/PageLayout";
import { AddUpdateDialog } from "./components/AddUpdateDialog";

type NewsFilter = {
  checkbox: Locator;
  label: string;
  count: number;
};

export class NewsPage extends PageLayout {
  constructor(readonly page: Page) {
    super(page);
  }

  async getNewsCardCount() {
    return await this.newsCards.count();
  }

  async getNthNewsCard(index: number) {
    const newsCard = this.newsCards.nth(index);
    return await this.mapToNews(newsCard);
  }

  async getNthNewsCardWith(
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

    return this.mapToNews(newsCards);
  }

  async addNews(content: string) {
    await this.addNewsButton.click();

    const dialog = new AddUpdateDialog(this.page);
    await dialog.fillComment(content);
    await dialog.selectNthProject(0);
    await dialog.submit();
  }

  async getFilters() {
    const projectFilters = await this.parseFilters(this.projectFilters);
    const topicFilters = await this.parseFilters(this.topicFilters);
    return {
      projectFilters,
      topicFilters,
    };
  }

  async applyFilter(filter: NewsFilter) {
    await filter.checkbox.click();
  }

  private async mapToNews(newsCard: Locator) {
    const author = await newsCard.getByTestId("author").textContent();
    const date = await newsCard.getByTestId("date").textContent();
    const text = await newsCard.getByTestId("text").textContent();
    const projectLink = newsCard.getByTestId("project-link");
    const projectTitle = await projectLink.textContent();
    return { author, date, text, projectTitle, projectLink };
  }

  private async parseFilters(labelsSelector: Locator): Promise<NewsFilter[]> {
    // locator.all() does not wait for elements, that is why we wait for the first filter
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

  private get topicFilters() {
    return this.newsFilterContainer.getByTestId("news-topic-filter");
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
      name: "Neuigkeit hinzufügen",
    });
  }
}
