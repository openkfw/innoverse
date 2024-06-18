import Stack from '@mui/material/Stack';

import { useUser } from '@/app/contexts/user-context';
import { User } from '@/common/types';

import { EditControls } from '../editing/controls/EditControls';
import { ResponseControls } from '../editing/controls/ResponseControl';
import { UpvoteControls } from '../editing/controls/UpvoteControls';

interface CommentFooterProps {
  author?: User;
  onResponse?: () => void;
  upvoteCount: number;
  isUpvoted: boolean;
  onUpvote: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CommentFooter = ({
  author,
  upvoteCount,
  isUpvoted,
  onUpvote,
  onResponse,
  onEdit,
  onDelete,
}: CommentFooterProps) => {
  const { user } = useUser();

  const userIsAuthor = user?.providerId === author?.providerId;
  const displayResponseControls = !!onResponse;
  const displayEditControls = userIsAuthor && onEdit && onDelete;

  return (
    <Stack direction={'row'}>
      <UpvoteControls upvoteCount={upvoteCount} isUpvoted={isUpvoted} onUpvote={onUpvote} sx={{ mr: 0.5 }} />
      {displayResponseControls && <ResponseControls onResponse={onResponse} />}
      {displayEditControls && <EditControls onEdit={onEdit} onDelete={onDelete} />}
    </Stack>
  );
};
