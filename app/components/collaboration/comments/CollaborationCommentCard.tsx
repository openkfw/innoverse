'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { Comment } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';

import { CommentCard } from '../../common/comments/CommentCard';

import {
  deleteProjectCollaborationComment,
  handleProjectCollaborationCommentLikedBy,
  updateProjectCollaborationComment,
} from './actions';

interface CollaborationCommentCardProps {
  comment: Comment;
  projectName?: string;
  onDelete?: () => void;
}

export const CollaborationCommentCard = (props: CollaborationCommentCardProps) => {
  const { comment, projectName, isLiked, toggleCommentLike, updateComment, deleteComment } =
    useCollaborationCommentCardProps(props);

  return (
    <CommentCard
      comment={comment}
      projectName={projectName}
      isLiked={isLiked ?? false}
      enableResponses={true}
      onLikeToggle={toggleCommentLike}
      onEdit={updateComment}
      onDelete={deleteComment}
    />
  );
};

function useCollaborationCommentCardProps(props: CollaborationCommentCardProps) {
  const { projectName, onDelete } = props;

  const [comment, setComment] = useState(props.comment);
  const [isLiked, setIsLiked] = useState<boolean>(comment.isLikedByUser || false);
  const appInsights = useAppInsightsContext();

  const toggleCommentLike = () => {
    try {
      handleProjectCollaborationCommentLikedBy({ commentId: comment.id });
      setIsLiked((liked) => !liked);
    } catch (error) {
      console.error('Error liking collaboration comment:', error);
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentCard_upvoteError() });
      appInsights.trackException({
        exception: new Error('Failed to like collaboration comment', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const updateComment = async (updatedText: string) => {
    try {
      await updateProjectCollaborationComment({ commentId: comment.id, updatedText });
      setComment({ ...comment, text: updatedText });
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentCard_updateError() });
      appInsights.trackException({
        exception: new Error('Failed to update collaboration comment', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const deleteComment = () => {
    try {
      deleteProjectCollaborationComment({ commentId: comment.id });
      onDelete && onDelete();
    } catch (error) {
      console.error('Error deleting collaboration comment:', error);
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentCard_deleteError() });
      appInsights.trackException({
        exception: new Error('Failed to delete collaboration comment.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return {
    comment,
    projectName,
    isLiked,
    toggleCommentLike,
    updateComment,
    deleteComment,
  };
}
