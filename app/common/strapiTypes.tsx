import { Opportunity, PROJECT_PROGRESS } from './types';

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

export type UpdatesResponse = {
  data: {
    updates: {
      data: UpdateQuery[];
    };
  };
};

export type OpportunitiesResponse = {
  data: {
    opportunities: {
      data: OpportunityQuery[];
    };
  };
};

export type SurveyQuestionsResponse = {
  data: {
    surveyQuestions: {
      data: SurveyQuestionQuery[];
    };
  };
};

export type QuestionsResponse = {
  data: {
    questions: {
      data: QuestionQuery[];
    };
  };
};

export type CollaborationQuestionsResponse = {
  data: {
    collaborationQuestions: {
      data: QuestionQuery[];
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
  shortTitle: string;
  summary: string;
  featured: boolean;
  status: PROJECT_PROGRESS;
  projectStart: string;
  image: ImageType;
  description: Description;
  author: { data: UserQuery };
  team: { data: UserQuery[] };
  updates: Update[];
  surveyQuestions?: SurveyQuestion[];
  opportunities?: Opportunity[];
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
  text: string;
  tags: { tag: string };
};

export type Update = {
  title: string;
  date: string;
  comment: string;
  theme: string;
  author: User;
};

export type UpdateQuery = {
  attributes: {
    date: string;
    comment: string;
    theme: string;
    author: { data: UserQuery };
  };
};

export type QuestionQuery = {
  attributes: {
    title: string;
    description: string;
    authors: { data: UserQuery[] };
  };
};

export type SurveyQuestionQuery = {
  attributes: {
    question: string;
    responseOptions: { responseOption: string }[];
    votes: number;
  };
};

export type SurveyQuestion = {
  question: string;
  responseOptions: { responseOption: string }[];
  votes: number;
};

export type OpportunityQuery = {
  attributes: { title: string; description: string; email: string; expense: string };
};
