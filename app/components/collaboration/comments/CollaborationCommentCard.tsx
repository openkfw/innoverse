import { useEffect, useState } from 'react';

import { Comment } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';

import { CommentCard } from '../../common/comments/CommentCard';

import {
  deleteProjectCollaborationComment,
  handleProjectCollaborationCommentUpvotedBy,
  isProjectCollaborationCommentUpvotedBy,
  updateProjectCollaborationComment,
} from './actions';

interface CollaborationCommentCardProps {
  comment: Comment;
  projectName: string;
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

function useCollaborationCommentCardProps({ comment, onDelete }: CollaborationCommentCardProps) {
  const [isUpvoted, setIsUpvoted] = useState<boolean>();

  useEffect(() => {
    async function loadAndSetIsUpvoted() {
      try {
        const result = await isProjectCollaborationCommentUpvotedBy({ commentId: comment.id });
        setIsUpvoted(result.data);
      } catch (error) {
        console.error('Error loading upvote status of collaboration comment', error);
        errorMessage({ message: 'Failed to load upvote status of collaboration comment. Please try again later.' });
      }
    }
    loadAndSetIsUpvoted();
  }, [comment]);

  const toggleCommentUpvote = () => {
    try {
      handleProjectCollaborationCommentUpvotedBy({ commentId: comment.id });
      setIsUpvoted((upvoted) => !upvoted);
    } catch (error) {
      console.error('Error upvoting collaboration comment:', error);
      errorMessage({ message: 'Failed to upvote collaboration comment. Please try again later.' });
    }
  };

  const updateComment = (updatedText: string) => {
    try {
      updateProjectCollaborationComment({ commentId: comment.id, updatedText });
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: 'Failed to update collaboration comment. Please try again later.' });
    }
  };

  const deleteComment = () => {
    try {
      deleteProjectCollaborationComment({ commentId: comment.id });
      onDelete && onDelete();
    } catch (error) {
      console.error('Error deleting collaboration comment:', error);
      errorMessage({ message: 'Failed to delete collaboration comment. Please try again later.' });
    }
  };

  return {
    isUpvoted,
    toggleCommentUpvote,
    updateComment,
    deleteComment,
  };
}
