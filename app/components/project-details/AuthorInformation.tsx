import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Person } from '@/common/types';

import bull from '../common/bull';
import InteractionButton, { InteractionType } from '../common/InteractionButton';

import badgeIcon from '/public/images/icons/badge.svg';

interface AuthorInformationProps {
  author: Person;
}

export const AuthorInformation = (props: AuthorInformationProps) => {
  const { author } = props;

  return (
    <Stack sx={{ width: 662 }} spacing={4} pt={4} mt={1}>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <Box>
              <Avatar sx={{ width: 48, height: 48 }}>
                <Image unoptimized src={author.avatar} alt="avatar" fill sizes="33vw" />
              </Avatar>
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
            <InteractionButton interactionType={InteractionType.USER_FOLLOW} />
            <InteractionButton interactionType={InteractionType.COMMENT} />
            <InteractionButton interactionType={InteractionType.ADD_INSIGHTS} />
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" pb={4} spacing={1} sx={{ m: 0 }} mt={2}>
          <Image unoptimized src={badgeIcon} alt="badge" />
          <Typography variant="caption" color="text.primary">
            {author.points} Points
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
