import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';

import { useUser } from '@/app/user-context';
import { User } from '@/common/types';
import { AuthResponse } from '@/utils/auth';

import ArrowUpIcon from '../../icons/ArrowUpIcon';
import ReplyIcon from '../../icons/ReplyIcon';

interface VoteComponentProps {
  upvotedBy: User[];
  commentId: string;
  isUpvoted: (body: { commentId: string }) => Promise<AuthResponse>;
  handleUpvoted: (body: { commentId: string }) => Promise<AuthResponse>;
}

export const VoteComponent = (props: VoteComponentProps) => {
  const { upvotedBy, commentId, isUpvoted, handleUpvoted } = props;
  const [upvotes, setUpvotes] = useState<number>(upvotedBy.length);
  const [upvoted, setUpvoted] = useState<boolean>();

  const { user } = useUser();

  useEffect(() => {
    const setCommentUpvoted = async () => {
      const { data: upvotedUser } = await isUpvoted({ commentId });
      setUpvoted(upvotedUser);
    };
    setCommentUpvoted();
  }, [user, upvotedBy, isUpvoted, commentId]);

  const handleClick = async () => {
    await handleUpvoted({ commentId });
    setUpvoted(!upvoted);
    if (upvoted) {
      setUpvotes(upvotes - 1);
      return;
    }
    setUpvotes(upvotes + 1);
  };

  return (
    <Stack direction="row" spacing={1}>
      <ToggleButton value="up" sx={buttonStyle} onClick={handleClick}>
        <ArrowUpIcon color={upvoted ? 'green' : 'black'} /> {upvotes}
      </ToggleButton>

      <Button variant="outlined" startIcon={<ReplyIcon />} sx={buttonStyle}>
        <Typography variant="subtitle2" sx={typographyStyles}>
          antworten
        </Typography>
      </Button>
    </Stack>
  );
};

// Vote Component Styles

const buttonStyle = {
  color: 'rgba(0, 0, 0, 0.56)',
  borderRadius: '48px',
  fontSize: '13px',
  fontWeight: '700',
  lineHeight: '19px',
  background: 'rgba(255, 255, 255, 0.10)',
  height: '32px',
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.10)' },
  '&:active': { backgroundColor: 'rgba(0, 0, 0, 0.10)' },
};

const typographyStyles = {
  color: 'rgba(0, 0, 0, 0.56)',
  fontSize: 13,
  fontWeight: 700,
};
