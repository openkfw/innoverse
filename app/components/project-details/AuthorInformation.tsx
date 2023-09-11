import Image from 'next/image';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
import { Avatar, Button, Chip, IconButton, Stack, Typography } from '@mui/material';

import { PersonInfo } from '@/common/types';

import badge from '/public/images/icons/badge.svg';
import elipse from '/public/images/icons/elipse.svg';

interface AuthorInformationProps {
  author: PersonInfo;
}

export const AuthorInformation = (props: AuthorInformationProps) => {
  const { author } = props;

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
        <Chip label="#KI" />
        <Chip label="#Effizienz" />
        <Chip label="#Geschäftsbereiche" />
        <Chip label="#AI" />
        <Chip label="#Dokumente" />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Avatar src="https://source.boringavatars.com/beam/120/Stefan?colors=264653,f4a261,e76f51" />
        <Stack direction="column">
          <Typography variant="subtitle1" color={'var(--text-primary, rgba(0, 0, 0, 0.87))'}>
            {author.name}
          </Typography>
          <Typography variant="caption" color={'#507666'}>
            {author.role}
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
          <Typography variant="caption">Teile Deine Erfahrungen!</Typography>
        </IconButton>
      </Stack>
      <Stack direction="row" sx={{ mt: '20px', mb: '20px' }}>
        <Image style={{ marginRight: '5px' }} src={badge} alt={''} />
        <Typography variant="caption" color={'#507666'}>
          {author.points} Points
        </Typography>
        <Image style={{ marginTop: '8px', paddingLeft: '13px', paddingRight: '13px' }} src={elipse} alt={''} />
        <Typography variant="caption" color={'#507666'}>
          {author.department}
        </Typography>
      </Stack>
    </Stack>
  );
};
