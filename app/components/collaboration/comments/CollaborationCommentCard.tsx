'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { CommentWithResponses, ObjectType } from '@/common/types';
import { CommentCard } from '@/components/common/comments/CommentCard';
import { errorMessage } from '@/components/common/CustomToast';
import { useEditingInteractions } from '@/components/common/editing/editing-context';
import { removeUserComment, updateUserComment } from '@/components/newsPage/cards/actions';
import { addCommentLike, deleteCommentLike } from '@/components/newsPage/threads/actions';
import * as m from '@/src/paraglide/messages.js';

interface CollaborationCommentCardProps {
  comment: CommentWithResponses;
  projectName?: string;
  onDelete: () => void;
}

export const CollaborationCommentCard = (props: CollaborationCommentCardProps) => {
  const { projectName } = props;
  const { comment, isLiked, toggleCommentLike, updateComment, deleteComment, commentLikeCount } =
    useCollaborationComment(props);

  return (
    <CommentCard
      comment={comment}
      projectName={projectName}
      isLiked={isLiked ?? false}
      enableResponses
      onLikeToggle={toggleCommentLike}
      onEdit={updateComment}
      onDelete={deleteComment}
      commentLikeCount={commentLikeCount}
    />
  );
};

function useCollaborationComment(props: CollaborationCommentCardProps) {
  const [comment, setComment] = useState(props.comment);
  const [isLiked, setIsLiked] = useState<boolean>(props.comment.isLikedByUser || false);
  const [commentLikeCount, setCommentLikeCount] = useState<number>(props.comment?.likes?.length || 0);
  const appInsights = useAppInsightsContext();
  const interactions = useEditingInteractions();

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
      console.error('Error while liking collaboration comment response:', error);
      errorMessage({ message: m.components_projectdetails_comments_projectCommentCard_updateError() });
      appInsights.trackException({
        exception: new Error('Failed to like collaboration comment response.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const updateComment = async (updatedText: string) => {
    try {
      await updateUserComment({
        commentId: comment.id,
        content: updatedText,
        objectType: ObjectType.COLLABORATION_QUESTION,
      });
      setComment({ ...comment, text: updatedText });
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

  const deleteComment = async () => {
    try {
      await removeUserComment({ commentId: comment.id, objectType: ObjectType.COLLABORATION_QUESTION });
      console.log('deleting comment', comment.id, props.onDelete);
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
    comment,
    isLiked,
    toggleCommentLike,
    updateComment,
    deleteComment,
    commentLikeCount,
  };
}
