import { StaticImageData } from 'next/image';

export type User = {
  name: string;
  role?: string;
  department?: string;
  image?: string;
  email?: string;
  badge?: boolean;
};

export type Comment = {
  id: string;
  author: User;
  comment: string;
  upvotedBy?: User[];
};

export type ResponseOption = {
  responseOption: string;
};

export type SurveyQuestion = {
  question: string;
  responseOptions: ResponseOption[];
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
  upvotes: number;
  participants: number;
};

export type Project = {
  id: string;
  title: string;
  shortTitle: string;
  featured: boolean;
  status: PROJECT_PROGRESS;
  image: string;
  summary: string;
  projectStart: string;
  collaboration: ProjectCollaboration;
  likes: number;
  followers: number;
  projectName: string;
  team: User[];
  updates: ProjectUpdate[];
  description: ProjectDescription;
  questions: ProjectQuestion[];
  comments: Comment[];
  surveyQuestions: SurveyQuestion[];
  author: User;
  opportunities: Opportunity[];
  collaborationQuestions: CollaborationQuestion[];
};

export type ProjectDescription = {
  text: string;
  tags: Tag[];
};

export type ProjectQuestion = {
  id: string;
  title: string;
  authors: User[];
};

export type ProjectUpdate = {
  id: string;
  title: string;
  author: User;
  comment: string;
  theme: string;
  date: string;
  projectStart?: boolean;
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

export type Tag = {
  tag: string;
};

export type ProjectStatus = {
  text: string;
  author: User;
  tags: Tag[];
  info: Info;
  projectName: string;
};

export type ProjectProgression = {
  projectId: number;
  hero: Hero;
  projectSummary: Project;
  projectStatus: ProjectStatus;
  comments: Comment[];
  questions: CollaborationQuestion[];
};

export type ProjectsProgression = {
  writeCommentText: string;
  projects: ProjectProgression[];
};

export type ProjectsQueryResult = {
  projects: any;
  updates: any;
};

export type ProjectByIdQueryResult = {
  project: any;
};

export type MainPageData = {
  sliderContent: Project[];
  projects: Project[];
  updates: ProjectUpdate[];
};

export type UserSession = {
  providerId: string;
  provider: string;
  name: string;
  role?: string;
  department?: string;
  image?: string;
  email: string;
};

export type Opportunity = {
  title: string;
  description: string;
  email: string;
  expense: string;
};

export type CollaborationQuestion = {
  id: string;
  title: string;
  description: string;
  authors: User[];
  comments: Comment[];
};
