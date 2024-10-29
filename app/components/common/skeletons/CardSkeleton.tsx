import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';

interface SkeletonProps {
  size: {
    width: number;
    height: number;
  };
}

export const CardSkeleton = ({ size }: SkeletonProps) => (
  <Card sx={{ width: size.width, height: size.height, borderRadius: 4, padding: '16px' }}>
    <Skeleton variant="rectangular" width="100%" height={237} sx={{ borderRadius: '8px', marginBottom: 2 }} />

    <CardContent>
      <Skeleton variant="text" width="80%" height={32} />
      <Skeleton variant="text" width="90%" height={18} sx={{ marginBottom: 2 }} />

      <Skeleton variant="rectangular" width="100%" height={10} sx={{ borderRadius: 1, marginTop: 'auto' }} />
    </CardContent>
  </Card>
);
