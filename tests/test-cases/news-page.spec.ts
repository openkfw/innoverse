import { expect, test } from "@playwright/test";
import { NewsPage } from "../pageObjectModels/NewsPage";
import { LandingPage } from "../pageObjectModels/LandingPage";

test("visiting the news page and adding news", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.navigateToNews();

  const newsPage = new NewsPage(page);
  const textOfUpdateToAdd = "This is added by an end-to-end test?";
  await newsPage.addNews(textOfUpdateToAdd);

  const addedNewsCard = await newsPage.getNthNewsCardWith(0, {
    text: textOfUpdateToAdd,
  });

  expect(addedNewsCard.text).toBe(textOfUpdateToAdd);
});

test("visiting the news page and filtering news", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.navigateToNews();

  const newsPage = new NewsPage(page);

  const { projectFilters } = await newsPage.getFilters();

  const randomFilterIndex = getRandomNumber(projectFilters.length - 1);
  const projectFilter = projectFilters[randomFilterIndex];

  await newsPage.applyFilter(projectFilter);
  await newsPage.getNthNewsCardWith(0, { projectTitle: projectFilter.label });

  // max 10 items are shown by default, that is why we don't expect more than that
  const numberOfNews = await newsPage.getNewsCardCount();
  const expectedNumberOfNews = Math.min(projectFilter.count, 10);

  expect(numberOfNews).toBe(expectedNumberOfNews);
});

const getRandomNumber = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};
