'use client';

import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';

import { User } from '@/common/types';
import { CommentFooter } from '@/components/common/comments/footer/CommentFooter';

import WriteCommentCard from '../../collaboration/writeComment/WriteCommentCard';
import CustomButton from '../CustomButton';
import { TextCard } from '../TextCard';

import { useCommentInteractions, useCommentState } from './comment-context';

interface CommentCardProps {
  comment: BasicComment;
  projectName: string;
  isUpvoted: boolean;
  onUpvoteToggle: () => void;
  onEdit?: (updatedText: string) => void;
  onDelete?: () => void;
  enableResponses?: boolean;
}

interface BasicComment {
  id: string;
  author: User;
  comment: string;
  upvotedBy: User[];
}

export const CommentCard = ({
  comment: commentProp,
  projectName,
  isUpvoted,
  onUpvoteToggle,
  onEdit,
  onDelete,
  enableResponses = false,
}: CommentCardProps) => {
  const [comment, setComment] = useState<BasicComment>(commentProp);

  const state = useCommentState();
  const interactions = useCommentInteractions();

  const updateComment = async (updatedText: string) => {
    onEdit && onEdit(updatedText);
    interactions.onSubmitEdit();
    setComment({ ...comment, comment: updatedText });
  };

  return (
    <>
      {state.isEditing(comment) && (
        <WriteCommentCard
          projectName={projectName}
          defaultValues={{ comment: comment.comment }}
          onSubmit={updateComment}
          onDiscard={interactions.onCancelEdit}
          submitButton={
            <CustomButton
              themeVariant="secondary"
              sx={{ mr: 0 }}
              style={{ marginRight: 0 }}
              startIcon={<CheckIcon style={{ marginRight: 0 }} sx={{ ml: 1, pr: 0 }} />}
              endIcon={<></>}
            >
              Fertig
            </CustomButton>
          }
        />
      )}
      {
        <TextCard
          sx={{ display: state.isEditing(comment) ? 'none' : 'block' }}
          content={{ author: comment.author, text: comment.comment }}
          footer={
            <CommentFooter
              author={comment.author}
              upvoteCount={comment.upvotedBy.length}
              isUpvoted={isUpvoted}
              onUpvote={onUpvoteToggle}
              onEdit={() => interactions.onStartEdit(comment)}
              onDelete={onDelete}
              onResponse={enableResponses ? () => interactions.onStartResponse(comment) : undefined}
            />
          }
        />
      }
    </>
  );
};
