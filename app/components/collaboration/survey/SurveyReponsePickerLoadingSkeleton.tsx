import { Skeleton, Stack } from '@mui/material';

export const SurveyReponsePickerLoadingSkeleton = () => {
  return (
    <Stack direction={{ md: 'column', lg: 'row' }}>
      <Skeleton
        variant="rounded"
        height={'125px'}
        sx={{
          marginRight: { lg: 2, md: 0 },
          mb: { lg: 0, md: 2, sm: 2, xs: 2 },
          flexGrow: 1,
          maxWidth: '344px',
        }}
      />
      <Skeleton variant="rounded" height={'125px'} width={'172px'} sx={{ marginRight: 0 }} />
    </Stack>
  );
};
