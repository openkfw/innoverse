import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { UserAvatar, UserAvatarProps } from '@/components/common/UserAvatar';
import * as m from '@/src/paraglide/messages.js';
import { formatDateWithTimestamp } from '@/utils/helpers';

import AvatarInitialsIcon from './AvatarInitialsIcon';

interface CommentCardHeaderProps {
  content: { author: User; updatedAt: Date; anonymous?: boolean };
  avatar?: UserAvatarProps;
}

export const CommentCardHeader = ({ content, avatar }: CommentCardHeaderProps) => {
  const { author, updatedAt, anonymous } = content;

  if (!author || anonymous) {
    return (
      <CardHeader
        sx={cardHeaderStyles}
        avatar={
          <AvatarInitialsIcon
            name={m.components_common_anonymous_author()}
            size={32}
            sx={{ border: '2px solid white' }}
          />
        }
        title={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="primary.dark" sx={{ fontSize: '14px' }} data-testid="author">
              {m.components_common_anonymous_author()}
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
      sx={cardHeaderStyles}
      avatar={<UserAvatar user={author} size={24} {...avatar} />}
      title={
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" color="primary.dark" sx={{ fontSize: '14px' }} data-testid="author">
            {author.name}
          </Typography>
          <Typography variant="caption" color="secondary.contrastText" data-testid="date" suppressHydrationWarning>
            {formatDateWithTimestamp(updatedAt)}
          </Typography>
        </Stack>
      }
      subheader={
        author && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '14px' }}>
            {author.role}
          </Typography>
        )
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
