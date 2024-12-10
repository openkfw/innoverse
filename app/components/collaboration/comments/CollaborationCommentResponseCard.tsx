'use client';

import { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { Comment } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { useEditingInteractions } from '@/components/common/editing/editing-context';
import * as m from '@/src/paraglide/messages.js';
import { isProjectCollaborationCommentResponseLikedBy } from '@/utils/requests/collaborationComments/requests';

import { CommentCard } from '../../common/comments/CommentCard';

import {
  deleteProjectCollaborationCommentResponse,
  handleProjectCollaborationCommentResponseLikedBy,
  updateProjectCollaborationCommentResponse,
} from './actions';

interface CollaborationCommentResponseCardProps {
  response: Comment;
  projectName?: string;
  onDelete: () => void;
}

export const CollaborationCommentResponseCard = (props: CollaborationCommentResponseCardProps) => {
  const { projectName } = props;
  const { response, isLiked, toggleResponseLike, updateResponse, deleteResponse } =
    useCollaborationCommentResponseCard(props);

  return (
    <>
      <CommentCard
        comment={{ ...response, text: response.text }}
        projectName={projectName}
        isLiked={isLiked ?? false}
        onLikeToggle={toggleResponseLike}
        onDelete={deleteResponse}
        onEdit={updateResponse}
      />
    </>
  );
};

export function useCollaborationCommentResponseCard(props: CollaborationCommentResponseCardProps) {
  const [response, setResponse] = useState(props.response);
  const [isLiked, setisLiked] = useState<boolean>();
  const appInsights = useAppInsightsContext();
  const interactions = useEditingInteractions();

  useEffect(() => {
    async function loadAndSetisLiked() {
      try {
        const result = await isProjectCollaborationCommentResponseLikedBy({ responseId: response.id });
        setisLiked(result.data);
      } catch (error) {
        console.error('Error updating collaboration comment:', error);
        errorMessage({ message: m.components_collaboration_comments_collaborationCommentResponseCard_updateError() });
        appInsights.trackException({
          exception: new Error('Failed to update collaboration comment.', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      }
    }
    loadAndSetisLiked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const toggleResponseLike = () => {
    try {
      handleProjectCollaborationCommentResponseLikedBy({ responseId: response.id });
      setisLiked((liked) => !liked);
    } catch (error) {
      console.error('Error like collaboration comment response:', error);
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentResponseCard_upvoteError() });
      appInsights.trackException({
        exception: new Error('Failed to like collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const updateResponse = async (updatedText: string) => {
    try {
      await updateProjectCollaborationCommentResponse({ responseId: response.id, updatedText });
      setResponse({ ...response, text: updatedText });
      interactions.onSubmit();
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
    isLiked,
    toggleResponseLike,
    updateResponse,
    deleteResponse,
  };
}
