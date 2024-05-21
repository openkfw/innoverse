import { StaticImageData } from 'next/image';

export type User = {
  id?: string;
  name: string;
  role?: string;
  department?: string;
  image?: string;
  email?: string;
  badge?: boolean;
  providerId?: string;
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
  isUpvotedByUser?: boolean;
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
  userVote?: string;
};

export type BasicSurveyQuestion = {
  id: string;
  question: string;
  projectId?: string;
};

export type SurveyVote = {
  id: string;
  createdAt: Date;
  votedBy: string;
  vote: string;
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

export type Project = BasicProject & {
  likes: Like[];
  followers: Follower[];
  questions: ProjectQuestion[];
  comments: Comment[];
  surveyQuestions: SurveyQuestion[];
  opportunities: Opportunity[];
  collaborationQuestions: CollaborationQuestion[];
  isLiked: boolean;
  isFollowed: boolean;
  futureEvents: EventWithAdditionalData[];
  pastEvents: EventWithAdditionalData[];
  updates: ProjectUpdateWithAdditionalData[];
};

export type BasicProject = {
  id: string;
  title: string;
  shortTitle?: string;
  featured: boolean;
  status: PROJECT_PROGRESS;
  image?: ImageFormats;
  summary: string;
  projectStart?: string;
  team: User[];
  description: ProjectDescription;
  author?: User;
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
  projectId: string;
  projectStart?: string;
  followedByUser?: boolean;
  updatedAt: string;
  linkToCollaborationTab: boolean;
};

export type ProjectUpdateWithAdditionalData = ProjectUpdate & ReactionOnObject;

export type EventWithAdditionalData = Event & ReactionOnObject;

export type ObjectWithReactions = EventWithAdditionalData | ProjectUpdateWithAdditionalData;

export type ReactionOnObject = {
  reactionForUser?: Reaction;
  reactionCount: {
    count: number;
    emoji: { shortCode: string; nativeSymbol: string };
  }[];
};

export type Reaction = {
  id: string;
  reactedBy: string;
  shortCode: string;
  nativeSymbol: string;
  objectId: string;
  objectType: string;
  createdAt: Date;
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

export type MainPageData = {
  sliderContent: Project[];
  projects: Project[];
  updates: ProjectUpdateWithAdditionalData[];
  events: EventWithAdditionalData[];
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
  description?: string;
  contactPerson?: User;
  expense?: string;
  participants: User[];
  hasApplied?: boolean;
};

export type BasicOpportunity = {
  id: string;
  title: string;
  description: string | null;
  projectId?: string;
  contactPerson?: User;
};

export type CollaborationQuestion = {
  id: string;
  title: string;
  isPlatformFeedback: boolean;
  description: string;
  authors: User[];
  comments: Comment[];
};

export type BasicCollaborationQuestion = {
  id: string;
  title: string;
  description: string;
  authors: User[];
  projectId?: string;
};

export type Filters = {
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
  startTime: Date;
  endTime: Date;
  type?: string;
  description?: string;
  location?: string;
  author?: User;
  image?: ImageFormats;
  themes: string[];
  projectId: string;
};

export type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: null;
  size: number;
  width: number;
  height: number;
};

export type ImageFormats = {
  xxlarge?: ImageFormat;
  xlarge?: ImageFormat;
  large?: ImageFormat;
  medium?: ImageFormat;
  small?: ImageFormat;
  xsmall?: ImageFormat;
  thumbnail?: ImageFormat;
};
