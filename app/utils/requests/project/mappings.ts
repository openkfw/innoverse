import { ResultOf } from 'gql.tada';

import {
  BasicProject,
  CollaborationQuestion,
  Comment,
  EventWithAdditionalData,
  Follow,
  Like,
  ObjectType,
  Opportunity,
  Project,
  PROJECT_PROGRESS,
  ProjectQuestion,
  ProjectUpdateWithAdditionalData,
  SurveyQuestion,
} from '@/common/types';
import { LikeDB } from '@/repository/db/utils/types';
import { formatDate, toDate } from '@/utils/helpers';
import { mapToImageUrl, mapToUser } from '@/utils/requests/innoUsers/mappings';
import { ProjectFragment } from '@/utils/requests/project/queries';

export async function mapToProjects(projects: ResultOf<typeof ProjectFragment>[]): Promise<BasicProject[]> {
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
  const basicProject = mapToBasicProject(projectBaseData);

  return {
    ...projectBaseData,
    ...basicProject,
    image: basicProject.image,
    author: basicProject.author,
    shortTitle: basicProject.shortTitle,
    projectStart: basicProject.projectStart,
    updatedAt: new Date(basicProject.updatedAt ?? new Date()),
    ...otherProps,
  };
};

export const mapToBasicProject = (projectData: ResultOf<typeof ProjectFragment>): BasicProject => {
  const descriptionTags = projectData.description.tags.filter((tag) => tag?.tag) as { tag: string }[];
  return {
    id: projectData.documentId,
    summary: projectData.summary,
    title: projectData.title,
    projectName: projectData.title,
    projectStart: formatDate(projectData.projectStart) ?? undefined,
    shortTitle: projectData.shortTitle ?? undefined,
    stage: mapToProjectStatus(projectData.stage),
    description: { tags: descriptionTags, text: projectData.description.text },
    author: projectData.author ? mapToUser(projectData.author) : undefined,
    team: projectData.team?.map(mapToUser) ?? [],
    image: mapToImageUrl(projectData.image),
    featured: projectData.featured,
    updatedAt: toDate(projectData.updatedAt),
  };
};

export const mapToLike = (likes: LikeDB[]): Like[] => {
  return likes.map((l: LikeDB) => ({
    ...l,
    objectType: l.objectType as ObjectType,
  }));
};

const mapToProjectStatus = (stage: 'Exploration' | 'Konzeption' | 'Live' | 'Proof_of_Concept'): PROJECT_PROGRESS => {
  switch (stage) {
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
