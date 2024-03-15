import { StaticImageData } from 'next/image';

export type User = {
  id?: string;
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
  upvotedBy: User[];
  responseCount: number;
  projectId: string;
  questionId: string;
  createdAt: Date;
};

export type CommentResponse = {
  id: string;
  author: User;
  response: string;
  createdAt: Date;
  upvotedBy: User[];
  comment: Comment;
};

export type ResponseOption = {
  responseOption: string;
};

export type SurveyQuestion = {
  id: string;
  question: string;
  responseOptions: ResponseOption[];
  votes: SurveyVote[];
};

export type SurveyVote = {
  votedBy: string;
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
  LIVE = 'Live',
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
  image?: string;
  summary: string;
  projectStart: string;
  collaboration: ProjectCollaboration;
  likes: Like[];
  followers: Follower[];
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

export type Like = {
  projectId: string;
  likedBy: string;
};

export type Follower = {
  projectId: string;
  followedBy: string;
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
  topic: string;
  date: string;
  projectId: string;
  projectStart?: string;
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
  projects: Project[];
  updates: ProjectUpdate[];
};

export type ProjectByIdQueryResult = {
  project: any;
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
  id: string;
  title: string;
  description: string;
  contactPerson: User;
  expense: string;
  participants: User[];
};

export type CollaborationQuestion = {
  id: string;
  title: string;
  isPlatformFeedback: boolean;
  description: string;
  authors: User[];
  comments: Comment[];
};

export type Filters = {
  resultsPerPage: number;
  projects: string[];
  topics: string[];
};

export interface NewsFilterProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export type AmountOfNews = {
  [key: string]: number;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'Remote' | 'In_office' | 'Remote_und_In_office';
  description?: string;
  location: string;
  author: User;
  image?: string;
};
