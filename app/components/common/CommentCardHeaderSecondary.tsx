import Image from 'next/image';

import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { UserAvatar, UserAvatarProps } from '@/components/common/UserAvatar';
import * as m from '@/src/paraglide/messages.js';

import badgeIcon from '/public/images/icons/badge.svg';

interface CommentCardHeaderSecondaryProps {
  author: User;
  avatar?: UserAvatarProps;
  sx?: SxProps;
}

export const CommentCardHeaderSecondary = ({ author, avatar, sx }: CommentCardHeaderSecondaryProps) => {
  return (
    <CardHeader
      sx={{ ...cardHeaderStyles, ...sx }}
      avatar={<UserAvatar user={author} size={32} allowAnimation disableTransition {...avatar} />}
      title={
        <Stack direction="row" spacing={1} sx={cardHeaderTitleStyles}>
          <Typography variant="subtitle2" color="primary.dark">
            {author.name}
          </Typography>
          {author.badge && <Image src={badgeIcon} alt={m.components_common_commentCardHeaderSecondary_imageAlt()} />}
          <Typography variant="subtitle2" color="text.secondary">
            {author.role}
          </Typography>
        </Stack>
      }
    />
  );
};

const cardHeaderStyles = {
  textAlign: 'left',
  padding: 0,
  marginTop: 1,
  '& .MuiCardHeader-avatar': {
    marginRight: 1,
  },
};

const cardHeaderTitleStyles = {
  fontSize: 14,
  fontWeight: '500',
  alignItems: 'center',
  justifyItems: 'center',
  marginLeft: '16px',
};
