import { useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import WriteCommentResponseCard from '@/components/common/comments/WriteCommentResponseCard';
import { errorMessage } from '@/components/common/CustomToast';
import { CommentThreadSkeleton } from '@/components/newsPage/cards/skeletons/CommentThreadSkeleton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { AuthResponse } from '@/utils/auth';
import { appInsights } from '@/utils/instrumentation/AppInsights';

import { useRespondingState } from '../../common/editing/editing-context';

interface CommentThreadProps<TComment> {
  comment: { id: string; commentCount: number; comments?: TComment[] };
  card: React.ReactNode;
  disableDivider?: boolean;
  indentComments?: React.CSSProperties['paddingLeft'];
  fetchComments: () => Promise<TComment[]>;
  renderComment: (
    comment: TComment,
    idx: number,
    deleteComment: () => void,
    updateComment: (comment: TComment) => void,
  ) => React.ReactNode;
  addComment: (text: string) => Promise<AuthResponse<TComment>>;
}

interface ThreadComment {
  id: string;
  createdAt: Date;
  commentCount?: number;
}

type CommentState<TComment> =
  | { isVisible: false; isLoading: false; data?: undefined }
  | { isVisible?: false; isLoading: true; data?: undefined }
  | { isVisible: true; isLoading?: false; data: TComment[] };

export const CommentThread = <TComment extends ThreadComment>(props: CommentThreadProps<TComment>) => {
  const {
    comment,
    card,
    comments,
    indentComments,
    showDivider,
    showLoadCommentsButton,
    loadComments,
    handleComment,
    updateComment,
    deleteComment,
    renderComment,
  } = useCommentThread(props);

  return (
    <Stack spacing={2}>
      <div>{card}</div>
      {showDivider && <Divider />}

      <WriteCommentResponseCard comment={comment} onRespond={handleComment} sx={{ mb: 1, pl: indentComments }} />

      {showLoadCommentsButton && (
        <Button
          startIcon={<AddIcon color="primary" fontSize="large" />}
          sx={{ ...transparentButtonStyles, pl: indentComments }}
          style={{ marginBottom: 2 }}
          onClick={loadComments}
        >
          {m.components_newsPage_cards_common_threads_itemWithCommentsThread_showMore()} ({comment.commentCount})
        </Button>
      )}

      {comments.isLoading && <CommentThreadSkeleton sx={{ pl: indentComments, mt: 2 }} />}

      {comments.isVisible && (
        <Stack spacing={2} sx={{ pl: indentComments }}>
          {comments.data.map((comment, idx) =>
            renderComment(comment, idx, () => deleteComment(comment), updateComment),
          )}
        </Stack>
      )}
      {/* TODO: Temporary solution till the comments are loaded from redis */}
      {!showLoadCommentsButton && comment && comment.comments && (
        <Stack spacing={2} sx={{ pl: indentComments }}>
          {comment.comments.map(
            (comment, idx) =>
              typeof comment != 'string' && renderComment(comment, idx, () => deleteComment(comment), updateComment),
          )}
        </Stack>
      )}
    </Stack>
  );
};

const useCommentThread = <TComment extends ThreadComment>(props: CommentThreadProps<TComment>) => {
  const { comment, card, disableDivider, indentComments, fetchComments, renderComment, addComment } = props;
  const [comments, setComments] = useState<CommentState<TComment>>({ isVisible: false, isLoading: false });
  const state = useRespondingState();

  const commentsExist = comment.commentCount > 0 || (comments.data?.length ?? 0) > 0;

  const loadComments = async () => {
    setComments({ isLoading: true });
    const comments = await fetchSortedComments();
    if (comments) {
      setComments({ isVisible: true, data: comments });
    } else {
      setComments({ isVisible: false, isLoading: false });
    }
  };

  const handleComment = async (commentText: string) => {
    try {
      const currentComments = comments.data ?? (await fetchSortedComments());
      if (!currentComments) return;

      const result = await addComment(commentText);
      const createdComment = result?.data;
      if (!createdComment) return;

      const newComments = [createdComment, ...currentComments];
      setComments({ isVisible: true, data: newComments });
    } catch (error) {
      console.error('Error adding comment:', error);
      errorMessage({ message: m.components_newsPage_thread_add_comment_error() });
      appInsights.trackException({
        exception: new Error('Failed to add comment', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const deleteComment = (comment: TComment) => {
    const filteredComments = comments.data?.filter((r) => r.id !== comment.id) ?? [];
    setComments({ isVisible: true, data: filteredComments });
  };

  const updateComment = (comment: TComment) => {
    if (!comments.data) return;
    const idx = comments.data.findIndex((r) => r.id === comment.id);
    if (idx < 0) {
      return;
    }
    const newComments = comments.data;
    newComments[idx] = comment;
    setComments({ data: newComments, isVisible: true });
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

  const sortComments = (comments: TComment[]) => comments.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  const searchedResult = comment.comments && comment.comments.length > 0 && typeof comment.comments[0] !== 'string';

  return {
    comment,
    card,
    comments,
    indentComments,
    showLoadCommentsButton: !searchedResult && !comments.isVisible && !comments.isLoading && comment.commentCount > 0,
    showDivider: !disableDivider && (commentsExist || state.isEditing(comment)),
    handleComment,
    deleteComment,
    updateComment,
    loadComments,
    renderComment,
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
