import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CommentType } from '@/common/types';
import theme from '@/styles/theme';

import { CommentCard } from './CommentCard';

interface CommentsProps {
  comments: CommentType[];
}

const MAX_NUM_OF_COMMENTS = 2;

export const Comments = ({ comments }: CommentsProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [maxVisibleComments] = useState<CommentType[]>(comments.slice(0, MAX_NUM_OF_COMMENTS));
  const [remainingComments] = useState<CommentType[]>(comments.slice(MAX_NUM_OF_COMMENTS, comments.length));
  const [lengthOfNotShownComments] = useState<number>(comments.length - MAX_NUM_OF_COMMENTS);

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

  return (
    <Stack justifyContent="center" alignContent="center">
      {maxVisibleComments.map((comment) => (
        <CommentCard key={comment.id} content={comment} />
      ))}

      {isCollapsed &&
        remainingComments.map((comment) => (
          <Collapse in={isCollapsed} key={comment.id}>
            <CommentCard content={comment} />
          </Collapse>
        ))}
      {!isCollapsed && comments.length != MAX_NUM_OF_COMMENTS && (
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
