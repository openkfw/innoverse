import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { useUser } from '@/app/contexts/user-context';

import AvatarIcon from '../common/AvatarIcon';
import InteractionButton, { InteractionType } from '../common/InteractionButton';

type ShareOpinionCardProps = {
  handleClick: () => void;
  projectName?: string;
};

export const ShareOpinionCard = ({ projectName, handleClick }: ShareOpinionCardProps) => {
  const { user } = useUser();
  return (
    <>
      {user && (
        <Card sx={cardStyles}>
          <CardHeader
            sx={cardHeaderStyles}
            avatar={<AvatarIcon user={user} size={32} />}
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
