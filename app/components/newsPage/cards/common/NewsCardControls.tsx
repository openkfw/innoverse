import { PropsWithChildren } from 'react';

import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';

import theme from '@/styles/theme';

export const NewsCardControls = ({ children }: PropsWithChildren) => {
  return (
    <CardActions sx={cardActionsStyles}>
      <Stack direction={'row'} sx={footerStyles}>
        {children}
      </Stack>
    </CardActions>
  );
};

// News Card Actions Styles
const cardActionsStyles = {
  mt: 'auto',
  p: 0,
  pt: 1,
};

const footerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
    alignItems: 'flex-start',
    marginTop: 3,
    gap: 2,
  },
};
