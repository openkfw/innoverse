import Image from 'next/image';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
import { Avatar, Button, Chip, IconButton, Stack, Typography } from '@mui/material';

import badge from '/public/images/badge.svg';
import elipse from '/public/images/elipse.svg';
export const AuthorInformation = () => {
  const buttonStyle = {
    borderRadius: '48px',
    border: '1px solid rgba(0, 0, 0, 0.10)',
    backdropFilter: 'blur(24px)',
    background: 'white',
  };

  return (
    <Stack
      sx={{
        display: 'flex',
        width: '662px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        mt: 4,
        ml: 4,
      }}
      spacing={2}
    >
      <Stack direction="row" spacing={2}>
        <Chip label="#Gesellschaft" />
        <Chip label="#Bildung" />
        <Chip label="#Gründen" />
        <Chip label="#AI" />
        <Chip label="#XYZ" />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Avatar src="https://source.boringavatars.com/beam/120/Stefan?colors=264653,f4a261,e76f51" />
        <Stack direction="column">
          <Typography variant="subtitle1" color={'var(--text-primary, rgba(0, 0, 0, 0.87))'}>
            Anna Schwarz
          </Typography>
          <Typography variant="caption" color={'#507666'}>
            Junior
          </Typography>
        </Stack>
        <Button style={buttonStyle}>
          <Typography variant="caption">Folgen</Typography>
        </Button>
        <IconButton style={buttonStyle}>
          <ChatBubbleOutlineOutlinedIcon></ChatBubbleOutlineOutlinedIcon>
        </IconButton>
        <IconButton style={buttonStyle}>
          <FormatAlignLeftOutlinedIcon></FormatAlignLeftOutlinedIcon>
          <Typography variant="caption">Add your insights</Typography>
        </IconButton>
      </Stack>
      <Stack direction="row" sx={{ mt: '20px', mb: '20px' }}>
        <Image style={{ marginRight: '5px' }} src={badge} alt={''} />
        <Typography variant="caption" color={'#507666'}>
          536 Points
        </Typography>
        <Image style={{ marginTop: '8px', paddingLeft: '13px', paddingRight: '13px' }} src={elipse} alt={''} />
        <Typography variant="caption" color={'#507666'}>
          Department ABC, Frankfurt am Main
        </Typography>
      </Stack>
    </Stack>
  );
};
