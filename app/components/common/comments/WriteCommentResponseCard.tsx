'use client';
import React, { useState } from 'react';

import { SxProps } from '@mui/material/styles';

import { useRespondingInteractions, useRespondingState } from '@/components/common/editing/editing-context';

import WriteTextCard from '../editing/writeText/WriteTextCard';

interface WriteCommentResponseCardProps {
  comment: { id: string };
  projectName?: string;
  onRespond: (response: string) => Promise<void>;
  sx?: SxProps;
}

const WriteCommentResponseCard = ({ comment, projectName, onRespond, sx }: WriteCommentResponseCardProps) => {
  const [disabled, setDisabled] = useState(false);
  const respondingState = useRespondingState();
  const respondingInteractions = useRespondingInteractions();

  const handleResponse = async (comment: string) => {
    setDisabled(true);
    await onRespond(comment);
    respondingInteractions.onSubmit();
    setDisabled(false);
  };

  return (
    respondingState.isEditing(comment) && (
      <WriteTextCard
        sx={sx}
        metadata={{ projectName }}
        onSubmit={handleResponse}
        onDiscard={respondingInteractions.onCancel}
        disabled={disabled}
      />
    )
  );
};

export default WriteCommentResponseCard;
