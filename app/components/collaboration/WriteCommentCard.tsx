'use client';

import { useRef } from 'react';

import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { useUser } from '@/app/contexts/user-context';

import AvatarIcon from '../common/AvatarIcon';
import InteractionButton, { InteractionType } from '../common/InteractionButton';

interface WriteCommentCardProps {
  projectName: string;
  handleComment: (comment: string) => Promise<void>;
  sx?: SxProps;
}

const WriteCommentCard = ({ sx, projectName, handleComment }: WriteCommentCardProps) => {
  const { user } = useUser();
  const commentRef = useRef<HTMLInputElement | null>();
  const placeholder =
    'Teil deine Ratschläge und Gedanken zu diesem Thema, damit deine Kollegen von deiner Expertise profitieren können.';

  const handleNewComment = async () => {
    if (commentRef.current) {
      await handleComment(commentRef.current.value);
      commentRef.current.value = '';
    }
  };

  return (
    <>
      {user && (
        <Stack direction="row" spacing={3}>
          <AvatarIcon user={user} size={32} />
          <TextField
            inputRef={commentRef}
            multiline
            rows={6}
            placeholder={placeholder}
            sx={{ ...textFieldStyles, ...sx }}
            InputProps={{
              endAdornment: (
                <InteractionButton
                  projectName={projectName}
                  onClick={handleNewComment}
                  interactionType={InteractionType.COMMENT_SEND}
                  sx={buttonStyles}
                />
              ),
            }}
          />
        </Stack>
      )}
    </>
  );
};

export default WriteCommentCard;

const textFieldStyles = {
  borderRadius: '8px',
  width: 450,
  '& .MuiInputBase-root': {
    p: '22px 24px',
    color: 'text.primary',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'text.primary',
    },
  },
};

const buttonStyles = {
  bottom: 22,
  right: 24,
  position: 'absolute',
};
