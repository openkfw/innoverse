import { HashedNewsComment, PROJECT_PROGRESS, ProjectDescription } from '@/common/types';
import { InnoPlatformError } from '@/utils/errors';

export enum NewsType {
  UPDATE = 'update',
  EVENT = 'event',
  POST = 'post',
  COLLABORATION_QUESTION = 'collaboration-question',
  COLLABORATION_COMMENT = 'collaboration-comment',
  SURVEY_QUESTION = 'survey-question',
  OPPORTUNITY = 'opportunity',
  PROJECT = 'project',
  NEWS_COMMENT = 'news-comment',
}

export type RedisNewsFeedEntry = {
  updatedAt: number;
  search: string;
  // TODO: fix types when the comments will be fetched from cache
  comments?: any[];
} & RedisNewsFeedTypeEntry;

type RedisNewsFeedTypeEntry =
  | {
      type: NewsType.UPDATE;
      item: RedisProjectUpdate;
    }
  | {
      type: NewsType.PROJECT;
      item: RedisProject;
    }
  | {
      type: NewsType.COLLABORATION_COMMENT;
      item: RedisCollaborationComment;
    }
  | { type: NewsType.POST; item: RedisPost }
  | { type: NewsType.COLLABORATION_QUESTION; item: RedisCollaborationQuestion }
  | {
      type: NewsType.SURVEY_QUESTION;
      item: RedisSurveyQuestion;
    }
  | {
      type: NewsType.EVENT;
      item: RedisProjectEvent;
    }
  | { type: NewsType.OPPORTUNITY; item: RedisOpportunity };

export interface RedisSync {
  syncedAt: number;
  status: 'OK' | 'Failed';
  syncedItemCount?: number;
  errors: InnoPlatformError[];
}

export type NewsFeedIdEntry = {
  id: string;
  type: NewsType;
};

export type RedisItem = {
  id: string;
  updatedAt: number;
  createdAt?: number;
  reactions: RedisReaction[];
  followedBy: RedisUser[];
  projectId?: string;
  comments?: any[];
};

export type RedisPost = RedisItem & {
  createdAt: number;
  author: RedisUser;
  content: string;
  upvotedBy: string[];
  anonymous: boolean;
};

export type RedisProjectEvent = RedisItem & {
  title: string;
  startTime: Date;
  endTime: Date;
  type?: string;
  description?: string;
  location?: string;
  author?: RedisUser;
  image?: ImageFormats;
  themes: string[];
  projectId: string;
};

export type RedisProjectUpdate = RedisItem & {
  title: string;
  author: RedisUser;
  comment: string;
  topic: string;
  projectId: string;
  projectName: string;
  projectStart?: string;
  linkToCollaborationTab: boolean;
  anonymous: boolean;
};

export type RedisProject = RedisItem & {
  id: string;
  title: string;
  shortTitle?: string;
  featured: boolean;
  status: PROJECT_PROGRESS;
  image?: ImageFormats;
  summary: string;
  projectStart?: string;
  team: RedisUser[];
  description: ProjectDescription;
  projectId: string;
  author?: RedisUser;
};

export type RedisNewsComment = {
  id: string;
  commentId: string;
  comment: string;
  author?: RedisUser;
  upvotedBy?: string[];
  commentCount?: number;
  comments?: RedisNewsComment[];
  updatedAt: number;
  createdAt?: number;
};

export type RedisHashedNewsComment = {
  id: string;
  commentId: string;
  comment: string;
  author?: string;
  updatedAt: number;
  createdAt: number;
  itemType: NewsType;
  itemId: string;
};

export type RedisCollaborationQuestion = RedisItem & {
  updatedAt: number;
  title: string;
  description: string;
  authors: RedisUser[];
  projectId?: string;
};

export type RedisOpportunity = RedisItem & {
  id: string;
  contactPerson?: RedisUser;
  expense?: string;
  participants: RedisUser[];
  hasApplied?: boolean;
};

export type RedisResponseOption = {
  responseOption: string;
};

export type RedisSurveyVote = {
  id: string;
  votedBy: string;
  vote: string;
};

export type RedisSurveyQuestion = RedisItem & {
  id: string;
  projectId: string;
  question: string;
  responseOptions: RedisResponseOption[];
  votes: RedisSurveyVote[];
};

export type RedisCollaborationComment = RedisItem & {
  author: RedisUser;
  comment: string;
  upvotedBy: string[];
  commentCount: number;
  projectId: string;
  question: Omit<RedisCollaborationQuestion, 'reactions' | 'followedBy' | 'updatedAt'>;
  createdAt: number;
  isUpvotedByUser?: boolean;
};

export interface RedisUser {
  id?: string;
  name: string;
  role?: string;
  department?: string;
  image?: string;
  email?: string;
  badge?: boolean;
  providerId?: string;
}

export interface RedisReaction {
  id: string;
  reactedBy: string;
  shortCode: string;
  nativeSymbol: string;
  createdAt: Date;
}

type ImageFormat = {
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

type ImageFormats = {
  xxlarge?: ImageFormat;
  xlarge?: ImageFormat;
  large?: ImageFormat;
  medium?: ImageFormat;
  small?: ImageFormat;
  xsmall?: ImageFormat;
  thumbnail?: ImageFormat;
};
