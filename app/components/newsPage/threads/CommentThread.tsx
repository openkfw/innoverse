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
  comment: { id: string; responseCount: number; comments?: TComment[] };
  card: React.ReactNode;
  disableDivider?: boolean;
  indentResponses?: React.CSSProperties['paddingLeft'];
  fetchResponses: () => Promise<TComment[]>;
  renderResponse: (
    comment: TComment,
    idx: number,
    deleteResponse: () => void,
    updateResponse: (response: TComment) => void,
  ) => React.ReactNode;
  addResponse: (text: string) => Promise<AuthResponse<TComment>>;
}

interface ThreadComment {
  id: string;
  createdAt: Date;
  responseCount: number;
}

type ResponseState<TComment> =
  | { isVisible: false; isLoading: false; data?: undefined }
  | { isVisible?: false; isLoading: true; data?: undefined }
  | { isVisible: true; isLoading?: false; data: TComment[] };

export const CommentThread = <TComment extends ThreadComment>(props: CommentThreadProps<TComment>) => {
  const {
    comment,
    card,
    responses,
    indentResponses,
    showDivider,
    showLoadResponsesButton,
    loadResponses,
    handleResponse,
    updateResponse,
    deleteResponse,
    renderResponse,
  } = useCommentThread(props);

  return (
    <Stack spacing={2}>
      <div>{card}</div>
      {showDivider && <Divider />}

      <WriteCommentResponseCard comment={comment} onRespond={handleResponse} sx={{ mb: 1, pl: indentResponses }} />

      {showLoadResponsesButton && (
        <Button
          startIcon={<AddIcon color="primary" fontSize="large" />}
          sx={{ ...transparentButtonStyles, pl: indentResponses }}
          style={{ marginBottom: 2 }}
          onClick={loadResponses}
        >
          {m.components_newsPage_cards_common_threads_itemWithCommentsThread_showMore()} ({comment.responseCount})
        </Button>
      )}

      {responses.isLoading && <CommentThreadSkeleton sx={{ pl: indentResponses, mt: 2 }} />}

      {responses.isVisible && (
        <Stack spacing={2} sx={{ pl: indentResponses }}>
          {responses.data.map((response, idx) =>
            renderResponse(response, idx, () => deleteResponse(response), updateResponse),
          )}
        </Stack>
      )}
      {comment && comment.comments && comment.comments.length > 0 && (
        <Stack spacing={2} sx={{ pl: indentResponses }}>
          {comment.comments.map((response, idx) =>
            renderResponse(response, idx, () => deleteResponse(response), updateResponse),
          )}
        </Stack>
      )}
    </Stack>
  );
};

const useCommentThread = <TComment extends ThreadComment>(props: CommentThreadProps<TComment>) => {
  const { comment, card, disableDivider, indentResponses, fetchResponses, renderResponse, addResponse } = props;
  const [responses, setResponses] = useState<ResponseState<TComment>>({ isVisible: false, isLoading: false });
  const state = useRespondingState();

  const responsesExist = comment.responseCount > 0 || (responses.data?.length ?? 0) > 0;

  const loadResponses = async () => {
    setResponses({ isLoading: true });
    const responses = await fetchSortedResponses();
    if (responses) {
      setResponses({ isVisible: true, data: responses });
    } else {
      setResponses({ isVisible: false, isLoading: false });
    }
  };

  const handleResponse = async (responseText: string) => {
    try {
      const currentResponses = responses.data ?? (await fetchSortedResponses());
      if (!currentResponses) return;

      const result = await addResponse(responseText);
      const createdResponse = result?.data;
      if (!createdResponse) return;

      const newResponses = [createdResponse, ...currentResponses];
      setResponses({ isVisible: true, data: newResponses });
    } catch (error) {
      console.error('Error adding response:', error);
      errorMessage({ message: m.components_newsPage_thread_add_response_error() });
      appInsights.trackException({
        exception: new Error('Failed to add response', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const deleteResponse = (response: TComment) => {
    const filteredResponses = responses.data?.filter((r) => r.id !== response.id) ?? [];
    setResponses({ isVisible: true, data: filteredResponses });
  };

  const updateResponse = (response: TComment) => {
    if (!responses.data) return;
    const idx = responses.data.findIndex((r) => r.id === response.id);
    if (idx < 0) {
      return;
    }
    const newResponses = responses.data;
    newResponses[idx] = response;
    setResponses({ data: newResponses, isVisible: true });
  };

  const fetchSortedResponses = async () => {
    try {
      const responses = await fetchResponses();
      if (!responses) return;
      const sortedResponses = sortResponses(responses);
      return sortedResponses;
    } catch (error) {
      console.error('Error fetching responses:', error);
      errorMessage({ message: m.components_newsPage_thread_fetch_error() });
      appInsights.trackException({
        exception: new Error('Failed to fetch responses', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const sortResponses = (responses: TComment[]) => responses.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

  return {
    comment,
    card,
    responses,
    indentResponses,
    showLoadResponsesButton:
      !comment.comments && !responses.isVisible && !responses.isLoading && comment.responseCount > 0,
    showDivider: !disableDivider && (responsesExist || state.isEditing(comment)),
    handleResponse,
    deleteResponse,
    updateResponse,
    loadResponses,
    renderResponse,
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
