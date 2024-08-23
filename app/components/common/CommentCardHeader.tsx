import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { UserAvatar, UserAvatarProps } from '@/components/common/UserAvatar';
import { formatDate } from '@/utils/helpers';

interface CommentCardHeaderProps {
  content: { author: User; updatedAt: Date };
  avatar?: UserAvatarProps;
}

export const CommentCardHeader = ({ content, avatar }: CommentCardHeaderProps) => {
  const { author, updatedAt } = content;
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
            {formatDate(updatedAt)}
          </Typography>
        </Stack>
      }
      subheader={
        author && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '14px', ml: '16px' }}>
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
