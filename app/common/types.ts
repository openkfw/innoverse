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

export type Project = BasicProject & {
  collaboration: ProjectCollaboration;
  likes: Like[];
  followers: Follower[];
  projectName: string;
  questions: ProjectQuestion[];
  comments: Comment[];
  surveyQuestions: SurveyQuestion[];
  opportunities: Opportunity[];
  collaborationQuestions: CollaborationQuestion[];
  events: EventWithAdditionalData[];
};

export type ProjectData = Project & {
  isLiked: boolean;
  isFollowed: boolean;
  futureEvents: EventWithAdditionalData[];
  pastEvents: EventWithAdditionalData[];
};

export type BasicProject = {
  id: string;
  title: string;
  shortTitle: string;
  featured: boolean;
  status: PROJECT_PROGRESS;
  image?: string;
  summary: string;
  projectStart: string;
  team: User[];
  updates: ProjectUpdate[];
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
  projects: BasicProject[];
  updates: ProjectUpdate[];
};

export type ProjectByIdQueryResult = {
  id: string;
  title: string;
  shortTitle: string;
  featured: boolean;
  status: PROJECT_PROGRESS;
  image?: string;
  summary: string;
  projectStart: string;
  team: User[];
  updates: ProjectUpdate[];
  description: ProjectDescription;
  questions: ProjectQuestion[];
  comments: Comment[] | undefined;
  surveyQuestions: SurveyQuestion[];
  author?: User;
  opportunities: Opportunity[];
  collaborationQuestions: CollaborationQuestion[];
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
  description: string;
  contactPerson?: User;
  expense: string;
  participants: User[];
  hasApplied?: boolean;
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
  type: string;
  description?: string;
  location: string;
  author?: User;
  image?: string;
  themes: string[];
  projectId: string;
};
