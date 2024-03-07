import { Opportunity, PROJECT_PROGRESS, SurveyVote } from './types';

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

export type UpdateOportunityParticipantsResponse = {
  data: {
    updateOpportunityParticipants: {
      data: OpportunityQuery;
    };
  };
};

export type SurveyQuestionsResponse = {
  data: {
    surveyQuestions: {
      id: string;
      data: SurveyQuestionQuery[];
    };
  };
};

export type ProjectQuestionsResponse = {
  data: {
    questions: {
      data: ProjectQuestionQuery[];
    };
  };
};

export type CollaborationQuestionsResponse = {
  data: {
    collaborationQuestions: {
      data: CollaborationQuestionQuery[];
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

export type CreateProjectUpdateResponse = {
  data: {
    createUpdate: {
      data: UpdateQuery;
    };
  };
};

export type UpdateOpportunityResponse = {
  data: {
    updateOpportunity: {
      data: OpportunityQuery;
    };
  };
};

export type GetEventsResponse = {
  data: {
    events: { data: Event[] };
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
  author?: { data: UserQuery };
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
  id: string;
  attributes: {
    name: string;
    role?: string;
    department?: string;
    avatar: ImageType;
  };
};

export type User = {
  id?: string;
  name: string;
  role?: string;
  department?: string;
  image: string;
  email?: string;
};

export type Description = {
  text: string;
  tags: { tag: string };
};

export type Update = {
  id: string;
  title: string;
  date: string;
  comment: string;
  topic: string;
  author: User;
  projectId: string;
};

export type UpdateQuery = {
  id: string;
  attributes: {
    date: string;
    comment: string;
    topic: string;
    author: { data: UserQuery };
    project: { data: { id: string; attributes: { title: string } } };
  };
};

export type ProjectQuestionQuery = {
  id: string;
  attributes: {
    project: { data: { id: string } };
    title: string;
    authors: { data: UserQuery[] };
  };
};

export type CollaborationQuestionQuery = {
  id: string;
  attributes: {
    project: { data: { id: string } };
    title: string;
    description: string;
    authors: { data: UserQuery[] };
    comments: CommentQuery[];
  };
};

export type SurveyQuestionQuery = {
  id: string;
  attributes: {
    question: string;
    responseOptions: { responseOption: string }[];
  };
};

export type SurveyQuestion = {
  id: string;
  question: string;
  responseOptions: { responseOption: string }[];
  votes: SurveyVote[];
};

export type OpportunityQuery = {
  id: string;
  attributes: {
    title: string;
    description: string;
    contactPerson: { data: UserQuery };
    expense: string;
    participants: { data: UserQuery[] };
  };
};

export type CommentQuery = {
  id: string;
  comment: string;
  author: { data: UserQuery };
  upvotedBy: { data: UserQuery[] };
};

export type Event = {
  id: string;
  attributes: {
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    type: string;
    location: string;
    description?: string;
    author: {
      data?: UserQuery;
    };
    image: {
      data?: {
        attributes: {
          url: string;
        };
      };
    };
  };
};
