'use server';

import { AmountOfNews, ProjectUpdate } from '@/common/types';
import { getProjectsUpdates } from '@/utils/requests';

export const getUpdatesTopics = async () => {
  const updates = (await getProjectsUpdates()) as ProjectUpdate[];
  return updates
    .map((update) => update.topic)
    .filter((value, index, self) => self.indexOf(value) === index)
    .filter((value) => value);
};

export const getUpdatesProjects = async () => {
  const updates = (await getProjectsUpdates()) as ProjectUpdate[];
  return updates
    .map((update) => update.title)
    .filter((value, index, self) => self.indexOf(value) === index)
    .filter((value) => value);
};

export const mapUpdatesProjects = async () => {
  const arr: AmountOfNews = {};
  const updates = (await getProjectsUpdates()) as ProjectUpdate[];
  return updates.reduce((accumulator, value) => {
    accumulator[value.title] = ++accumulator[value.title] || 1;
    return accumulator;
  }, arr);
};

export const mapUpdatesTopics = async () => {
  const arr: AmountOfNews = {};
  const updates = (await getProjectsUpdates()) as ProjectUpdate[];
  return updates.reduce((accumulator, value) => {
    accumulator[value.topic] = ++accumulator[value.topic] || 1;
    return accumulator;
  }, arr);
};
