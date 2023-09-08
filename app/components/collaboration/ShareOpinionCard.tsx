import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import AvatarIcon from '../common/AvatarIcon';
import InteractionButton from '../common/InteractionButton';

import avatar from '/public/images/avatarSusan.png';

export const ShareOpinionCard = () => {
  return (
    <Card sx={{ background: 'transparent', boxShadow: 'none' }}>
      <CardHeader
        avatar={<AvatarIcon src={avatar} size={32} />}
        title={<InteractionButton interactionType="share-opinion" />}
      />
    </Card>
  );
};
