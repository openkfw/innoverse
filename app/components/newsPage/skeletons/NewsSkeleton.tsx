import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export const NewsSkeleton = ({ count }: { count: number }) => {
  return (
    <Stack spacing={2}>
      {new Array(count).fill(0).map((_, idx) => (
        <Box key={idx} sx={{ backgroundColor: 'white', borderRadius: '8px' }}>
          <Skeleton variant="rounded" width={'full'} height={'200px'} />
        </Box>
      ))}
    </Stack>
  );
};
