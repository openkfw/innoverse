import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { project_colaboration } from '@/repository/mock/project/project-page';

import AvatarIcon from '../common/AvatarIcon';
import InteractionButton from '../common/InteractionButton';

import avatar from '/public/images/avatarSusan.png';

export const WriteOpinionCard = () => {
  const placeholderText = project_colaboration.writeOpinionText;
  return (
    <Stack direction="row" spacing={2} sx={{ position: 'relative' }}>
      <AvatarIcon src={avatar} size={32} />
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
