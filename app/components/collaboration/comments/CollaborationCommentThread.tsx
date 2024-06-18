'use client';
import React, { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Stack from '@mui/material/Stack';

import { Comment, CommentResponse } from '@/common/types';
import { TransparentAddButton } from '@/components/common/AddItemButton';
import { errorMessage } from '@/components/common/CustomToast';
import { getProjectCollaborationCommentResponses } from '@/utils/requests/collaborationComments/requests';

import WriteCommentResponseCard from '../../common/comments/WriteCommentResponseCard';

import { addProjectCollaborationCommentResponse } from './actions';
import { CollaborationCommentCard } from './CollaborationCommentCard';
import { CollaborationCommentResponseCard } from './CollaborationCommentResponseCard';

type CollaborationCommentThreadProps = {
  comment: Comment;
  onDeleteComment: () => void;
  projectName?: string;
};

interface useCollaborationCommentThreadProps {
  comment: Comment;
}

export const CollaborationCommentThread = (props: CollaborationCommentThreadProps) => {
  const { comment, onDeleteComment, projectName } = props;
  const { responses, displayResponses, setDisplayResponses, handleResponse, removeResponse } =
    useCollaborationCommentThread({
      comment: comment,
    });

  return (
    <Stack spacing={3}>
      <CollaborationCommentCard comment={comment} projectName={projectName} onDelete={onDeleteComment} />

      {!displayResponses && comment.responseCount > 0 && (
        <TransparentAddButton onClick={() => setDisplayResponses(true)}>
          Kommentare anzeigen ({comment.responseCount})
        </TransparentAddButton>
      )}

      <WriteCommentResponseCard
        comment={comment}
        projectName={projectName}
        onRespond={handleResponse}
        sx={{ paddingLeft: '2.5em' }}
      />

      {responses.length > 0 && (
        <Stack spacing={3} sx={{ paddingLeft: '2.5em' }}>
          {responses.map((response) => (
            <CollaborationCommentResponseCard
              key={response.id}
              response={response}
              projectName={projectName}
              onDelete={() => removeResponse(response)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export function useCollaborationCommentThread({ comment }: useCollaborationCommentThreadProps) {
  const [displayResponses, setDisplayResponses] = useState(false);
  const [responses, setResponses] = useState<CommentResponse[]>([]);
  const appInsights = useAppInsightsContext();

  useEffect(
    function loadResponseseIfTheyAreDisplayed() {
      async function loadResponses() {
        try {
          const loadingResult = await getProjectCollaborationCommentResponses({ comment });
          setResponses(loadingResult.data ?? []);
        } catch (error) {
          console.error('Failed to load responses:', error);
          errorMessage({ message: 'Failed to load comment responses. Please try again.' });
          appInsights.trackException({
            exception: new Error('Failed to load comment responses.', { cause: error }),
            severityLevel: SeverityLevel.Error,
          });
        }
      }

      if (displayResponses) {
        loadResponses();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comment, displayResponses],
  );

  const handleResponse = async (response: string) => {
    try {
      const result = await addProjectCollaborationCommentResponse({
        comment: comment,
        response: response,
      });

      const commentResponse = result.data;

      if (commentResponse) {
        setDisplayResponses(true);
        setResponses((old) => [...old, commentResponse]);
      }
    } catch (error) {
      console.error('Failed to submit response:', error);
      errorMessage({ message: 'Submitting your response failed. Please try again.' });
      appInsights.trackException({
        exception: new Error('Failed to submit response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const removeResponse = (response: CommentResponse) => {
    setResponses((old) => old.filter((r) => r.id !== response.id));
  };

  return {
    responses,
    displayResponses,
    setDisplayResponses,
    handleResponse,
    removeResponse,
  };
}
