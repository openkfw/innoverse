import { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { Comment } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';

import { CommentCard } from '../../common/comments/CommentCard';

import {
  deleteProjectComment,
  handleProjectCommentUpvoteBy,
  isProjectCommentUpvotedBy,
  updateProjectComment,
} from './actions';

interface ProjectCommentCardProps {
  comment: Comment;
  projectName: string;
  onDelete?: () => void;
}

export const ProjectCommentCard = (props: ProjectCommentCardProps) => {
  const { comment, projectName } = props;
  const { isUpvoted, toggleCommentUpvote, updateComment, deleteComment } = useProjectCommentCard(props);

  return (
    <CommentCard
      comment={comment}
      projectName={projectName}
      isUpvoted={isUpvoted ?? false}
      onUpvoteToggle={toggleCommentUpvote}
      onEdit={updateComment}
      onDelete={deleteComment}
    />
  );
};

function useProjectCommentCard({ comment, onDelete }: ProjectCommentCardProps) {
  const [isUpvoted, setIsUpvoted] = useState<boolean>();
  const appInsights = useAppInsightsContext();

  useEffect(() => {
    async function loadAndSetIsUpvoted() {
      try {
        const result = await isProjectCommentUpvotedBy({ commentId: comment.id });
        setIsUpvoted(result.data);
      } catch (error) {
        console.error('Error updating collaboration comment:', error);
        errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
        appInsights.trackException({
          exception: new Error('Failed to update collaboration comment response.', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      }
    }
    loadAndSetIsUpvoted();
  }, [comment]);

  const toggleCommentUpvote = () => {
    try {
      handleProjectCommentUpvoteBy({ commentId: comment.id });
      setIsUpvoted((upvoted) => !upvoted);
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to update collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const updateComment = (updatedText: string) => {
    try {
      updateProjectComment({ commentId: comment.id, updatedText });
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to update collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const deleteComment = () => {
    try {
      deleteProjectComment({ commentId: comment.id });
      onDelete && onDelete();
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to update collaboration comment response.', { cause: error }),
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
