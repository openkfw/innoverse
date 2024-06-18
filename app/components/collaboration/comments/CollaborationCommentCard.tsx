'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { Comment } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';

import { CommentCard } from '../../common/comments/CommentCard';

import {
  deleteProjectCollaborationComment,
  handleProjectCollaborationCommentUpvotedBy,
  updateProjectCollaborationComment,
} from './actions';

interface CollaborationCommentCardProps {
  comment: Comment;
  projectName?: string;
  onDelete?: () => void;
}

export const CollaborationCommentCard = (props: CollaborationCommentCardProps) => {
  const { comment, projectName } = props;
  const { isUpvoted, toggleCommentUpvote, updateComment, deleteComment } = useCollaborationCommentCardProps(props);

  return (
    <>
      <CommentCard
        comment={comment}
        projectName={projectName}
        isUpvoted={isUpvoted ?? false}
        enableResponses={true}
        onUpvoteToggle={toggleCommentUpvote}
        onEdit={updateComment}
        onDelete={deleteComment}
      />
    </>
  );
};

export function useCollaborationCommentCardProps({ comment, onDelete }: CollaborationCommentCardProps) {
  const [isUpvoted, setIsUpvoted] = useState<boolean>(comment.isUpvotedByUser || false);
  const appInsights = useAppInsightsContext();

  const toggleCommentUpvote = () => {
    try {
      handleProjectCollaborationCommentUpvotedBy({ commentId: comment.id });
      setIsUpvoted((upvoted) => !upvoted);
    } catch (error) {
      console.error('Error upvoting collaboration comment:', error);
      errorMessage({ message: 'Failed to upvote collaboration comment. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to upvote collaboration comment', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const updateComment = (updatedText: string) => {
    try {
      updateProjectCollaborationComment({ commentId: comment.id, updatedText });
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: 'Failed to update collaboration comment. Please try again later.' });
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
      errorMessage({ message: 'Failed to delete collaboration comment. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to delete collaboration comment.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return {
    isUpvoted,
    toggleCommentUpvote,
    updateComment,
    deleteComment,
  };
}
