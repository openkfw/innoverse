import { PROJECT_PROGRESS } from './types';

export type ProjectResponse = {
  data: {
    project: {
      data: ProjectData;
    };
  };
};

export type ProjectsResponse = {
  data: {
    projects: {
      data: ProjectData[];
    };
  };
};

export type ProjectData = {
  id: string;
  attributes: Project;
};

export type Project = {
  title: string;
  summary: string;
  featured: boolean;
  status: PROJECT_PROGRESS;
  projectStart: string;
  projectEnd: string;
  image: ImageType;
  description: Description;
  author: UserQuery;
  team: UserQuery[];
  updates: Update[];
  collaboration: { description: string };
  questions: Question[];
  surveyQuestions?: SurveyQuestion[];
  jobs?: Job[];
};

export type ImageType = {
  data: {
    attributes: {
      url: string;
    };
  };
};

export type UserQuery = {
  name: string;
  role?: string;
  department?: string;
  avatar: ImageType;
};

export type User = {
  name: string;
  role?: string;
  department?: string;
  avatar: string;
};

export type Description = {
  title: string;
  summary: string;
  text: string;
  tags: { tag: string };
  author: UserQuery;
};

export type Update = {
  date: string;
  comment: string;
  theme: string;
  author: User;
};

export type UpdateQuery = {
  date: string;
  comment: string;
  theme: string;
  author: UserQuery;
};

export type Question = {
  title: string;
  description: string;
  authors: UserQuery[];
};

export type SurveyQuestion = {
  question: string;
  responseOptions: { responseOption: string }[];
  votes: number;
};

export type Job = {
  title: string;
  description: string;
  email: string;
};
