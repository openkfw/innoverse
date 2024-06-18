import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { CommentSkeleton } from '@/components/newsPage/cards/skeletons/CommentSkeleton';

export const CommentThreadSkeleton = ({ sx }: { sx?: SxProps }) => {
  return (
    <Stack spacing={2} sx={sx}>
      <CommentSkeleton maxTextWidth={'400px'} />
      <CommentSkeleton maxTextWidth={'300px'} style={{ marginLeft: '32px' }} />
    </Stack>
  );
};
