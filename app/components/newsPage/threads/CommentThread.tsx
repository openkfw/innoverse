import { useEffect, useMemo, useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { CommentWithResponses, ObjectType, User } from '@/common/types';
import WriteCommentResponseCard from '@/components/common/comments/WriteCommentResponseCard';
import { errorMessage } from '@/components/common/CustomToast';
import { useRespondingInteractions, useRespondingState } from '@/components/common/editing/responding-context';
import { CommentThreadSkeleton } from '@/components/newsPage/cards/skeletons/CommentThreadSkeleton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { appInsights } from '@/utils/instrumentation/AppInsights';
import { getCommentsByObjectId } from '@/utils/requests/comments/requests';

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
  enableCommenting?: boolean;
  showCommentCount?: boolean;
  maxNumberOfComments?: number;
}

type CommentState =
  | { isVisible: false; isLoading: false; isExpanded?: false; data?: undefined }
  | { isVisible?: false; isLoading: true; isExpanded?: false; data?: undefined }
  | { isVisible: true; isLoading?: false; isExpanded?: boolean; data: CommentWithResponses[] }
  | { isVisible: false; isLoading?: false; isExpanded?: false; data: CommentWithResponses[] };

export const CommentThread = (props: CommentThreadProps) => {
  const {
    item,
    card,
    comments,
    indentComments,
    showDivider,
    showLoadCommentsButton,
    showCloseThreadButton,
    loadComments,
    handleAddComment,
    updateComment,
    deleteComment,
    renderComment,
    enableCommenting,
    showCommentCount,
    maxNumberOfComments,
    visibleComments,
    remainingCommentCount,
    totalCommentCountWithResponses,
    toggleComments,
  } = useCommentThread(props);
  const respondingInteractions = useRespondingInteractions();

  useEffect(() => {
    async function fetchData() {
      if (maxNumberOfComments > 0) await loadComments(maxNumberOfComments);
      if (item && enableCommenting) {
        respondingInteractions.onStart(item, 'respond');
      }
    }
    fetchData();
  }, [item]);

  return (
    <Stack spacing={2}>
      <div>{card}</div>
      {showDivider && <Divider />}
      {showCommentCount && (
        <Typography variant="caption" color="text.secondary" sx={{ marginTop: 1, marginBottom: 3 }}>
          {totalCommentCountWithResponses} {m.components_projectdetails_comments_commentsSection_comments()}
        </Typography>
      )}
      <WriteCommentResponseCard
        enableCommenting={enableCommenting}
        comment={item}
        onRespond={handleAddComment}
        sx={{ mb: 1, pl: indentComments }}
      />
      {comments.isLoading && <CommentThreadSkeleton sx={{ pl: indentComments, mt: 2 }} />}
      {showLoadCommentsButton && (
        <Button
          startIcon={<AddIcon color="primary" fontSize="large" />}
          sx={{ ...transparentButtonStyles }}
          onClick={toggleComments}
        >
          {m.components_newsPage_cards_common_threads_itemWithCommentsThread_showMore()} ({remainingCommentCount})
        </Button>
      )}
      {showCloseThreadButton && (
        <Button
          startIcon={<RemoveIcon color="primary" fontSize="large" />}
          sx={{ ...transparentButtonStyles }}
          onClick={toggleComments}
        >
          {m.components_newsPage_cards_common_threads_itemWithCommentsThread_showLess()}
        </Button>
      )}
      <Stack spacing={2} sx={{ pl: indentComments }}>
        {visibleComments.map(
          (comment, idx) =>
            typeof comment != 'string' &&
            renderComment &&
            renderComment(
              comment,
              idx,
              () => deleteComment(comment),
              (updatedComment) => updateComment(updatedComment),
            ),
        )}
      </Stack>
    </Stack>
  );
};

export const useCommentThread = (props: CommentThreadProps) => {
  const {
    item,
    itemType,
    card,
    disableDivider,
    indentComments,
    renderComment,
    enableCommenting,
    maxNumberOfComments = 0,
    showCommentCount = false,
  } = props;
  const [comments, setComments] = useState<CommentState>({
    isVisible: false,
    isLoading: false,
    isExpanded: false,
  });
  const [totalCommentCount, setTotalCommentCount] = useState<number>(() => {
    if (typeof item.commentCount === 'number') return item.commentCount;
    if (Array.isArray(item.comments) && item.comments.every((c) => typeof c === 'string')) {
      return item.comments.length;
    }
    return 0;
  });
  const [remainingCommentCount, setRemainingCommentCount] = useState<number | null>(null);

  const { isSearchFilterActive } = useNewsFeed();
  const state = useRespondingState();

  const getVisibleCountWithResponses = (comments: CommentWithResponses[]) => {
    return comments.reduce((acc, comment) => acc + 1 + (comment.comments?.length || 0), 0);
  };

  const commentsExist = useMemo(
    () => (comments.data?.length ?? 0) > 0 || totalCommentCount > 0,
    [comments.data, totalCommentCount],
  );

  const visibleComments = useMemo(() => {
    if (!comments.data) return [];
    if (comments.isExpanded || isSearchFilterActive) return comments.data;

    const result: CommentWithResponses[] = [];
    let totalVisible = 0;
    for (const comment of comments.data) {
      if (totalVisible + 1 > maxNumberOfComments) break;
      result.push(comment);
      totalVisible += 1;
    }
    return result;
  }, [comments.isExpanded, comments.data, maxNumberOfComments, isSearchFilterActive]);

  useEffect(() => {
    if (remainingCommentCount === null && totalCommentCount !== null) {
      setRemainingCommentCount(Math.max(0, totalCommentCount - maxNumberOfComments));
    }
  }, [remainingCommentCount, totalCommentCount, maxNumberOfComments]);

  useEffect(() => {
    if (totalCommentCount !== null && visibleComments !== null) {
      const visibleWithResponses = getVisibleCountWithResponses(visibleComments);
      const remaining = Math.max(0, totalCommentCount - visibleWithResponses);
      setRemainingCommentCount(remaining);
    }
  }, [totalCommentCount, visibleComments]);

  const fetchComments = async (limit?: number) => {
    const result = await getCommentsByObjectId({ objectId: item.id, objectType: itemType, limit });
    return { comments: result.data?.comments, totalCount: result.data?.totalCount };
  };

  const fetchSortedComments = async (limit?: number) => {
    try {
      const { comments, totalCount } = await fetchComments(limit);
      if (!comments || totalCount == null || isNaN(totalCount)) return;
      setTotalCommentCount(totalCount);
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      errorMessage({ message: m.components_newsPage_thread_fetch_error() });
      appInsights.trackException({
        exception: new Error('Failed to fetch comments', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const toggleComments = async () => {
    if (!comments.isExpanded) {
      await loadComments();
    } else {
      setComments((prev) => ({
        ...prev,
        isExpanded: false,
      }));
    }
  };

  const loadComments = async (limit?: number) => {
    setComments({ isLoading: true });
    const comments = await fetchSortedComments(limit);
    if (comments) {
      setComments((prev) => ({
        ...prev,
        data: comments,
        isVisible: true,
        isExpanded: !limit,
        isLoading: false,
      }));
    } else {
      setComments((prev) => ({
        ...prev,
        isLoading: false,
        isVisible: false,
        isExpanded: false,
      }));
    }
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
    return { ...comment.data, comments: [] };
  };

  const handleAddComment = async (commentText: string) => {
    try {
      const createdComment = await addComment(commentText);
      if (!createdComment) return;

      setComments((prev) => ({
        data: [createdComment, ...(prev?.data ?? [])],
        isVisible: true,
        isExpanded: prev?.isExpanded ?? false,
      }));

      setTotalCommentCount((prev) => prev + 1);
      setRemainingCommentCount(null);
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
    const filtered = comments.data?.filter((c) => c.id !== comment.id) ?? [];
    const responsesCount = Array.isArray(comment.comments) ? comment.comments.length : 0;
    const totalToRemove = 1 + responsesCount;
    setTotalCommentCount((prev) => Math.max(0, prev - totalToRemove));
    setComments({ isVisible: true, data: filtered, isExpanded: comments.isExpanded });
    setRemainingCommentCount(null);
  };

  const updateComment = (comment: CommentWithResponses) => {
    if (!comments.data) return;
    const idx = comments.data.findIndex((r) => r.id === comment.id);
    if (idx < 0) return;
    const updatedComments = [...comments.data];
    updatedComments[idx] = comment;
    const totalResponses = updatedComments.reduce((sum, c) => {
      return sum + (Array.isArray(c.comments) ? c.comments.length : 0);
    }, 0);
    setTotalCommentCount(updatedComments.length + totalResponses);
    setComments({ data: updatedComments, isVisible: true, isExpanded: comments.isExpanded });
  };

  return {
    item,
    itemType,
    card,
    comments,
    indentComments,
    showLoadCommentsButton:
      !comments.isLoading &&
      !comments.isExpanded &&
      commentsExist &&
      remainingCommentCount !== null &&
      remainingCommentCount > 0 &&
      !isSearchFilterActive,
    showCloseThreadButton: comments.isVisible && commentsExist && comments.isExpanded,
    showDivider: !disableDivider && (commentsExist || state.isResponding(item, 'comment')),
    handleAddComment,
    deleteComment,
    updateComment,
    loadComments,
    renderComment,
    toggleComments,
    enableCommenting,
    showCommentCount,
    maxNumberOfComments,
    visibleComments,
    remainingCommentCount,
    totalCommentCountWithResponses: totalCommentCount,
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
