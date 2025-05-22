import Stack from '@mui/material/Stack';

import { useUser } from '@/app/contexts/user-context';
import { User } from '@/common/types';

import { EditControls } from '../editing/controls/EditControls';
import { LikeControl } from '../editing/controls/LikeControl';
import { ResponseControls } from '../editing/controls/ResponseControl';

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
  likeCount,
  isLiked,
  onLike,
  onResponse,
  onEdit,
  onDelete,
}: CommentFooterProps) => {
  const { user } = useUser();

  const userIsAuthor = user?.providerId === author?.providerId;
  const displayResponseControls = !!onResponse;
  const displayEditControls = userIsAuthor && onEdit && onDelete;
  return (
    <Stack direction="row" spacing={2}>
      <LikeControl onLike={onLike} isSelected={isLiked} likeNumber={likeCount} />
      {displayResponseControls && <ResponseControls onResponse={onResponse} />}
      {displayEditControls && <EditControls onEdit={onEdit} onDelete={onDelete} />}
    </Stack>
  );
};
