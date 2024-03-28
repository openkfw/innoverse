'use client';
import React from 'react';

import { SxProps } from '@mui/material/styles';

import { Comment } from '@/common/types';
import { useCommentInteractions, useCommentState } from '@/components/common/comments/comment-context';

import WriteCommentCard from '../../collaboration/writeComment/WriteCommentCard';

interface WriteCommentResponseCardProps {
  comment: Comment;
  projectName: string;
  onRespond: (response: string) => Promise<void>;
  sx?: SxProps;
}

export const WriteCommentResponseCard = ({ comment, projectName, onRespond, sx }: WriteCommentResponseCardProps) => {
  const commentState = useCommentState();
  const commentInteractions = useCommentInteractions();

  const handleResponse = async (comment: string) => {
    await onRespond(comment);
    commentInteractions.onSubmitResponse();
  };

  return (
    commentState.isResponding(comment) && (
      <WriteCommentCard sx={sx} projectName={projectName} onSubmit={handleResponse} />
    )
  );
};
