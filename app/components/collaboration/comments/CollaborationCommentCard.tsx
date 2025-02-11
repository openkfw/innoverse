'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { CollaborationComment } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { addCommentLike, deleteCommentLike } from '@/components/newsPage/threads/actions';
import * as m from '@/src/paraglide/messages.js';

import { CommentCard } from '../../common/comments/CommentCard';

import { deleteProjectCollaborationComment, updateProjectCollaborationComment } from './actions';

interface CollaborationCommentCardProps {
  comment: CollaborationComment;
  projectName?: string;
  onDelete?: () => void;
}

export const CollaborationCommentCard = (props: CollaborationCommentCardProps) => {
  const { comment, projectName, isLiked, toggleCommentLike, updateComment, deleteComment, commentLikeCount } =
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
      commentLikeCount={commentLikeCount}
    />
  );
};

function useCollaborationCommentCardProps(props: CollaborationCommentCardProps) {
  const { projectName, onDelete } = props;

  const [comment, setComment] = useState(props.comment);
  const [isLiked, setIsLiked] = useState<boolean>(comment.isLikedByUser || false);
  const [commentLikeCount, setCommentLikeCount] = useState<number>(comment?.likedBy?.length || 0);
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
    commentLikeCount,
  };
}
