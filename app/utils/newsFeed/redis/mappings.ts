import {
  BasicCollaborationQuestion,
  BasicProject,
  Event,
  ImageFormats,
  ObjectType,
  Post,
  ProjectUpdate,
  SurveyQuestion,
  User,
} from '@/common/types';
import { clientConfig } from '@/config/client';
import { getPromiseResults, getUnixTimestamp, unixTimestampToDate } from '@/utils/helpers';
import { escapeRedisTextSeparators } from '@/utils/newsFeed/redis/helpers';
import {
  NewsType,
  RedisCollaborationComment as RedisCollaborationComment,
  RedisCollaborationQuestion,
  RedisNewsFeedEntry,
  RedisPost,
  RedisProject,
  RedisProjectEvent,
  RedisProjectUpdate,
  RedisReaction,
  RedisSurveyQuestion,
  RedisUser,
} from '@/utils/newsFeed/redis/models';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';

type CollaborationComment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  text: string;
  likedBy: User[];
  responseCount: number;
  objectId: string;
  projectName: string;
  additionalObjectId?: string;
  isLikedByUser?: boolean;
};

export const mapPostToRedisNewsFeedEntry = (
  post: Post,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisPost(post, reactions, followedBy);

  post.author.image = mapImageUrlToRelativeUrl(post.author.image);
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: item.updatedAt,
    item,
    type: NewsType.POST,
    search: escapeRedisTextSeparators(item.content || ''),
  };
};

export const mapSurveyQuestionToRedisNewsFeedEntry = (
  surveyQuestion: SurveyQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisSurveyQuestion(surveyQuestion, reactions, followedBy);

  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: getUnixTimestamp(new Date(surveyQuestion.updatedAt)),
    item: item,
    type: NewsType.SURVEY_QUESTION,
    search: escapeRedisTextSeparators(item.question || ''),
  };
};

export const mapProjectToRedisNewsFeedEntry = (
  project: BasicProject,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisProject(project, reactions, followedBy);

  if (item.image) {
    project.image = mapImageFormatsToRelativeUrls(item.image);
  }

  if (item.author) {
    item.author.image = mapImageUrlToRelativeUrl(item.author.image);
  }

  item.team = mapUserImagesToRelativeUrls(item.team);
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: getUnixTimestamp(new Date(item.updatedAt)),
    item: item,
    type: NewsType.PROJECT,
    search: escapeRedisTextSeparators(
      (item.summary || '') +
        ' ' +
        (item.title || '') +
        ' ' +
        item.description.tags.map((tag) => tag.tag || '').join(' ') +
        ' ' +
        (item.description.text || ''),
    ),
  };
};

export const mapUpdateToRedisNewsFeedEntry = (
  update: ProjectUpdate,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  responseCount: number,
): RedisNewsFeedEntry => {
  const item = mapToRedisProjectUpdate(update, reactions, followedBy, responseCount);
  item.author.image = mapImageUrlToRelativeUrl(item.author.image);
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: getUnixTimestamp(new Date(update.updatedAt)),
    item: item,
    type: NewsType.UPDATE,
    search: escapeRedisTextSeparators((item.comment || '') + ' ' + (item.title || '')),
  };
};

export const mapEventToRedisNewsFeedEntry = async (
  event: Event,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): Promise<RedisNewsFeedEntry> => {
  const item = mapToRedisProjectEvent(event, reactions, followedBy);

  if (item.image) {
    item.image = mapImageFormatsToRelativeUrls(item.image);
  }

  if (item.author) {
    item.author.image = mapImageUrlToRelativeUrl(item.author.image);
  }

  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: getUnixTimestamp(new Date(item.updatedAt)),
    item: item,
    type: NewsType.EVENT,
    search: escapeRedisTextSeparators(
      (item.title || '') +
        ' ' +
        (item.description || '') +
        ' ' +
        (item.type || '') +
        ' ' +
        (item.themes ? item.themes.map((theme) => theme || '').join(' ') : ''),
    ),
  };
};

export const mapCollaborationQuestionToRedisNewsFeedEntry = (
  question: BasicCollaborationQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisCollaborationQuestion(question, reactions, followedBy);

  item.authors = mapUserImagesToRelativeUrls(question.authors);
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: getUnixTimestamp(new Date(item.updatedAt)),
    item: item,
    type: NewsType.COLLABORATION_QUESTION,
    search: escapeRedisTextSeparators((item.title || '') + ' ' + (item.description || '')),
  };
};

export const mapCollaborationCommentToRedisNewsFeedEntry = (
  comment: CollaborationComment,
  question: BasicCollaborationQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisCollaborationComment(comment, question, reactions, followedBy);
  item.author.image = mapImageUrlToRelativeUrl(item.author.image);
  item.question.authors = mapUserImagesToRelativeUrls(item.question.authors);
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: getUnixTimestamp(comment.createdAt),
    item: item,
    type: NewsType.COLLABORATION_COMMENT,
    search: escapeRedisTextSeparators((item.question || '') + ' ' + (item.comment || '')),
  };
};

export const mapRedisNewsFeedEntryToProjectUpdate = (item: RedisProjectUpdate): ProjectUpdate => {
  return {
    ...item,
    projectName: item.projectName,
    updatedAt: unixTimestampToDate(item.updatedAt),
    createdAt: unixTimestampToDate(item.createdAt),
    reactions: item.reactions.map((r) => {
      return { ...r, objectId: item.id, objectType: ObjectType.UPDATE };
    }),
  };
};

export const mapToRedisPost = (post: Post, reactions: RedisReaction[], followedBy: RedisUser[]): RedisPost => {
  return {
    id: post.id,
    author: post.author,
    content: post.content,
    reactions: reactions,
    likedBy: post.likedBy,
    updatedAt: getUnixTimestamp(post.updatedAt),
    createdAt: getUnixTimestamp(post.createdAt),
    followedBy,
    responseCount: post.responseCount,
    anonymous: post.anonymous,
  };
};

export const mapToRedisSurveyQuestion = (
  surveyQuestion: SurveyQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisSurveyQuestion => {
  return {
    id: surveyQuestion.id,
    projectId: surveyQuestion.projectId,
    question: surveyQuestion.question,
    responseOptions: surveyQuestion.responseOptions,
    votes: surveyQuestion.votes,
    reactions: reactions,
    updatedAt: getUnixTimestamp(surveyQuestion.updatedAt),
    followedBy,
  };
};

export const mapToRedisCollaborationQuestion = (
  question: BasicCollaborationQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisCollaborationQuestion => {
  return {
    id: question.id,
    projectId: question.projectId,
    updatedAt: getUnixTimestamp(question.updatedAt),
    authors: question.authors,
    title: question.title,
    description: question.description,
    reactions,
    followedBy,
  };
};

export const mapToRedisCollaborationComment = (
  comment: CollaborationComment,
  question: BasicCollaborationQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisCollaborationComment => {
  return {
    id: comment.id,
    createdAt: getUnixTimestamp(comment.createdAt),
    updatedAt: getUnixTimestamp(comment.createdAt),
    projectId: comment.objectId,
    author: comment.author,
    comment: comment.text,
    question: {
      id: question.id,
      authors: question.authors,
      description: question.description,
      title: question.title,
    },
    responseCount: comment.responseCount,
    likedBy: comment.likedBy.map((likedBy) => likedBy.id || ''),
    isLikedByUser: comment.isLikedByUser,
    reactions: reactions,
    followedBy: followedBy,
  };
};

const mapToRedisProject = (
  project: BasicProject,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisProject => {
  return {
    ...project,
    projectId: project.id,
    updatedAt: getUnixTimestamp(project.updatedAt),
    createdAt: getUnixTimestamp(project.createdAt),
    reactions,
    followedBy,
  };
};

export const mapToRedisProjectUpdate = (
  update: ProjectUpdate,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  responseCount: number,
): RedisProjectUpdate => {
  return {
    ...update,
    updatedAt: getUnixTimestamp(update.updatedAt),
    createdAt: getUnixTimestamp(update.createdAt),
    reactions,
    followedBy,
    responseCount,
  };
};

const mapToRedisProjectEvent = (
  event: Event,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisProjectEvent => {
  return {
    ...event,
    updatedAt: getUnixTimestamp(event.updatedAt),
    createdAt: getUnixTimestamp(event.createdAt),
    projectId: event.projectId,
    reactions,
    followedBy,
  };
};

export const mapToRedisUsers = async (userIds: string[]) => {
  return await getPromiseResults(userIds.map(mapToRedisUser));
};

export const mapToRedisUser = async (userId: string): Promise<RedisUser> => {
  const user = await getInnoUserByProviderId(userId);
  return user;
};

const mapImageFormatsToRelativeUrls = (imageFormats: ImageFormats) => {
  const sizes = ['xxlarge', 'xlarge', 'large', 'medium', 'small', 'xsmall', 'thumbnail'] as const;
  for (const size of sizes) {
    if (imageFormats[size]) {
      imageFormats[size].url = mapImageUrlToRelativeUrl(imageFormats[size].url) as string;
    }
  }
  return imageFormats;
};

const mapUserImagesToRelativeUrls = (users: (User | RedisUser)[]) => {
  users.forEach((user) => {
    user.image = mapImageUrlToRelativeUrl(user.image);
  });
  return users;
};

const mapImageUrlToRelativeUrl = (imageUrl: string | undefined): string | undefined => {
  if (!imageUrl) return undefined;

  if (!URL.canParse(imageUrl, clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT)) {
    return undefined;
  }

  const url = new URL(imageUrl);
  const externalImageHost = 'secure.gravatar.com';

  if (url.host.toLowerCase() === externalImageHost.toLowerCase()) {
    return imageUrl;
  }

  const path = url.pathname;
  return `{strapi_host}${path}`;
};
