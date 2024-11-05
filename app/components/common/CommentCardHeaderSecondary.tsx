import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { UserAvatar, UserAvatarProps } from '@/components/common/UserAvatar';
import * as m from '@/src/paraglide/messages.js';
import { formatDateWithTimestamp } from '@/utils/helpers';

import AvatarInitialsIcon from './AvatarInitialsIcon';

interface CommentCardHeaderSecondaryProps {
  content: {
    author: User;
    avatar?: UserAvatarProps;
    anonymous?: boolean;
    updatedAt: Date;
  };
  sx?: SxProps;
}

export const CommentCardHeaderSecondary = ({ content, sx }: CommentCardHeaderSecondaryProps) => {
  const { author, avatar, anonymous, updatedAt } = content;
  if (!author || anonymous) {
    return (
      <CardHeader
        sx={{ ...cardHeaderStyles, ...sx }}
        avatar={<AvatarInitialsIcon name={m.components_newsPage_cards_newsCard_anonymous()} size={32} />}
        title={
          <Stack direction="row" spacing={1} justifyContent="space-between" sx={cardHeaderTitleStyles}>
            <Typography variant="subtitle2" color="primary.dark">
              {m.components_newsPage_cards_newsCard_anonymous()}
            </Typography>
            <Typography variant="caption" color="secondary.contrastText" data-testid="date" suppressHydrationWarning>
              {formatDateWithTimestamp(updatedAt)}
            </Typography>
          </Stack>
        }
      />
    );
  }
  return (
    <CardHeader
      sx={{ ...cardHeaderStyles, ...sx }}
      avatar={<UserAvatar user={author} size={32} allowAnimation disableTransition {...avatar} />}
      title={
        <Stack direction="row" spacing={1} justifyContent="space-between" sx={cardHeaderTitleStyles}>
          <Typography variant="subtitle2" color="primary.dark">
            {author.name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {author.role}
          </Typography>
          <Typography variant="caption" color="secondary.contrastText" data-testid="date" suppressHydrationWarning>
            {formatDateWithTimestamp(updatedAt)}
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
};
