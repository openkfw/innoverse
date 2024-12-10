'use client';

import { useState } from 'react';

import { SxProps } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';

import ArrowUpIcon from '@/components/icons/ArrowUpIcon';

interface UpvoteControlsProps {
  isLiked: boolean;
  upvoteCount: number;
  onUpvote: () => void;
  sx?: SxProps;
}

export const UpvoteControls = (props: UpvoteControlsProps) => {
  const { upvotes, upvote } = useUpvoteControls(props);

  return (
    <ToggleButton
      value="up"
      onClick={upvote}
      sx={[toggleButtonStyle, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
    >
      <ArrowUpIcon color={props.isLiked ? 'green' : 'black'} /> {upvotes}
    </ToggleButton>
  );
};

function useUpvoteControls({ upvoteCount, isLiked, onUpvote }: UpvoteControlsProps) {
  const [upvotes, setUpvotes] = useState<number>(upvoteCount);

  const upvote = () => {
    if (onUpvote) {
      onUpvote();
    }

    if (isLiked) {
      setUpvotes((upvotes) => upvotes - 1);
    } else {
      setUpvotes((upvotes) => upvotes + 1);
    }
  };

  return {
    upvotes,
    upvote,
  };
}

export const toggleButtonStyle = {
  color: 'rgba(0, 0, 0, 0.56)',
  borderRadius: '48px',
  fontSize: '13px',
  fontWeight: '700',
  lineHeight: '19px',
  background: 'rgba(255, 255, 255, 0.10)',
  height: '32px',
  minWidth: 'fit-content',
  px: 1.5,
  py: '5px',
  '&:hover': {
    backgroundColor: 'action.hover',
    border: '1px solid rgba(255, 255, 255, 0.40)',
  },
  '&:active': { backgroundColor: 'rgba(0, 0, 0, 0.10)' },
};
