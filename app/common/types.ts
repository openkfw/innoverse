import { StaticImageData } from 'next/image';

export enum ObjectType {
  UPDATE = 'UPDATE',
  EVENT = 'EVENT',
  COLLABORATION_COMMENT = 'COLLABORATION_COMMENT',
  PROJECT = 'PROJECT',
  POST = 'POST',
  SURVEY_QUESTION = 'SURVEY_QUESTION',
  OPPORTUNITY = 'OPPORTUNITY',
  COLLABORATION_QUESTION = 'COLLABORATION_QUESTION',
  COMMENT = 'COMMENT',
}

export type NewsFeedEntry =
  | {
      type: ObjectType.UPDATE;
      item: ProjectUpdate;
    }
  | {
      type: ObjectType.PROJECT;
      item: Project;
    }
  | {
      type: ObjectType.COLLABORATION_COMMENT;
      item: CollaborationComment;
    }
  | { type: ObjectType.POST; item: Post }
  | { type: ObjectType.COLLABORATION_QUESTION; item: CollaborationQuestion }
  | {
      type: ObjectType.SURVEY_QUESTION;
      item: SurveyQuestion;
    }
  | {
      type: ObjectType.EVENT;
      item: Event;
    };

export type CollaborationComment = CommonNewsFeedProps & {
  id: string;
  author: User;
  text: string;
  likedBy: string[];
  commentCount: number;
  projectId: string;
  projectName: string;
  question?: CollaborationQuestion;
  isLikedByUser?: boolean;
  anonymous: boolean;
};

export type User = {
  id?: string;
  name: string;
  username?: string;
  role?: string;
  department?: string;
  image?: string;
  email?: string;
  badge?: boolean;
  providerId?: string;
  provider?: string;
  imageId?: string;
};

export type Comment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  author: User;
  text: string;
  objectId: string;
  objectType: ObjectType;
  likedBy: string[];

  likes: CommentLike[];
  commentCount: number;

  objectName?: string | undefined;
  additionalObjectId?: string;
  additionalObjectType?: ObjectType;
  isLikedByUser?: boolean;
  parentId?: string;
  responses?: Comment[];
  anonymous?: boolean;
  reactions?: Reaction[];
};

export type ResponseOption = {
  responseOption: string;
};

export type SurveyQuestion = CommonNewsFeedProps & {
  id: string;
  projectId: string;
  projectName: string;
  question: string;
  responseOptions: ResponseOption[];
  votes: SurveyVote[];
  userVote?: string;
};

export type BasicSurveyQuestion = CommonNewsFeedProps & {
  id: string;
  question: string;
  projectId: string;
  projectName: string;
  responseOptions?: ResponseOption[];
  votes?: SurveyVote[];
};

export type SurveyVote = {
  id: string;
  createdAt?: Date;
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

export type Project = BasicProject &
  CommonNewsFeedProps & {
    likes: Like[];
    followers: Follow[];
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

export type BasicProject = CommonNewsFeedProps & {
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

export type CommentLike = {
  id: string;
  commentId: string;
  likedBy: string;
};

export type Like = {
  id: string;
  objectType: ObjectType;
  objectId: string;
};

export type Follow = {
  objectId: string;
  objectType: ObjectType;
  followedBy: string;
};

export type ProjectDescription = {
  text: string;
  tags: Tag[];
  collaborationTags?: CollaborationTag[];
};

export type ProjectQuestion = CommonNewsFeedProps & {
  id: string;
  title: string;
  authors: User[];
};

export type ProjectUpdate = CommonNewsFeedProps & {
  id: string;
  title: string;
  author: User;
  comment: string;
  topic: string;
  projectId: string;
  projectName: string;
  projectStart?: string;
  linkToCollaborationTab: boolean;
  anonymous: boolean;
  objectType: ObjectType;
};

export type ProjectUpdateWithAdditionalData = ProjectUpdate & ReactionOnObject;

export type EventWithAdditionalData = Event & ReactionOnObject;

export type ObjectWithReactions = EventWithAdditionalData | ProjectUpdateWithAdditionalData;

export type ReactionOnObject = {
  reactionForUser?: Reaction | null;
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
  createdAt: Date;
  objectId: string;
  objectType: ObjectType;
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

export type CollaborationTag = {
  [key: string]: number | undefined;
};

export type ProjectStatus = {
  text: string;
  author: User;
  tags: Tag[];
  info: Info;
  projectName: string;
};

export type CommonNewsFeedProps = {
  updatedAt: Date;
  createdAt?: Date;
  projectId?: string;
  reactions?: Reaction[];
  followedBy?: User[];
  reactionForUser?: Reaction | null;
  followedByUser?: boolean;
  projectName?: string | null;
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
  sliderContent: BasicProject[];
  projects: BasicProject[];
  updates: ProjectUpdateWithAdditionalData[];
  events: EventWithAdditionalData[];
};

export type UserSession = {
  providerId: string;
  provider: string;
  name: string;
  username?: string;
  role?: string;
  department?: string;
  image?: string;
  email: string;
  oldImageId?: string;
};

export type UpdateInnoUser = {
  id: string;
  name: string;
  role?: string;
  department?: string;
  oldImageId?: string;
  image?: FormData | null | string;
  avatarId?: string | null;
};

export type Opportunity = CommonNewsFeedProps & {
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
  projectId: string;
  projectName: string;
  contactPerson?: User;
};

export type CollaborationQuestion = CommonNewsFeedProps & {
  id: string;
  title: string;
  isPlatformFeedback: boolean;
  description: string;
  authors: User[];
  comments: CollaborationComment[];
  projectId: string;
  projectName: string;
};

export type BasicCollaborationQuestion = {
  id: string;
  updatedAt: Date;
  title: string;
  description: string;
  authors: User[];
  projectId: string;
  projectName: string;
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

export type Event = CommonNewsFeedProps & {
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
  projectName: string;
};

export type Post = CommonNewsFeedProps & {
  id: string;
  author: User;
  content: string;
  likedBy: string[];
  anonymous: boolean;
  createdAt: Date;
  objectType: ObjectType;
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

export type CommonCommentProps = {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  author: User;
  likes?: CommentLike[];
  isLikedByUser?: boolean;
  commentCount: number;
  parentId?: string;
};

export type HashedNewsComment = {
  id: string;
  commentId: string;
  comment: string;
  author?: string;
  updatedAt: Date;
  createdAt: Date;
  itemType: ObjectType;
  itemId: string;
};

export type CommentWithResponses = CommonCommentProps & {
  comments: CommentWithResponses[];
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

export type UploadImageResponse = {
  id: number | string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: ImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
};

export enum SortValues {
  DESC = 'DESC',
  ASC = 'ASC',
}

export type StartPagination = {
  from: Date;
  page: number;
  pageSize: number;
};

export type ChildTestProps = {
  'data-testid'?: string;
};

export interface Mention {
  username: string;
}
