import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

interface SkeletonProps {
  count: number;
  size: {
    width: string;
    height: string;
  };
}

export const CommonSkeleton = ({ count, size }: SkeletonProps) => {
  return (
    <Stack spacing={2}>
      {new Array(count).fill(0).map((_, idx) => (
        <Box key={idx} sx={{ backgroundColor: 'white', borderRadius: '8px' }}>
          <Skeleton variant="rounded" width={size.width} height={size.height} />
        </Box>
      ))}
    </Stack>
  );
};
