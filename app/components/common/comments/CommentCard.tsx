'use client';

import CheckIcon from '@mui/icons-material/Check';

import { User } from '@/common/types';
import { CommentCardHeaderSecondary } from '@/components/common/CommentCardHeaderSecondary';
import { CommentFooter } from '@/components/common/comments/CommentFooter';
import CustomButton from '@/components/common/CustomButton';
import {
  useEditingInteractions,
  useEditingState,
  useRespondingInteractions,
} from '@/components/common/editing/editing-context';
import WriteTextCard from '@/components/common/editing/writeText/WriteTextCard';
import * as m from '@/src/paraglide/messages.js';

import { TextCard } from '../TextCard';

interface CommentCardProps {
  comment: BasicComment;
  isLiked: boolean;
  projectName?: string;
  enableResponses?: boolean;
  onLikeToggle: () => void;
  onEdit?: (updatedText: string) => Promise<void>;
  onDelete?: () => void;
  commentLikeCount: number;
}

interface BasicComment {
  id: string;
  author: User;
  text: string;
  likedBy: string[];
  updatedAt: Date;
}

export const CommentCard = (props: CommentCardProps) => {
  const {
    comment,
    isLiked,
    projectName,
    enableResponses = false,
    onLikeToggle,
    onEdit,
    onDelete,
    commentLikeCount,
  } = props;

  const state = useEditingState();
  const editingInteractions = useEditingInteractions();
  const respondingInteractions = useRespondingInteractions();

  const updateComment = async (updatedText: string) => {
    if (onEdit) {
      await onEdit(updatedText);
    }
    editingInteractions.onSubmit();
  };

  return state.isEditing(comment) ? (
    <WriteTextCard
      onSubmit={updateComment}
      onDiscard={editingInteractions.onCancel}
      defaultValues={{ text: comment.text }}
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
      text={comment.text}
      header={<CommentCardHeaderSecondary content={comment} />}
      footer={
        <CommentFooter
          author={comment.author}
          likeCount={commentLikeCount}
          isLiked={isLiked}
          onLike={onLikeToggle}
          onEdit={() => editingInteractions.onStart(comment)}
          onDelete={onDelete}
          onResponse={enableResponses ? () => respondingInteractions.onStart(comment) : undefined}
        />
      }
    />
  );
};
