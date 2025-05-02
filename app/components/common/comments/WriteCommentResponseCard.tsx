'use client';
import React, { useState } from 'react';

import { SxProps } from '@mui/material/styles';

import { User } from '@/common/types';

import { useRespondingInteractions, useRespondingState } from '../editing/responding-context';
import WriteTextCard from '../editing/writeText/WriteTextCard';

interface WriteCommentResponseCardProps {
  comment: { id: string; author?: User; anonymous?: boolean };
  projectName?: string;
  onRespond: (response: string) => Promise<void>;
  enableCommenting?: boolean;
  sx?: SxProps;
}

const WriteCommentResponseCard = ({
  comment,
  projectName,
  onRespond,
  enableCommenting,
  sx,
}: WriteCommentResponseCardProps) => {
  const [disabled, setDisabled] = useState(false);
  const respondingState = useRespondingState();
  const respondingInteractions = useRespondingInteractions();

  const handleResponse = async (comment: string) => {
    setDisabled(true);
    await onRespond(comment);
    respondingInteractions.onSubmit(enableCommenting ? 'reply' : 'comment');
    setDisabled(false);
  };

  return (
    respondingState.isResponding(comment, enableCommenting ? 'reply' : 'comment') && (
      <WriteTextCard
        sx={sx}
        metadata={{ projectName }}
        onSubmit={handleResponse}
        onDiscard={respondingInteractions.onCancel}
        disabled={disabled}
        defaultValues={{
          text: !comment.anonymous && !enableCommenting && comment.author ? `@[${comment.author.username}] ` : '',
        }}
      />
    )
  );
};

export default WriteCommentResponseCard;
