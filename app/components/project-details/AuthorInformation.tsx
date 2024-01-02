import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';

import AvatarInitialsIcon from '../common/AvatarInitialsIcon';
import bull from '../common/bull';
import InteractionButton, { InteractionType } from '../common/InteractionButton';

import badgeIcon from '/public/images/icons/badge.svg';

interface AuthorInformationProps {
  author: User;
  projectName: string;
}

export const AuthorInformation = (props: AuthorInformationProps) => {
  const { author, projectName } = props;

  return (
    <Stack sx={{ width: 662 }} spacing={4} pt={4} mt={1}>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1}>
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
          <Stack direction="row" spacing={1}>
            <InteractionButton projectName={projectName} interactionType={InteractionType.USER_FOLLOW} />
            <InteractionButton projectName={projectName} interactionType={InteractionType.COMMENT} />
            <InteractionButton projectName={projectName} interactionType={InteractionType.ADD_INSIGHTS} />
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" pb={4} spacing={1} sx={{ m: 0 }} mt={2}>
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
    </Stack>
  );
};
