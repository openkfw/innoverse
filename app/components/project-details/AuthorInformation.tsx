import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { openWebex } from '@/utils/openWebex';

import AvatarInitialsIcon from '../common/AvatarInitialsIcon';
import bull from '../common/bull';
import InteractionButton, { InteractionButtonProps, InteractionType } from '../common/InteractionButton';

import badgeIcon from '/public/images/icons/badge.svg';

interface AuthorInformationProps {
  author: User;
  projectName: string;
}

export const AuthorInformation = (props: AuthorInformationProps) => {
  const { author, projectName } = props;

  const InteractionButtonWrapper = (props: InteractionButtonProps) => (
    <div style={{ margin: 0 }}>
      <InteractionButton {...props} />
    </div>
  );

  return (
    <Stack direction="row" justifyContent="space-between" flexWrap={'wrap'} pt={4}>
      <Stack direction="column" sx={{ marginRight: 3 }}>
        <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
          <Box>
            {author.image ? (
              <Avatar sx={{ width: 48, height: 48 }}>
                <Image src={author.image} alt="avatar" fill sizes="33vw" />
              </Avatar>
            ) : (
              <AvatarInitialsIcon name={author.name} size={48} />
            )}
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.primary">
              {author.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {author.role}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" pb={2} spacing={1} sx={{ m: 0 }} mt={2}>
          <Image src={badgeIcon} alt="badge" />
          <Typography variant="caption" color="text.primary">
            20 Points
          </Typography>
          {bull}
          <Typography variant="caption" color="text.primary">
            {author.department}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap={'wrap'} sx={{ mb: 2 }}>
        <InteractionButtonWrapper
          projectName={projectName}
          interactionType={InteractionType.USER_FOLLOW}
          sx={{ mb: 1 }}
        />
        <InteractionButton
          projectName={projectName}
          interactionType={InteractionType.COMMENT}
          tooltip="Chat über Webex"
          onClick={() => openWebex(author.email)}
          sx={{ mb: 1, mr: 1 }}
        />
        <InteractionButtonWrapper
          projectName={projectName}
          interactionType={InteractionType.ADD_INSIGHTS}
          sx={{ minWidth: '140px' }}
        />
      </Stack>
    </Stack>
  );
};
