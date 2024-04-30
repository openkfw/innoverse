import { expect, test } from "@playwright/test";
import { LandingPage } from "../pageObjectModels/LandingPage";
import { ProjectPage } from "../pageObjectModels/ProjectPage";

test("visiting a project from the project carousel and interacting with it", async ({
  page,
}) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();

  const project = await landingPage.getNthProjectFromCarousel(1);
  await project.link.click();

  const projectPage = new ProjectPage(page);
  const title = await projectPage.getProjectTitle();
  await projectPage.followProject();
  await projectPage.likeProject();

  const tabs = projectPage.getTabs();
  await tabs.getByText("Inno-Infos").click();
  await tabs.getByText("Zusammenarbeit").click();
  await tabs.getByText("Updates").click();
  await tabs.getByText("Events").click();

  const isFollowed = await projectPage.projectIsFollowed();
  const isLiked = await projectPage.projectIsLiked();

  expect(title).toBe(project.title);
  expect(isFollowed).toBe(true);
  expect(isLiked).toBe(true);
});

test("visiting a project from the featured project slider", async ({
  page,
}) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();

  const project = await landingPage.getActiveFeaturedProject();
  await project.link.click();

  const projectPage = new ProjectPage(page);
  const title = await projectPage.getProjectTitle();

  expect(title).toBe(project.title);
});
