import { CSSProperties } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export const CommentSkeleton = ({
  maxTextWidth,
  style,
}: {
  maxTextWidth?: CSSProperties['maxHeight'];
  style?: CSSProperties;
}) => {
  return (
    <Stack direction={'column'} style={style}>
      <Stack direction={'row'} spacing={1}>
        <Skeleton variant="circular" width={'32px'} height={'32px'} />
        <Skeleton variant="text" width={'150px'} />
      </Stack>
      <Box marginLeft={'40px'}>
        <Skeleton
          variant="rounded"
          height={'32px'}
          style={{ maxWidth: maxTextWidth ?? '500px', marginBottom: '5px' }}
        />
        <Skeleton variant="rounded" width={'105px'} height={'32px'} />
      </Box>
    </Stack>
  );
};
