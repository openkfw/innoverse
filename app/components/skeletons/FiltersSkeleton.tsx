import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

interface FiltersSkeletonProps {
  count: number;
  sx?: SxProps;
}

export const FiltersSkeleton = ({ count, sx }: FiltersSkeletonProps) => {
  return (
    <Box sx={{ px: 3, ...sx }}>
      <Stack spacing={'9px'}>
        <Skeleton variant="text" height={25} width={130} style={{ backgroundColor: bgColor }} />
        {Array(count)
          .fill(0)
          .map((_, idx) => (
            <FilterSkeleton key={idx} />
          ))}
      </Stack>
    </Box>
  );
};

const FilterSkeleton = () => {
  return (
    <Stack direction={'row'} alignItems={'center'}>
      <Skeleton variant="rounded" height={25} width={25} style={{ marginRight: '8px', backgroundColor: bgColor }} />
      <Skeleton variant="text" height={25} width={150} style={{ backgroundColor: bgColor }} />
    </Stack>
  );
};

const bgColor = 'rgb(217, 217, 217)';
