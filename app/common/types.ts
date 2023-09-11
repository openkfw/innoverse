import { StaticImageData } from 'next/image';

export type Person = {
  name: string;
  role: string;
  avatar: StaticImageData;
  badge?: boolean;
};

export type ProjectUpdate = {
  headline: string;
  text: string;
  requiredBy: Person[];
  comments: CommentType[];
};

export type CommentType = {
  id: number;
  author: Person;
  comment: string;
  upvotes: number;
  downvotes: number;
};

export type ProjectColaboration = {
  writeOpinionText: string;
  projectUpdates: ProjectUpdate[];
};

export enum PROJECT_PROGRESS {
  EXPLORATION = 'Exploration',
  KONZEPTION = 'Konzeption',
  PROOF_OF_CONCEPT = 'Proof of Concept',
}

export type Hero = {
  image: StaticImageData;
  title: string;
  author: {
    name: string;
    role: string;
    avatar: StaticImageData;
  };
  projectStatus: PROJECT_PROGRESS.PROOF_OF_CONCEPT;
};

export type ProjectCollaboration = {
  description: string;
  upvotes: number;
  participants: number;
};

export type ProjectSummary = {
  summary: string;
  timing: { projectStart: string; projectEnd: string };
  collaboration: ProjectCollaboration;
  likes: number;
  followers: number;
  teamMembers: Person[];
  updates: ProjectShortUpdate[];
};

export type ProjectShortUpdate = {
  author: Person;
  content: string;
  date: string;
};

export type PersonInfo = {
  name: string;
  role: string;
  avatar: StaticImageData;
  points: number;
  department: string;
};

export type Info = {
  title: string;
  description: string;
};

export type ProjectStatus = {
  text: string;
  author: PersonInfo;
  tags: string[];
  info: Info;
};

export type ProjectProgression = {
  projectId: number;
  hero: Hero;
  projectSummary: ProjectSummary;
  projectStatus: ProjectStatus;
  comments: CommentType[];
};
