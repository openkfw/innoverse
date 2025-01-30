'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { Comment } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { useEditingInteractions } from '@/components/common/editing/editing-context';
import * as m from '@/src/paraglide/messages.js';

import { CommentCard } from '../../common/comments/CommentCard';

import { deleteProjectCollaborationCommentResponse, updateProjectCollaborationCommentResponse } from './actions';
import { addCommentLike, deleteCommentLike } from '@/components/newsPage/threads/actions';

interface CollaborationCommentResponseCardProps {
  response: Comment;
  projectName?: string;
  onDelete: () => void;
}

export const CollaborationCommentResponseCard = (props: CollaborationCommentResponseCardProps) => {
  const { projectName } = props;
  const { response, isLiked, toggleCommentLike, updateResponse, deleteResponse, commentLikeCount } =
    useCollaborationCommentResponseCard(props);

  return (
    <>
      <CommentCard
        comment={{ ...response, text: response.text }}
        projectName={projectName}
        isLiked={isLiked ?? false}
        onLikeToggle={toggleCommentLike}
        onDelete={deleteResponse}
        onEdit={updateResponse}
        commentLikeCount={commentLikeCount}
      />
    </>
  );
};

export function useCollaborationCommentResponseCard(props: CollaborationCommentResponseCardProps) {
  const [response, setResponse] = useState(props.response);
  const [isLiked, setIsLiked] = useState<boolean>(props.response.isLikedByUser || false);
  const [commentLikeCount, setCommentLikeCount] = useState<number>(props.response?.likes?.length || 0);
  const appInsights = useAppInsightsContext();
  const interactions = useEditingInteractions();

  const toggleCommentLike = () => {
    try {
      if (isLiked) {
        setIsLiked(false);
        deleteCommentLike(response.id);
        setCommentLikeCount(commentLikeCount - 1);
      } else {
        setIsLiked(true);
        addCommentLike(response.id);
        setCommentLikeCount(commentLikeCount + 1);
      }
    } catch (error) {
      console.error('Error while liking collaboration comment response:', error);
      errorMessage({ message: m.components_projectdetails_comments_projectCommentCard_updateError() });
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
    toggleCommentLike,
    updateResponse,
    deleteResponse,
    commentLikeCount,
  };
}
