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
import * as m from '@/src/paraglide/messages.js';
import { AuthResponse } from '@/utils/auth';

import ArrowUpIcon from '../../icons/ArrowUpIcon';
import ReplyIcon from '../../icons/ReplyIcon';

interface CommentVoteComponentProps {
  commentId: string;
  likedBy: User[];
  isLiked: ({ commentId }: { commentId: string }) => Promise<AuthResponse<boolean>>;
  handleUpvote: ({ commentId }: { commentId: string }) => Promise<unknown>;
  handleClickOnResponse?: () => void;
}

export const CommentVoteComponent = ({
  commentId,
  likedBy,
  isLiked,
  handleUpvote,
  handleClickOnResponse,
}: CommentVoteComponentProps) => {
  const appInsights = useAppInsightsContext();
  const checkIfCommentisLiked = async () => {
    const response = await isLiked({ commentId });
    return response.data ?? false;
  };

  const upvoteComment = async () => {
    try {
      await handleUpvote({ commentId });
    } catch (error) {
      console.error('Error upvoting comment:', error);
      errorMessage({ message: m.components_projectdetails_comments_voteComponent_upvoteError() });
      appInsights.trackException({
        exception: new Error('Failed to upvote comment.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return (
    <VoteComponent
      upvoteCount={likedBy.length}
      isLiked={checkIfCommentisLiked}
      handleUpvote={upvoteComment}
      handleClickOnResponse={handleClickOnResponse}
    />
  );
};

interface VoteComponentProps {
  isLiked: () => Promise<boolean>;
  upvoteCount: number;
  handleUpvote: () => void;
  handleClickOnResponse?: () => void;
}

export const VoteComponent = ({ isLiked, upvoteCount, handleUpvote, handleClickOnResponse }: VoteComponentProps) => {
  const [upvotes, setUpvotes] = useState<number>(upvoteCount);
  const [upvoted, setUpvoted] = useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    const setCommentUpvoted = async () => {
      const upvotedByUser = await isLiked();
      setUpvoted(upvotedByUser);
    };
    setCommentUpvoted();
  }, [user, isLiked]);

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
            {m.components_projectdetails_comments_voteComponent_answer()}
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
