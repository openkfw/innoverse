import { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';

import { useUser } from '@/app/contexts/user-context';
import { User } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { AuthResponse } from '@/utils/auth';

import ArrowUpIcon from '../../icons/ArrowUpIcon';
import ReplyIcon from '../../icons/ReplyIcon';

interface CommentVoteComponentProps {
  commentId: string;
  upvotedBy: User[];
  isUpvoted: ({ commentId }: { commentId: string }) => Promise<AuthResponse<boolean>>;
  handleUpvote: ({ commentId }: { commentId: string }) => Promise<unknown>;
  handleClickOnResponse?: () => void;
}

export const CommentVoteComponent = ({
  commentId,
  upvotedBy,
  isUpvoted,
  handleUpvote,
  handleClickOnResponse,
}: CommentVoteComponentProps) => {
  const appInsights = useAppInsightsContext();
  const checkIfCommentIsUpvoted = async () => {
    const response = await isUpvoted({ commentId });
    return response.data ?? false;
  };

  const upvoteComment = async () => {
    try {
      await handleUpvote({ commentId });
    } catch (error) {
      console.error('Error upvoting comment:', error);
      errorMessage({ message: 'Failed to upvote comment. Please try again later.' });
      appInsights.trackException({
        exception: new Error('Failed to upvote comment.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return (
    <VoteComponent
      upvoteCount={upvotedBy.length}
      isUpvoted={checkIfCommentIsUpvoted}
      handleUpvote={upvoteComment}
      handleClickOnResponse={handleClickOnResponse}
    />
  );
};

interface VoteComponentProps {
  isUpvoted: () => Promise<boolean>;
  upvoteCount: number;
  handleUpvote: () => void;
  handleClickOnResponse?: () => void;
}

export const VoteComponent = ({ isUpvoted, upvoteCount, handleUpvote, handleClickOnResponse }: VoteComponentProps) => {
  const [upvotes, setUpvotes] = useState<number>(upvoteCount);
  const [upvoted, setUpvoted] = useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    const setCommentUpvoted = async () => {
      const upvotedByUser = await isUpvoted();
      setUpvoted(upvotedByUser);
    };
    setCommentUpvoted();
  }, [user, isUpvoted]);

  const handleClickOnUpvote = () => {
    if (handleUpvote) {
      handleUpvote();
    }

    setUpvoted((upvoted) => !upvoted);

    if (upvoted) {
      setUpvotes((upvotes) => upvotes - 1);
      return;
    }

    setUpvotes((upvotes) => upvotes + 1);
  };

  return (
    <Stack direction="row" spacing={1}>
      <ToggleButton value="up" onClick={handleClickOnUpvote} sx={buttonStyle}>
        <ArrowUpIcon color={upvoted ? 'green' : 'black'} /> {upvotes}
      </ToggleButton>
      {handleClickOnResponse && (
        <Button variant="outlined" onClick={handleClickOnResponse} startIcon={<ReplyIcon />} sx={buttonStyle}>
          <Typography variant="subtitle2" sx={typographyStyles}>
            antworten
          </Typography>
        </Button>
      )}
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
  '&:hover': { backgroundColor: 'secondary.main', borderColor: '#D4FCCA' },
  '&:active': { backgroundColor: 'secondary.main' },
};

const typographyStyles = {
  color: 'rgba(0, 0, 0, 0.56)',
  fontSize: 13,
  fontWeight: 700,
};
