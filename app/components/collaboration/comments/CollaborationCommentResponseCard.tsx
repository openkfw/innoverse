import { useEffect, useState } from 'react';

import { CommentResponse } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';

import { CommentCard } from '../../common/comments/CommentCard';

import {
  deleteProjectCollaborationCommentResponse,
  handleProjectCollaborationCommentResponseUpvotedBy,
  isProjectCollaborationCommentResponseUpvotedBy,
  updateProjectCollaborationCommentResponse,
} from './actions';

interface CollaborationCommentResponseCardProps {
  response: CommentResponse;
  projectName: string;
  onDelete?: () => void;
}

export const CollaborationCommentResponseCard = (props: CollaborationCommentResponseCardProps) => {
  const { response, projectName } = props;
  const { isUpvoted, toggleResponseUpvote, updateResponse, deleteResponse } =
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

function useCollaborationCommentResponseCard({ response, onDelete }: CollaborationCommentResponseCardProps) {
  const [isUpvoted, setIsUpvoted] = useState<boolean>();

  useEffect(() => {
    async function loadAndSetIsUpvoted() {
      try {
        const result = await isProjectCollaborationCommentResponseUpvotedBy({ responseId: response.id });
        setIsUpvoted(result.data);
      } catch (error) {
        console.error('Error updating collaboration comment:', error);
        errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
      }
    }
    loadAndSetIsUpvoted();
  }, [response]);

  const toggleResponseUpvote = () => {
    try {
      handleProjectCollaborationCommentResponseUpvotedBy({ responseId: response.id });
      setIsUpvoted((upvoted) => !upvoted);
    } catch (error) {
      console.error('Error updating collaboration comment response:', error);
      errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
    }
  };

  const updateResponse = (updatedText: string) => {
    try {
      updateProjectCollaborationCommentResponse({ responseId: response.id, updatedText });
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
    }
  };

  const deleteResponse = () => {
    try {
      deleteProjectCollaborationCommentResponse({ responseId: response.id });
      onDelete && onDelete();
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: 'Failed to update collaboration comment response. Please try again later.' });
    }
  };

  return {
    isUpvoted,
    toggleResponseUpvote,
    updateResponse,
    deleteResponse,
  };
}