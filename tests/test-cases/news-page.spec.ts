import { expect, test } from "@playwright/test";
import { NewsFeedPage } from "../pageObjectModels/NewsFeedPage";
import { LandingPage } from "../pageObjectModels/LandingPage";

test("visiting the news page and adding post", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.navigateToNews();

  const newsPage = new NewsFeedPage(page);

  const textOfPostToAdd = "This is a post added by an end-to-end test";
  await newsPage.addPost(textOfPostToAdd);
  const addedNewsCard = await newsPage.getNthNewsWith(0, {
    text: textOfPostToAdd,
  });

  expect(addedNewsCard.text).toBe(textOfPostToAdd);
});

test("visiting the news page and adding update", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.navigateToNews();

  const newsPage = new NewsFeedPage(page);

  const textOfUpdateToAdd = "This is an update added by an end-to-end test";
  await newsPage.addUpdate(textOfUpdateToAdd);

  const addedNewsCard = await newsPage.getNthNewsWith(0, {
    text: textOfUpdateToAdd,
  });

  expect(addedNewsCard.text).toBe(textOfUpdateToAdd);
});

test("visiting the news page and filtering news by project title", async ({
  page,
}) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.navigateToNews();

  const newsPage = new NewsFeedPage(page);

  const { projectFilters } = await newsPage.getFilters();

  const randomFilterIndex = getRandomNumber(projectFilters.length - 1);
  const projectFilter = projectFilters[randomFilterIndex];

  await newsPage.applyFilter(projectFilter);
  await newsPage.getNthNewsWithProject(0, {
    projectTitle: projectFilter.label,
  });

  // max 10 items are shown by default, that is why we don't expect more than that
  const numberOfNews = await newsPage.getNewsCardCount();
  const expectedNumberOfNews = Math.min(projectFilter.count, 10);

  expect(numberOfNews).toBe(expectedNumberOfNews);
});

const getRandomNumber = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};
