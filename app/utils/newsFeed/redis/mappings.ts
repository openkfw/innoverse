import {
  BasicCollaborationQuestion,
  BasicProject,
  CommentWithResponses,
  Event,
  ImageFormats,
  ObjectType,
  Post,
  ProjectUpdate,
  SurveyQuestion,
  User,
} from '@/common/types';
import { clientConfig } from '@/config/client';
import { CommentDB } from '@/repository/db/utils/types';
import { getUnixTimestamp, unixTimestampToDate } from '@/utils/helpers';
import { escapeRedisTextSeparators } from '@/utils/newsFeed/redis/helpers';
import {
  NewsType,
  RedisCollaborationQuestion,
  RedisNewsComment,
  RedisNewsFeedEntry,
  RedisPost,
  RedisProject,
  RedisProjectEvent,
  RedisProjectUpdate,
  RedisReaction,
  RedisSurveyQuestion,
  RedisUser,
} from '@/utils/newsFeed/redis/models';
import { getInnoUserByProviderId, getInnoUsersByProviderIds } from '@/utils/requests/innoUsers/requests';

export const mapPostToRedisNewsFeedEntry = (
  post: Post,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): RedisNewsFeedEntry => {
  const item = mapToRedisPost(post, reactions, followedBy, comments);

  post.author.image = mapImageUrlToRelativeUrl(post.author.image);
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: item.updatedAt,
    item,
    type: NewsType.POST,
    search: escapeRedisTextSeparators(item.comment || ''),
  };
};

export const mapSurveyQuestionToRedisNewsFeedEntry = (
  surveyQuestion: SurveyQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): RedisNewsFeedEntry => {
  const item = mapToRedisSurveyQuestion(surveyQuestion, reactions, followedBy, comments);

  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: item.updatedAt,
    item: item,
    type: NewsType.SURVEY_QUESTION,
    search: escapeRedisTextSeparators(item.question || ''),
  };
};

export const mapProjectToRedisNewsFeedEntry = (
  project: BasicProject,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): RedisNewsFeedEntry => {
  const item = mapToRedisProject(project, reactions, followedBy, comments);

  if (item.image) {
    project.image = mapImageFormatsToRelativeUrls(item.image);
  }

  if (item.author) {
    item.author.image = mapImageUrlToRelativeUrl(item.author.image);
  }

  item.team = mapUserImagesToRelativeUrls(item.team);
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: item.updatedAt,
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
  comments: CommentWithResponses[],
): RedisNewsFeedEntry => {
  const item = mapToRedisProjectUpdate(update, reactions, followedBy, comments);
  item.author.image = mapImageUrlToRelativeUrl(item.author.image);
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: item.updatedAt,
    item: item,
    type: NewsType.UPDATE,
    search: escapeRedisTextSeparators((item.comment || '') + ' ' + (item.title || '')),
  };
};

export const mapEventToRedisNewsFeedEntry = async (
  event: Event,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): Promise<RedisNewsFeedEntry> => {
  const item = mapToRedisProjectEvent(event, reactions, followedBy, comments);
  if (item.image) {
    item.image = mapImageFormatsToRelativeUrls(item.image);
  }
  if (item.author) {
    item.author.image = mapImageUrlToRelativeUrl(item.author.image);
  }
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);
  return {
    updatedAt: item.updatedAt,
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
  comments: CommentWithResponses[],
): RedisNewsFeedEntry => {
  const item = mapToRedisCollaborationQuestion(question, reactions, followedBy, comments);

  item.authors = mapUserImagesToRelativeUrls(question.authors);
  item.followedBy = mapUserImagesToRelativeUrls(item.followedBy ?? []);

  return {
    updatedAt: item.updatedAt,
    item: item,
    type: NewsType.COLLABORATION_QUESTION,
    search: escapeRedisTextSeparators((item.title || '') + ' ' + (item.description || '')),
  };
};

export const mapRedisNewsFeedEntryToProjectUpdate = (item: RedisProjectUpdate): ProjectUpdate => {
  return {
    ...item,
    projectName: item.projectName,
    updatedAt: unixTimestampToDate(item.updatedAt),
    createdAt: unixTimestampToDate(item.createdAt),
    objectType: ObjectType.UPDATE,
    reactions: item.reactions.map((r) => {
      return { ...r, objectId: item.id, objectType: ObjectType.UPDATE };
    }),
  };
};

export const mapToRedisPost = (
  post: Post,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): RedisPost => {
  return {
    id: post.id,
    author: post.author,
    comment: post.comment,
    reactions: reactions,
    likedBy: post.likedBy,
    updatedAt: getUnixTimestamp(post.updatedAt),
    createdAt: getUnixTimestamp(post.createdAt),
    followedBy,
    anonymous: post.anonymous,
    comments: mapCommentWithResponsesToRedisNewsComments(comments),
  };
};

export const mapToRedisSurveyQuestion = (
  surveyQuestion: SurveyQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): RedisSurveyQuestion => {
  return {
    id: surveyQuestion.id,
    projectId: surveyQuestion.projectId,
    projectName: surveyQuestion.projectName,
    question: surveyQuestion.question,
    responseOptions: surveyQuestion.responseOptions,
    votes: surveyQuestion.votes,
    reactions: reactions,
    updatedAt: getUnixTimestamp(surveyQuestion.updatedAt),
    followedBy,
    comments: mapCommentWithResponsesToRedisNewsComments(comments),
  };
};

export const mapToRedisCollaborationQuestion = (
  question: BasicCollaborationQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): RedisCollaborationQuestion => {
  return {
    id: question.id,
    projectId: question.projectId,
    projectName: question.projectName,
    updatedAt: getUnixTimestamp(question.updatedAt),
    authors: question.authors,
    title: question.title,
    description: question.description,
    reactions,
    followedBy,
    comments: mapCommentWithResponsesToRedisNewsComments(comments),
  };
};

const mapToRedisProject = (
  project: BasicProject,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): RedisProject => {
  return {
    ...project,
    projectId: project.id,
    updatedAt: getUnixTimestamp(project.updatedAt),
    createdAt: getUnixTimestamp(project.createdAt),
    reactions,
    followedBy,
    comments: mapCommentWithResponsesToRedisNewsComments(comments),
  };
};

export const mapToRedisProjectUpdate = (
  update: ProjectUpdate,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): RedisProjectUpdate => {
  return {
    ...update,
    updatedAt: getUnixTimestamp(update.updatedAt),
    createdAt: getUnixTimestamp(update.createdAt),
    reactions,
    followedBy,
    comments,
  };
};

const mapToRedisProjectEvent = (
  event: Event,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  comments: CommentWithResponses[],
): RedisProjectEvent => {
  return {
    ...event,
    updatedAt: getUnixTimestamp(event.updatedAt),
    createdAt: getUnixTimestamp(event.createdAt),
    projectId: event.projectId,
    reactions,
    followedBy,
    comments: mapCommentWithResponsesToRedisNewsComments(comments),
  };
};

export const mapCommentWithResponsesToRedisNewsComments = (comments: CommentWithResponses[]) => {
  return comments.map(mapToRedisNewsComment);
};

export const mapToRedisNewsComment = (comment: CommentWithResponses): RedisNewsComment => {
  return {
    id: comment.id,
    text: comment.text,
    likedBy: comment.likes?.map((like) => like.likedBy),
    author: comment.author,
    parentId: comment.parentId,
    comments: comment.comments.map((comment) => mapToRedisNewsComment(comment)),
    updatedAt: getUnixTimestamp(comment.updatedAt),
    createdAt: getUnixTimestamp(comment.createdAt),
  };
};

export const mapDBCommentToRedisComment = async (newsComment: CommentDB): Promise<RedisNewsComment> => {
  const author = await getInnoUserByProviderId(newsComment.author);

  return {
    id: newsComment.id,
    createdAt: getUnixTimestamp(newsComment.createdAt),
    updatedAt: getUnixTimestamp(newsComment.updatedAt),
    text: newsComment.text,
    author: author,
    likedBy: newsComment.likes?.map((like) => like.likedBy),
    commentCount: newsComment.responses.length,
  };
};

export const mapToRedisUsers = async (userIds: string[]) => {
  return await getInnoUsersByProviderIds(userIds);
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

export const mapImageUrlToRelativeUrl = (imageUrl: string | undefined): string | undefined => {
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

export const getNewsTypeByString = (type: string) => {
  switch (type) {
    case ObjectType.COLLABORATION_QUESTION:
      return NewsType.COLLABORATION_QUESTION;
    case ObjectType.PROJECT:
      return NewsType.PROJECT;
    case ObjectType.EVENT:
      return NewsType.EVENT;
    case ObjectType.OPPORTUNITY:
      return NewsType.OPPORTUNITY;
    case ObjectType.POST:
      return NewsType.POST;
    case ObjectType.SURVEY_QUESTION:
      return NewsType.SURVEY_QUESTION;
    case ObjectType.UPDATE:
      return NewsType.UPDATE;
    default:
      throw Error(`Unknown new feed object type '${type}'`);
  }
};
