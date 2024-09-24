'use client';
import CheckIcon from '@mui/icons-material/Check';

import { User } from '@/common/types';
import { CommentCardHeaderSecondary } from '@/components/common/CommentCardHeaderSecondary';
import { CommentFooter } from '@/components/common/comments/CommentFooter';
import CustomButton from '@/components/common/CustomButton';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import WriteTextCard from '@/components/common/editing/writeText/WriteTextCard';
import * as m from '@/src/paraglide/messages.js';

import { TextCard } from '../TextCard';

interface CommentCardProps {
  comment: BasicComment;
  isUpvoted: boolean;
  projectName?: string;
  enableResponses?: boolean;
  onUpvoteToggle: () => void;
  onEdit?: (updatedText: string) => Promise<void>;
  onDelete?: () => void;
}

interface BasicComment {
  id: string;
  author: User;
  comment: string;
  upvotedBy: User[];
  updatedAt: Date;
}

export const CommentCard = (props: CommentCardProps) => {
  const { comment, isUpvoted, projectName, enableResponses = false, onUpvoteToggle, onEdit, onDelete } = props;

  const state = useEditingState();
  const interactions = useEditingInteractions();

  const updateComment = async (updatedText: string) => {
    if (onEdit) {
      await onEdit(updatedText);
    }
    interactions.onSubmitEdit();
  };

  return state.isEditing(comment) ? (
    <WriteTextCard
      onSubmit={updateComment}
      onDiscard={interactions.onCancelEdit}
      defaultValues={{ text: comment.comment }}
      metadata={{ projectName }}
      submitButton={
        <CustomButton
          themeVariant="secondary"
          sx={{ mr: 0 }}
          style={{ marginRight: 0 }}
          startIcon={<CheckIcon style={{ marginRight: 0 }} sx={{ ml: 1, pr: 0 }} />}
          endIcon={<></>}
        >
          {m.components_common_comments_commentCard_done()}
        </CustomButton>
      }
    />
  ) : (
    <TextCard
      text={comment.comment}
      header={<CommentCardHeaderSecondary content={comment} />}
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
  );
};
