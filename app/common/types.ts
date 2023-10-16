import { StaticImageData } from 'next/image';

export type Person = {
  name: string;
  role: string;
  avatar: StaticImageData;
  badge?: boolean;
  department?: string;
  points?: number;
};

export type ProjectUpdateMock = {
  headline: string;
  text: string;
  requiredBy: Person[];
  comments: CommentType[];
};

export type CommentType = {
  id: number;
  author: Person;
  comment: string;
  upvotes?: number;
  downvotes?: number;
};

export type ProjectColaborationMock = {
  writeCommentText: string;
  projectUpdates: ProjectUpdateMock[];
};

export type SurveyQuestion = {
  question: string;
  responseOptions: { options: string[] };
  votes: number;
};

export type ProjectColaboration = {
  projectName: string;
  writeCommentText: string;
  projectUpdates: ProjectUpdate[];
  surveyQuestions: SurveyQuestion[];
};

export enum PROJECT_PROGRESS {
  EXPLORATION = 'Exploration',
  KONZEPTION = 'Konzeption',
  PROOF_OF_CONCEPT = 'Proof_of_Concept',
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

export type Project = {
  title: string;
  summary: string;
  projectStart: string;
  projectEnd: string;
  collaboration: ProjectCollaboration;
  likes: number;
  followers: number;
  projectName: string;
  team: Person[];
  updates: ProjectUpdate[];
  description: ProjectDescription;
  questions: ProjectQuestion[];
  surveyQuestions: SurveyQuestion[];
};

export type ProjectDescription = {
  text: string;
  title: string;
  summary: string;
  author: Person;
  tags: Tags;
};

export type Tags = {
  tags: string[];
};

export type ProjectQuestion = {
  headline: string;
  text: string;
  authors: Person[];
};

export type ProjectUpdate = {
  author: Person;
  comment: string;
  theme: string;
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
  projectName: string;
};

export type ProjectProgression = {
  projectId: number;
  hero: Hero;
  projectSummary: Project;
  projectStatus: ProjectStatus;
  comments: CommentType[];
  questions: Question[];
};

export type Question = {
  text: string;
};

export type ProjectsProgression = {
  writeCommentText: string;
  projects: ProjectProgression[];
};

export type UpdateContent = {
  id: number;
  author: Person;
  date: string;
  comment: string;
  projectStart?: boolean;
};

export type Update = {
  projectId: number;
  updates: UpdateContent[];
};
