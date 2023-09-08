import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { project_colaboration } from '@/repository/mock/project/project-page';

import InteractionButton from '../common/InteractionButton';

import avatar from '/public/images/avatarSusan.png';

export const WriteOpinionCard = () => {
  const placeholderText = project_colaboration.writeOpinionText;
  return (
    <Stack direction="row" spacing={2} sx={{ position: 'relative' }}>
      <Avatar sx={{ width: 32, height: 32 }}>
        <Image src={avatar} alt="avatar" fill sizes="33vw" />
      </Avatar>
      <TextField
        multiline
        rows={6}
        placeholder={placeholderText}
        sx={{ borderRadius: '8px', width: 450, '& .MuiInputBase-root': { p: 3 } }}
        InputProps={{
          endAdornment: (
            <InteractionButton interactionType="comment-send" sx={{ bottom: 10, right: '0%', position: 'absolute' }} />
          ),
        }}
      />
      <></>
    </Stack>
  );
};
