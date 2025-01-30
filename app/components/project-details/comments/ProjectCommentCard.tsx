import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { Comment } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import * as m from '@/src/paraglide/messages.js';

import { CommentCard } from '../../common/comments/CommentCard';

import { deleteProjectComment, updateProjectComment } from './actions';
import { addCommentLike, deleteCommentLike } from '@/components/newsPage/threads/actions';

interface ProjectCommentCardProps {
  comment: Comment;
  projectName?: string;
  onDelete?: () => void;
}

export const ProjectCommentCard = (props: ProjectCommentCardProps) => {
  const { comment, projectName } = props;
  const { isLiked, toggleCommentLike, updateComment, deleteComment, commentLikeCount } = useProjectCommentCard(props);

  return (
    <CommentCard
      comment={comment}
      projectName={projectName}
      isLiked={isLiked ?? false}
      onLikeToggle={toggleCommentLike}
      onEdit={updateComment}
      onDelete={deleteComment}
      commentLikeCount={commentLikeCount}
    />
  );
};

export function useProjectCommentCard({ comment, onDelete }: ProjectCommentCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(comment.isLikedByUser || false);
  const [commentLikeCount, setCommentLikeCount] = useState<number>(comment?.likes?.length || 0);

  const appInsights = useAppInsightsContext();

  const toggleCommentLike = () => {
    try {
      if (isLiked) {
        setIsLiked(false);
        deleteCommentLike(comment.id);
        setCommentLikeCount(commentLikeCount - 1);
      } else {
        setIsLiked(true);
        addCommentLike(comment.id);
        setCommentLikeCount(commentLikeCount + 1);
      }
    } catch (error) {
      console.error('Error while liking project comment:', error);
      errorMessage({ message: m.components_projectdetails_comments_projectCommentCard_updateError() });
      appInsights.trackException({
        exception: new Error('Failed to like project comment.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const updateComment = async (updatedText: string) => {
    try {
      await updateProjectComment({ commentId: comment.id, updatedText });
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: m.components_projectdetails_comments_projectCommentCard_updateError() });
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
      errorMessage({ message: m.components_projectdetails_comments_projectCommentCard_updateError() });
      appInsights.trackException({
        exception: new Error('Failed to update collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return {
    isLiked,
    toggleCommentLike,
    updateComment,
    deleteComment,
    commentLikeCount,
  };
}
