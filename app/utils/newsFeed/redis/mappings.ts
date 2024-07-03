import {
  BasicCollaborationQuestion,
  BasicProject,
  Event,
  Post,
  ProjectUpdate,
  SurveyQuestion,
  User,
} from '@/common/types';
import { getPromiseResults, getUnixTimestamp } from '@/utils/helpers';
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
  comment: string;
  upvotedBy: string[];
  responseCount: number;
  projectId: string;
  projectName: string;
  questionId: string;
  isUpvotedByUser?: boolean;
};

export const mapPostToRedisNewsFeedEntry = (
  post: Post,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisPost(post, reactions, followedBy);
  return {
    updatedAt: item.updatedAt,
    item,
    type: NewsType.POST,
  };
};

export const mapSurveyQuestionToRedisNewsFeedEntry = (
  surveyQuestion: SurveyQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisSurveyQuestion(surveyQuestion, reactions, followedBy);
  return {
    updatedAt: getUnixTimestamp(new Date(surveyQuestion.updatedAt)),
    item: item,
    type: NewsType.SURVEY_QUESTION,
  };
};

export const mapProjectToRedisNewsFeedEntry = (
  project: BasicProject,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisProject(project, reactions, followedBy);
  return {
    updatedAt: getUnixTimestamp(new Date(project.updatedAt)),
    item: item,
    type: NewsType.PROJECT,
  };
};

export const mapUpdateToRedisNewsFeedEntry = (
  update: ProjectUpdate,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
  responseCount: number,
): RedisNewsFeedEntry => {
  const item = mapToRedisProjectUpdate(update, reactions, followedBy, responseCount);
  return {
    updatedAt: getUnixTimestamp(new Date(update.updatedAt)),
    item: item,
    type: NewsType.UPDATE,
  };
};

export const mapEventToRedisNewsFeedEntry = async (
  event: Event,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): Promise<RedisNewsFeedEntry> => {
  const item = mapToRedisProjectEvent(event, reactions, followedBy);
  return {
    updatedAt: getUnixTimestamp(event.updatedAt),
    item: item,
    type: NewsType.EVENT,
  };
};

export const mapCollaborationQuestionToRedisNewsFeedEntry = (
  question: BasicCollaborationQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisCollaborationQuestion(question, reactions, followedBy);
  return {
    updatedAt: getUnixTimestamp(question.updatedAt),
    item: item,
    type: NewsType.COLLABORATION_QUESTION,
  };
};

export const mapCollaborationCommentToRedisNewsFeedEntry = (
  comment: CollaborationComment,
  question: BasicCollaborationQuestion,
  reactions: RedisReaction[],
  followedBy: RedisUser[],
): RedisNewsFeedEntry => {
  const item = mapToRedisCollaborationComment(comment, question, reactions, followedBy);
  return {
    updatedAt: getUnixTimestamp(comment.createdAt),
    item: item,
    type: NewsType.COLLABORATION_COMMENT,
  };
};

export const mapToRedisPost = (post: Post, reactions: RedisReaction[], followedBy: RedisUser[]): RedisPost => {
  return {
    id: post.id,
    author: post.author,
    content: post.content,
    reactions: reactions,
    upvotedBy: post.upvotedBy,
    updatedAt: getUnixTimestamp(post.updatedAt),
    createdAt: getUnixTimestamp(post.createdAt),
    followedBy,
    responseCount: post.responseCount,
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
    projectId: comment.projectId,
    author: comment.author,
    comment: comment.comment,
    question: {
      id: question.id,
      authors: question.authors,
      description: question.description,
      title: question.title,
    },
    responseCount: comment.responseCount,
    upvotedBy: comment.upvotedBy,
    isUpvotedByUser: comment.isUpvotedByUser,
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
  // TODO: Run this against Redis.
  const user = await getInnoUserByProviderId(userId);
  return user;
};