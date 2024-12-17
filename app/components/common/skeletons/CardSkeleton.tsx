import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import ContentCard, { ContentCardProps } from '../project/ContentCard';

interface SkeletonProps extends Partial<ContentCardProps> {
  size: {
    width: number;
    height: number;
  };
}

export const CardSkeleton = (props: SkeletonProps) => {
  return (
    <ContentCard
      {...props}
      image={
        <Skeleton
          variant="rectangular"
          style={{
            width: '100%',
            height: 200,
          }}
        />
      }
      header={
        <Typography variant="caption" component="div">
          <Skeleton width="60%" />
        </Typography>
      }
      title={
        <Typography variant="h4">
          <Skeleton width="70%" />
        </Typography>
      }
      description={
        <>
          <Skeleton width="100%" />
          <Skeleton width="80%" />
          {props.size.height > 500 ? <Skeleton width="90%" /> : undefined}
        </>
      }
      status={
        <Typography sx={{ width: '80%' }} variant="h4">
          <Skeleton sx={{ bgcolor: 'grey.400' }} />
        </Typography>
      }
    />
  );
};
