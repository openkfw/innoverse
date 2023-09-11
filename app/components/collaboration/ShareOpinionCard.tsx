import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import InteractionButton from '../common/InteractionButton';

import avatar from '/public/images/avatarSusan.png';

export const ShareOpinionCard = () => {
  return (
    <Card sx={{ background: 'transparent', boxShadow: 'none' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 32, height: 32 }}>
            <Image src={avatar} alt="avatar" fill sizes="33vw" />
          </Avatar>
        }
        title={<InteractionButton interactionType="share-opinion" />}
      />
    </Card>
  );
};
