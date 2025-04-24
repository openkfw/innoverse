import { useEffect, useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { CommentWithResponses, ObjectType, User } from '@/common/types';
import WriteCommentResponseCard from '@/components/common/comments/WriteCommentResponseCard';
import { errorMessage } from '@/components/common/CustomToast';
import WriteTextCard from '@/components/common/editing/writeText/WriteTextCard';
import { CommentThreadSkeleton } from '@/components/newsPage/cards/skeletons/CommentThreadSkeleton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { appInsights } from '@/utils/instrumentation/AppInsights';
import { getCommentsByObjectId } from '@/utils/requests/comments/requests';

import { useRespondingState } from '../../common/editing/editing-context';

import { addUserComment } from './actions';

interface CommentThreadProps {
  item: {
    id: string;
    comments?: CommentWithResponses[];
    author?: User;
    anonymous?: boolean;
    commentCount?: number;
    projectId?: string;
  };
  itemType: ObjectType;
  card?: React.ReactNode;
  disableDivider?: boolean;
  indentComments?: React.CSSProperties['paddingLeft'];
  renderComment?: (
    comment: CommentWithResponses,
    idx: number,
    deleteComment: () => void,
    updateComment: (comment: CommentWithResponses) => void,
  ) => React.ReactNode;
  enableEditing?: boolean;
}

type CommentState =
  | { isVisible: false; isLoading: false; data?: undefined }
  | { isVisible?: false; isLoading: true; data?: undefined }
  | { isVisible: true; isLoading?: false; data: CommentWithResponses[] }
  | { isVisible: false; isLoading?: false; data: CommentWithResponses[] };

export const CommentThread = (props: CommentThreadProps) => {
  const {
    item,
    card,
    comments,
    indentComments,
    showDivider,
    showLoadCommentsButton,
    showCloseThreadButton,
    commentCount,
    loadComments,
    collapseComments,
    handleAddComment,
    updateComment,
    deleteComment,
    renderComment,
    enableEditing,
  } = useCommentThread(props);

  return (
    <Stack spacing={2}>
      <div>{card}</div>
      {showDivider && <Divider />}
      {enableEditing && <WriteTextCard onSubmit={handleAddComment} sx={{ width: '622px', maxWidth: '100%' }} />}
      <WriteCommentResponseCard comment={item} onRespond={handleAddComment} sx={{ mb: 1, pl: indentComments }} />
      {showLoadCommentsButton && (
        <Button
          startIcon={<AddIcon color="primary" fontSize="large" />}
          sx={{ ...transparentButtonStyles, pl: indentComments }}
          style={{ marginBottom: 2 }}
          onClick={loadComments}
        >
          {m.components_newsPage_cards_common_threads_itemWithCommentsThread_showMore()} ({commentCount})
        </Button>
      )}
      {showCloseThreadButton && (
        <Button
          startIcon={<RemoveIcon color="primary" fontSize="large" />}
          sx={{ ...transparentButtonStyles, pl: indentComments }}
          style={{ marginBottom: 2 }}
          onClick={collapseComments}
        >
          {m.components_newsPage_cards_common_threads_itemWithCommentsThread_showLess()}
        </Button>
      )}
      {comments.isLoading && <CommentThreadSkeleton sx={{ pl: indentComments, mt: 2 }} />}
      {comments.isVisible && (
        <Stack spacing={2} sx={{ pl: indentComments }}>
          {comments.data.map(
            (comment, idx) =>
              typeof comment != 'string' &&
              renderComment &&
              renderComment(comment, idx, () => deleteComment, updateComment),
          )}
        </Stack>
      )}
    </Stack>
  );
};

export const useCommentThread = (props: CommentThreadProps) => {
  const { item, itemType, card, disableDivider, indentComments, renderComment, enableEditing } = props;
  const [comments, setComments] = useState<CommentState>({ isVisible: false, isLoading: false });
  const initialCommentCount = item.comments?.length ?? item.commentCount ?? 0;
  const [commentCount, setCommentCount] = useState<number>(initialCommentCount);
  const [commentsExist, setCommentsExist] = useState<boolean>(initialCommentCount > 0);

  const state = useRespondingState();

  /* TODO: Temporary solution till the comments are loaded from redis */
  useEffect(() => {
    if (item.comments) {
      const searchedComments = item.comments.filter((comment) => typeof comment != 'string');
      if (searchedComments.length > 0) {
        setComments({ isVisible: true, data: searchedComments });
      }
    }
  }, [item.comments]);

  const loadComments = async () => {
    setComments({ isLoading: true });
    const comments = await fetchSortedComments();
    if (comments) {
      setComments({ isVisible: true, data: comments });
    } else {
      setComments({ isVisible: false, isLoading: false });
    }
  };

  const collapseComments = () => {
    setComments({ isVisible: false, data: [] });
  };

  const addComment = async (text: string) => {
    const comment = await addUserComment({
      comment: text,
      objectId: item.id,
      objectType: itemType,
      ...(item.projectId && { projectId: item.projectId }),
      ...(itemType === ObjectType.COLLABORATION_QUESTION && {
        additionalObjectId: item.projectId,
        additionalObjectType: ObjectType.PROJECT,
      }),
    });
    if (!comment.data) return undefined;
    return {
      ...comment.data,
      comments: [],
    };
  };

  const handleAddComment = async (commentText: string) => {
    try {
      const currentComments = comments.data ?? (await fetchSortedComments());
      if (!currentComments) return;

      const createdComment = await addComment(commentText);
      if (!createdComment) return;

      const newComments = [createdComment, ...currentComments];
      setComments({ isVisible: true, data: newComments });
      setCommentCount(commentCount + 1);
      setCommentsExist(true);
    } catch (error) {
      console.error('Error adding comment:', error);
      errorMessage({ message: m.components_newsPage_thread_add_comment_error() });
      appInsights.trackException({
        exception: new Error('Failed to add comment', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const deleteComment = (comment: CommentWithResponses) => {
    const filteredComments = comments.data?.filter((r) => r.id !== comment.id) ?? [];
    setComments({ isVisible: true, data: filteredComments });
    setCommentCount(commentCount - 1);
    if (filteredComments.length === 0) setCommentsExist(false);
  };

  const updateComment = (comment: CommentWithResponses) => {
    if (!comments.data) return;
    const idx = comments.data.findIndex((r) => r.id === comment.id);
    if (idx < 0) {
      return;
    }
    const newComments = comments.data;
    newComments[idx] = comment;
    const commentResponsesLength = comment.comments ? comment.comments.length : 0;
    setComments({ data: newComments, isVisible: true });
    setCommentCount(newComments.length + commentResponsesLength);
  };

  const fetchComments = async () => {
    const result = await getCommentsByObjectId({ objectId: item.id, objectType: itemType });
    return result.data;
  };

  const fetchSortedComments = async () => {
    try {
      const comments = await fetchComments();
      if (!comments) return;
      const sortedComments = sortComments(comments);
      return sortedComments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      errorMessage({ message: m.components_newsPage_thread_fetch_error() });
      appInsights.trackException({
        exception: new Error('Failed to fetch comments', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const sortComments = (comments: CommentWithResponses[]) =>
    comments.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  const searchedResult = item.comments && item.comments.length > 0 && typeof item.comments[0] !== 'string';

  return {
    item,
    itemType,
    card,
    comments,
    indentComments,
    showLoadCommentsButton: !searchedResult && !comments.isVisible && !comments.isLoading && commentsExist,
    showCloseThreadButton: !searchedResult && comments.isVisible && !comments.isLoading && commentsExist,
    showDivider: !disableDivider && (commentsExist || state.isEditing(item)),
    commentCount,
    setCommentCount,
    handleAddComment,
    deleteComment,
    updateComment,
    loadComments,
    collapseComments,
    renderComment,
    enableEditing,
  };
};

const transparentButtonStyles: SxProps = {
  background: 'transparent',
  color: theme.palette.primary.main,
  ':hover': {
    background: 'transparent',
    color: theme.palette.primary.main,
  },
  mr: 'auto',
  p: 0,
  justifyContent: 'start',
};
