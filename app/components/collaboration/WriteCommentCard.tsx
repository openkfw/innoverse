'use client';

import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

import avatar from '/public/images/avatarSusan.png';

interface WriteOpinionCardProps {
  text: string;
  projectName: string;
  sx?: SxProps;
}

const WriteCommentCard = ({ text, sx, projectName }: WriteOpinionCardProps) => {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar sx={avatarStyles}>
        <Image src={avatar} alt="avatar" fill sizes="33vw" />
      </Avatar>
      <TextField
        multiline
        rows={6}
        placeholder={text}
        sx={{ ...textFieldStyles, ...sx }}
        InputProps={{
          endAdornment: (
            <InteractionButton
              projectName={projectName}
              onClick={() => console.log('pressed')}
              interactionType={InteractionType.COMMENT_SEND}
              sx={buttonStyles}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default WriteCommentCard;

// Write Comment Card Styles

const avatarStyles = {
  width: 32,
  height: 32,
};

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
