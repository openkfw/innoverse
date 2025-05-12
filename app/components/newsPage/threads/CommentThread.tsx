import { useCallback, useEffect, useMemo, useState } from 'react';
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
    loadComments,
    handleAddComment,
    updateComment,
    deleteComment,
    renderComment,
    enableCommenting,
    showCommentCount,
    maxNumberOfComments,
    visibleComments,
    setShowAllComments,
    totalCommentCountWithResponses,
  } = useCommentThread(props);
  const respondingInteractions = useRespondingInteractions();

  useEffect(() => {
    async function fetchData() {
      if (maxNumberOfComments > 0) await loadComments();
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
        {showLoadCommentsButton && (
          <Button
            startIcon={<AddIcon color="primary" fontSize="large" />}
            sx={{ ...transparentButtonStyles }}
            onClick={async () => {
              if (maxNumberOfComments === 0 && !comments.data) {
                await loadComments();
              }
              setShowAllComments(true);
            }}
          >
            {m.components_newsPage_cards_common_threads_itemWithCommentsThread_showMore()} (
            {totalCommentCountWithResponses - maxNumberOfComments})
          </Button>
        )}
        {showCloseThreadButton && (
          <Button
            startIcon={<RemoveIcon color="primary" fontSize="large" />}
            sx={{ ...transparentButtonStyles }}
            onClick={() => setShowAllComments(false)}
          >
            {m.components_newsPage_cards_common_threads_itemWithCommentsThread_showLess()}
          </Button>
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
  const [comments, setComments] = useState<CommentState>({ isVisible: false, isLoading: false });
  const [showAllComments, setShowAllComments] = useState(false);
  const [totalCommentCount, setTotalCommentCount] = useState<number>(() => {
    if (typeof item.commentCount === 'number') return item.commentCount;
    if (Array.isArray(item.comments) && item.comments.every((c) => typeof c === 'string')) {
      return item.comments.length;
    }
    return 0;
  });

  const { isSearchFilterActive } = useNewsFeed();

  const countComments = useCallback(
    (commentsList: CommentWithResponses[] = []): number =>
      commentsList.reduce((total, comment) => total + 1 + countComments(comment.comments ?? []), 0),
    [],
  );

  // Update count of the comments only when needed
  useEffect(() => {
    if (
      typeof item.commentCount !== 'number' &&
      (!Array.isArray(item.comments) || !item.comments.every((c) => typeof c === 'string')) &&
      comments.data
    ) {
      setTotalCommentCount(countComments(comments.data));
    }
  }, [comments.data, countComments, item.commentCount, item.comments]);

  const commentsExist = useMemo(
    () => (comments.data?.length ?? 0) > 0 || totalCommentCount > 0,
    [comments.data, totalCommentCount],
  );

  const visibleComments = useMemo(() => {
    if (!comments.isVisible || !comments.data) return [];
    if (showAllComments || isSearchFilterActive) return comments.data;

    const result: CommentWithResponses[] = [];
    let totalVisible = 0;
    for (const comment of comments.data) {
      const count = 1 + (comment.comments?.length ?? 0);
      if (totalVisible + count > maxNumberOfComments) break;

      result.push(comment);
      totalVisible += count;
    }
    return result;
  }, [comments.isVisible, comments.data, maxNumberOfComments, showAllComments, isSearchFilterActive]);

  const state = useRespondingState();

  useEffect(() => {
    if (item.comments && isSearchFilterActive) {
      const searchedComments = item.comments.filter((comment) => typeof comment !== 'string');
      if (searchedComments.length > 0) {
        setComments({ isVisible: true, data: searchedComments });
        setTotalCommentCount(countComments(searchedComments));
      }
    }
  }, [item.comments, isSearchFilterActive, countComments]);

  const fetchComments = async () => {
    const result = await getCommentsByObjectId({ objectId: item.id, objectType: itemType });
    return result.data;
  };

  const fetchSortedComments = async () => {
    try {
      const comments = await fetchComments();
      if (!comments) return;
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

  const loadComments = async () => {
    setComments({ isLoading: true });
    const comments = await fetchSortedComments();
    if (comments) {
      setComments({ isVisible: true, data: comments });
      setTotalCommentCount(countComments(comments));
    } else {
      setComments({ isVisible: false, isLoading: false });
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
      const currentComments = comments.data ?? (await fetchSortedComments());
      if (!currentComments) return;

      const createdComment = await addComment(commentText);
      if (!createdComment) return;

      const newComments = [createdComment, ...currentComments];
      setComments({ isVisible: true, data: newComments });
      setTotalCommentCount((prev) => prev + 1);
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
    setComments({ isVisible: true, data: filtered });
    setTotalCommentCount((prev) => Math.max(0, prev - 1));
  };

  const updateComment = (comment: CommentWithResponses) => {
    if (!comments.data) return;
    const idx = comments.data.findIndex((r) => r.id === comment.id);
    if (idx < 0) return;
    const updated = [...comments.data];
    updated[idx] = comment;
    setComments({ data: updated, isVisible: true });
  };

  return {
    item,
    itemType,
    card,
    comments,
    indentComments,
    showLoadCommentsButton:
      !comments.isLoading &&
      !showAllComments &&
      commentsExist &&
      totalCommentCount - maxNumberOfComments > 0 &&
      !isSearchFilterActive,
    showCloseThreadButton: showAllComments && commentsExist,
    showDivider: !disableDivider && (commentsExist || state.isResponding(item, 'comment')),
    handleAddComment,
    deleteComment,
    updateComment,
    loadComments,
    renderComment,
    setShowAllComments,
    enableCommenting,
    showCommentCount,
    maxNumberOfComments,
    visibleComments,
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
