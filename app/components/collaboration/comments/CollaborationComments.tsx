'use client';

import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Comment } from '@/common/types';
import theme from '@/styles/theme';

import { CollaborationCommentCard } from './CollaborationCommentCard';

interface CommentsProps {
  comments: Comment[];
}

const MAX_NUM_OF_COMMENTS = 2;

export const CollaborationComments = ({ comments }: CommentsProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [maxVisibleComments, setMaxVisibleComments] = useState<Comment[]>();
  const [remainingComments, setRemainingComments] = useState<Comment[]>();
  const [lengthOfNotShownComments, setLengthOfNotShownComments] = useState<number>();

  const buttonStyle = {
    ml: 6,
    width: 300,
    background: 'transparent',
    color: theme.palette.secondary.main,
    ':hover': {
      background: 'transparent',
      color: theme.palette.secondary.main,
    },
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    setMaxVisibleComments(comments.slice(0, MAX_NUM_OF_COMMENTS));
    setRemainingComments(comments.slice(MAX_NUM_OF_COMMENTS, comments.length));
    setLengthOfNotShownComments(Math.max(comments.length - MAX_NUM_OF_COMMENTS, 0));
  }, [comments]);

  return (
    <Stack justifyContent="center" alignContent="center">
      {maxVisibleComments?.map((comment, key) => <CollaborationCommentCard key={key} content={comment} />)}

      {isCollapsed &&
        remainingComments?.map((comment, key) => (
          <Collapse in={isCollapsed} key={key}>
            <CollaborationCommentCard content={comment} />
          </Collapse>
        ))}
      {!isCollapsed && comments.length > MAX_NUM_OF_COMMENTS && (
        <Button onClick={handleToggle} sx={buttonStyle} startIcon={<AddIcon color="secondary" fontSize="large" />}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            weitere Rückmeldungen anzeigen ({lengthOfNotShownComments})
          </Typography>
        </Button>
      )}
    </Stack>
  );
};
