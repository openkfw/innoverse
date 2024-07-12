'use client';

import { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { CommentResponse } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { useEditingInteractions } from '@/components/common/editing/editing-context';
import * as m from '@/src/paraglide/messages.js';
import { isProjectCollaborationCommentResponseUpvotedBy } from '@/utils/requests/collaborationComments/requests';

import { CommentCard } from '../../common/comments/CommentCard';

import {
  deleteProjectCollaborationCommentResponse,
  handleProjectCollaborationCommentResponseUpvotedBy,
  updateProjectCollaborationCommentResponse,
} from './actions';

interface CollaborationCommentResponseCardProps {
  response: CommentResponse;
  projectName?: string;
  onDelete: () => void;
}

export const CollaborationCommentResponseCard = (props: CollaborationCommentResponseCardProps) => {
  const { projectName } = props;
  const { response, isUpvoted, toggleResponseUpvote, updateResponse, deleteResponse } =
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

export function useCollaborationCommentResponseCard(props: CollaborationCommentResponseCardProps) {
  const [response, setResponse] = useState(props.response);
  const [isUpvoted, setIsUpvoted] = useState<boolean>();
  const appInsights = useAppInsightsContext();
  const interactions = useEditingInteractions();

  useEffect(() => {
    async function loadAndSetIsUpvoted() {
      try {
        const result = await isProjectCollaborationCommentResponseUpvotedBy({ responseId: response.id });
        setIsUpvoted(result.data);
      } catch (error) {
        console.error('Error updating collaboration comment:', error);
        errorMessage({ message: m.components_collaboration_comments_collaborationCommentResponseCard_updateError() });
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
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentResponseCard_upvoteError() });
      appInsights.trackException({
        exception: new Error('Failed to upvote collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const updateResponse = async (updatedText: string) => {
    try {
      await updateProjectCollaborationCommentResponse({ responseId: response.id, updatedText });
      setResponse({ ...response, response: updatedText });
      interactions.onSubmitEdit();
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentResponseCard_updateError() });
      appInsights.trackException({
        exception: new Error('Failed to update collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const deleteResponse = () => {
    try {
      deleteProjectCollaborationCommentResponse({ responseId: response.id });
      props.onDelete();
    } catch (error) {
      console.error('Error deleting collaboration comment:', error);
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentResponseCard_deleteError() });
      appInsights.trackException({
        exception: new Error('Failed to delete collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return {
    response,
    isUpvoted,
    toggleResponseUpvote,
    updateResponse,
    deleteResponse,
  };
}
