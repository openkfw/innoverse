import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import IndexPage from '@/app/page';
import CustomDialog from '@/components/common/CustomDialog';
import SignInOptions from '@/components/login/SignInOptions';

export default function SignIn() {
  return (
    <>
      <IndexPage />
      <CustomDialog
        open={true}
        title="Log in"
        closeIcon={false}
        sx={{
          backdropFilter: 'blur(4px)',
          background: 'rgba(0, 0, 0, 0.12)',
          top: '8%',
          padding: 3,
          borderRadius: '24px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 440 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700 }}>
            Sign in to continue
          </Typography>
          <SignInOptions />
        </Box>
      </CustomDialog>
    </>
  );
}
