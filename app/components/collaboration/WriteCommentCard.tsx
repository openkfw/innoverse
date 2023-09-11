import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

import avatar from '/public/images/avatarSusan.png';

interface WriteOpinionCardProps {
  text: string;
  sx?: SxProps;
}

const WriteCommentCard = ({ text, sx }: WriteOpinionCardProps) => {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar sx={{ width: 32, height: 32 }}>
        <Image src={avatar} alt="avatar" fill sizes="33vw" />
      </Avatar>
      <TextField
        multiline
        rows={6}
        placeholder={text}
        sx={{ borderRadius: '8px', width: 450, '& .MuiInputBase-root': { p: 3 }, ...sx }}
        InputProps={{
          endAdornment: (
            <InteractionButton
              interactionType={InteractionType.COMMENT_SEND}
              sx={{ bottom: 10, right: '0%', position: 'absolute' }}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default WriteCommentCard;
