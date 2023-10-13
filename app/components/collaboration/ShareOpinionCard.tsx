import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

import avatar from '/public/images/avatarSusan.png';

export const ShareOpinionCard = ({ projectName }: { projectName: string }) => {
  return (
    <Card sx={{ background: 'transparent', boxShadow: 'none', '.MuiCardHeader-root': { pl: 0 } }}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 32, height: 32 }}>
            <Image src={avatar} alt="avatar" fill sizes="33vw" />
          </Avatar>
        }
        title={<InteractionButton projectName={projectName} interactionType={InteractionType.SHARE_OPINION} />}
      />
    </Card>
  );
};
