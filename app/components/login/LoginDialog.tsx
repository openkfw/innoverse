import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomDialog from '@/components/common/CustomDialog';
import SignInOptions from '@/components/login/SignInOptions';
import * as m from '@/src/paraglide/messages.js';

interface LoginDialogProps {
  providers: string[];
}

export default function LoginDialog({ providers }: LoginDialogProps) {
  return (
    <CustomDialog
      open={true}
      title={m.components_login_loginDialog_login()}
      closeIcon={false}
      sx={{
        backdropFilter: 'blur(4px)',
        background: 'rgba(0, 0, 0, 0.12)',
        top: '8%',
        padding: { xs: 0, lg: 3 },
        borderRadius: '24px',
        width: { xs: '100%' },
        maxWidth: { xs: '650px' },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, lg: 2 } }}>
        <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>
          {m.components_login_loginDialog_loginMessage()}
        </Typography>
        <SignInOptions providers={providers} />
      </Box>
    </CustomDialog>
  );
}
