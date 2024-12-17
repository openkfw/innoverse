import Stack from '@mui/material/Stack';

import { useUser } from '@/app/contexts/user-context';
import { User } from '@/common/types';

import { EditControls } from '../editing/controls/EditControls';
import { ResponseControls } from '../editing/controls/ResponseControl';
// import { UpvoteControls } from '../editing/controls/UpvoteControls';

interface CommentFooterProps {
  author?: User;
  onResponse?: () => void;
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CommentFooter = ({
  author,
  // likeCount,
  // isLiked,
  // onLike,
  onResponse,
  onEdit,
  onDelete,
}: CommentFooterProps) => {
  const { user } = useUser();

  const userIsAuthor = user?.providerId === author?.providerId;
  const displayResponseControls = !!onResponse;
  const displayEditControls = userIsAuthor && onEdit && onDelete;

  //todo add like control
  return (
    <Stack direction={'row'}>
      {/* <UpvoteControls upvoteCount={upvoteCount} isLiked={isLiked} onUpvote={onUpvote} sx={{ mr: 0.5 }} /> */}
      {displayResponseControls && <ResponseControls onResponse={onResponse} />}
      {displayEditControls && <EditControls onEdit={onEdit} onDelete={onDelete} />}
    </Stack>
  );
};
