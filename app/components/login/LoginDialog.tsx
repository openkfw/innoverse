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
      titleSx={titleStyles}
      closeIcon={false}
      sx={{
        backdropFilter: 'blur(20px)',
        padding: { xs: 0 },
        borderRadius: '16px',
        width: { xs: '100%' },
        maxWidth: { xs: '650px' },
        backgroundColor: 'common.white',
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

const titleStyles = {
  fontSize: 15,
  fontWeight: 400,
  lineHeight: '169%',
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: 'primary.light',
  fontFamily: 'SansDefaultMed',
};
