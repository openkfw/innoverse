import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { useUser } from '@/app/contexts/user-context';

import AvatarInitialsIcon from '../common/AvatarInitialsIcon';
import InteractionButton, { InteractionType } from '../common/InteractionButton';

type ShareOpinionCardProps = {
  projectName: string;
  handleClick: () => void;
};

export const ShareOpinionCard = ({ projectName, handleClick }: ShareOpinionCardProps) => {
  const { user } = useUser();

  return (
    <>
      {user && (
        <Card sx={cardStyles}>
          <CardHeader
            sx={cardHeaderStyles}
            avatar={
              user.image ? (
                <Avatar sx={avatarStyles}>
                  <Image src={user.image} alt="avatar" fill sizes="33vw" />
                </Avatar>
              ) : (
                <AvatarInitialsIcon name={user.name} size={32} />
              )
            }
            title={
              <InteractionButton
                projectName={projectName}
                interactionType={InteractionType.SHARE_OPINION}
                onClick={handleClick}
              />
            }
          />
        </Card>
      )}
    </>
  );
};

const cardStyles = {
  background: 'transparent',
  boxShadow: 'none',
  '.MuiCardHeader-root': { pl: 0 },
};

const cardHeaderStyles = {
  padding: 0,
  '& .MuiCardHeader-avatar': {
    marginRight: '8px',
  },
};

const avatarStyles = {
  width: 32,
  height: 32,
};
