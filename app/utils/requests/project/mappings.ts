import { Like } from '@prisma/client';
import { ResultOf } from 'gql.tada';

import {
  BasicProject,
  CollaborationQuestion,
  Comment,
  EventWithAdditionalData,
  Follow,
  Opportunity,
  Project,
  PROJECT_PROGRESS,
  ProjectQuestion,
  ProjectUpdateWithAdditionalData,
  SurveyQuestion,
} from '@/common/types';
import { formatDate, toDate } from '@/utils/helpers';
import { mapToImageUrl, mapToUser } from '@/utils/requests/innoUsers/mappings';
import { ProjectFragment } from '@/utils/requests/project/queries';

export async function mapToProjects(projects: ResultOf<typeof ProjectFragment>[] | undefined): Promise<BasicProject[]> {
  return projects?.map(mapToBasicProject) ?? [];
}

export const mapToProject = ({
  projectBaseData,
  ...otherProps
}: {
  projectBaseData: ResultOf<typeof ProjectFragment>;
  opportunities: Opportunity[];
  questions: ProjectQuestion[];
  surveyQuestions: SurveyQuestion[];
  collaborationQuestions: CollaborationQuestion[];
  comments: Comment[];
  followers: Follow[];
  updates: ProjectUpdateWithAdditionalData[];
  likes: Like[];
  isLiked: boolean;
  isFollowed: boolean;
  pastEvents: EventWithAdditionalData[];
  futureEvents: EventWithAdditionalData[];
}): Project => {
  const attributes = projectBaseData.attributes;
  const basicProject = mapToBasicProject(projectBaseData);

  return {
    ...attributes,
    ...basicProject,
    image: basicProject.image,
    author: basicProject.author,
    shortTitle: basicProject.shortTitle,
    projectStart: basicProject.projectStart,
    updatedAt: new Date(attributes.updatedAt ?? new Date()),
    ...otherProps,
  };
};

export const mapToBasicProject = (projectData: ResultOf<typeof ProjectFragment>): BasicProject => {
  const attributes = projectData.attributes;
  const descriptionTags = attributes.description.tags.filter((tag) => tag?.tag) as { tag: string }[];

  return {
    id: projectData.id,
    summary: attributes.summary,
    title: attributes.title,
    projectName: attributes.title,
    projectStart: formatDate(attributes.projectStart) ?? undefined,
    shortTitle: attributes.shortTitle ?? undefined,
    status: mapToProjectStatus(attributes.status),
    description: { tags: descriptionTags, text: attributes.description.text },
    author: attributes.author?.data ? mapToUser(attributes.author.data) : undefined,
    team: attributes.team?.data.map(mapToUser) ?? [],
    image: mapToImageUrl(attributes.image),
    featured: attributes.featured,
    updatedAt: toDate(attributes.updatedAt),
  };
};

const mapToProjectStatus = (status: 'Exploration' | 'Konzeption' | 'Live' | 'Proof_of_Concept'): PROJECT_PROGRESS => {
  switch (status) {
    case 'Exploration':
      return PROJECT_PROGRESS.EXPLORATION;
    case 'Konzeption':
      return PROJECT_PROGRESS.KONZEPTION;
    case 'Proof_of_Concept':
      return PROJECT_PROGRESS.PROOF_OF_CONCEPT;
    case 'Live':
      return PROJECT_PROGRESS.LIVE;
  }
};
