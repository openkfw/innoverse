'use client';

import { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { CommentResponse } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { isProjectCollaborationCommentResponseUpvotedBy } from '@/utils/requests/collaborationComments/requests';

import { CommentCard } from '../../common/comments/CommentCard';

import {
  deleteProjectCollaborationCommentResponse,
  handleProjectCollaborationCommentResponseUpvotedBy,
  updateProjectCollaborationCommentResponse,
} from './actions';

interface CollaborationCommentResponseCardProps {
  response: CommentResponse;
  projectName: string;
  onDelete?: () => void;
}

export const CollaborationCommentResponseCard = (props: CollaborationCommentResponseCardProps) => {
  const { response, projectName } = props;
  const { isUpvoted, toggleResponseUpvote, updateResponse, deleteResponse } =
    useCollaborationCommentResponseCard(props);

  return (
    <>
      <CommentCard
        comment={{ ...response, comment: response.response }}
        projectName={projectName}
        isUpvoted={isUpvoted ?? false}
        onUpvoteToggle={toggleResponseUpvote}
        onDelete={deleteResponse}
        onEdit={updateResponse}
      />
    </>
  );
};

function useCollaborationCommentResponseCard({ response, onDelete }: CollaborationCommentResponseCardProps) {
  const [isUpvoted, setIsUpvoted] = useState<boolean>();
  const appInsights = useAppInsightsContext();

  useEffect(() => {
    async function loadAndSetIsUpvoted() {
      try {
        const result = await isProjectCollaborationCommentResponseUpvotedBy({ responseId: response.id });
        setIsUpvoted(result.data);
      } catch (error) {
        console.error('Error updating collaboration comment:', error);
        errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
        appInsights.trackException({
          exception: new Error('Failed to update collaboration comment.', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      }
    }
    loadAndSetIsUpvoted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const toggleResponseUpvote = () => {
    try {
      handleProjectCollaborationCommentResponseUpvotedBy({ responseId: response.id });
      setIsUpvoted((upvoted) => !upvoted);
    } catch (error) {
      console.error('Error upvote collaboration comment response:', error);
      errorMessage({ message: 'Failed to upvote collaboration comment response. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to upvote collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const updateResponse = (updatedText: string) => {
    try {
      updateProjectCollaborationCommentResponse({ responseId: response.id, updatedText });
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to update collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const deleteResponse = () => {
    try {
      deleteProjectCollaborationCommentResponse({ responseId: response.id });
      onDelete && onDelete();
    } catch (error) {
      console.error('Error deleting collaboration comment:', error);
      errorMessage({ message: 'Failed to delete collaboration comment response. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to delete collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return {
    isUpvoted,
    toggleResponseUpvote,
    updateResponse,
    deleteResponse,
  };
}
