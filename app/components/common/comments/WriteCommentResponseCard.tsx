'use client';
import React, { useState } from 'react';

import { SxProps } from '@mui/material/styles';

import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';

import WriteTextCard from '../editing/writeText/WriteTextCard';

interface WriteCommentResponseCardProps {
  comment: { id: string };
  projectName?: string;
  onRespond: (response: string) => Promise<void>;
  sx?: SxProps;
}

const WriteCommentResponseCard = ({ comment, projectName, onRespond, sx }: WriteCommentResponseCardProps) => {
  const [disabled, setDisabled] = useState(false);
  const editingState = useEditingState();
  const editingInteractions = useEditingInteractions();

  const handleResponse = async (comment: string) => {
    setDisabled(true);
    await onRespond(comment);
    editingInteractions.onSubmitResponse();
    setDisabled(false);
  };

  return (
    editingState.isResponding(comment) && (
      <WriteTextCard sx={sx} metadata={{ projectName }} onSubmit={handleResponse} disabled={disabled} />
    )
  );
};

export default WriteCommentResponseCard;
