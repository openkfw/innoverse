'use server';

import { fetchPages } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import {
  countNewsFeedEntriesByProjectIds,
  countNewsFeedEntriesByType,
  getNewsFeed,
} from '@/utils/newsFeed/redis/redisService';
import { getProjectTitleByIds } from '@/utils/requests/project/requests';

const logger = getLogger();

export const getNewsFeedPageProps = async () => {
  try {
    const initialNewsFeed = await getNewsFeed();

    const countByType = await countNewsFeedEntriesByType();
    const countByProjectId = await countNewsFeedEntriesByProjectIds();

    const projectIds = countByProjectId.map((entry) => entry.projectId);
    const projects = await fetchPages({
      fetcher: async (page, pageSize) => (await getProjectTitleByIds(projectIds, page, pageSize)) ?? [],
    });

    const types = countByType.map((entry) => entry.type);
    const newsFeedEntriesByType: { [type: string]: number } = {};
    countByType.forEach((entry) => (newsFeedEntriesByType[entry.type] = entry.count));

    const newsFeedEntriesByProject: { [title: string]: number } = {};
    countByProjectId.forEach((entry) => {
      const project = projects.find((project) => project.id === entry.projectId);
      if (!project) return;
      newsFeedEntriesByProject[project.title] = entry.count;
    });

    return {
      initialNewsFeed,
      newsFeedEntriesByType,
      newsFeedEntriesByProject,
      projects,
      types,
    };
  } catch (error) {
    logger.error('Failed to get news feed page props', error);
  }
};
