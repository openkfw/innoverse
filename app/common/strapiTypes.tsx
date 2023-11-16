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

export type GetInnoUserResponse = {
  data: {
    innoUsers: {
      data: UserQuery[];
    };
  };
};

export type CreateInnoUserResponse = {
  data: {
    createInnoUser: {
      data: UserQuery;
    };
  };
};

export type UserQueryResult = {
  user: any;
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
  author: { data: UserQuery };
  team: { data: UserQuery[] };
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
  attributes: {
    name: string;
    role?: string;
    department?: string;
    avatar: ImageType;
  };
};

export type User = {
  name: string;
  role?: string;
  department?: string;
  avatar: string;
  email?: string;
};

export type Description = {
  title: string;
  summary: string;
  text: string;
  tags: { tag: string };
  author: { data: UserQuery };
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
  author: { data: UserQuery };
};

export type Question = {
  title: string;
  description: string;
  authors: { data: UserQuery[] };
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
