import { Like } from '@prisma/client';
import { ResultOf } from 'gql.tada';

import {
  BasicProject,
  CollaborationQuestion,
  Comment,
  EventWithAdditionalData,
  Follower,
  Opportunity,
  Project,
  PROJECT_PROGRESS,
  ProjectQuestion,
  ProjectUpdate,
  SurveyQuestion,
} from '@/common/types';
import { formatDate } from '@/utils/helpers';
import { mapToImageUrl, mapToUser } from '@/utils/requests/innoUsers/mappings';
import { ProjectFragment } from '@/utils/requests/project/queries';

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
  followers: Follower[];
  updates: ProjectUpdate[];
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
    projectStart: formatDate(attributes.projectStart) ?? undefined,
    shortTitle: attributes.shortTitle ?? undefined,
    status: mapToProjectStatus(attributes.status),
    description: { tags: descriptionTags, text: attributes.description.text },
    author: attributes.author?.data ? mapToUser(attributes.author.data) : undefined,
    team: attributes.team?.data.map(mapToUser) ?? [],
    image: mapToImageUrl(attributes.image),
    featured: attributes.featured,
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
