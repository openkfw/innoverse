import { PropsWithChildren } from 'react';

import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

type DateFieldProps = PropsWithChildren & {
  date: string;
  divider: boolean;
  fontSize?: React.CSSProperties['fontSize'];
  sx?: SxProps;
};

export const DateField = ({ date, divider, children, sx }: DateFieldProps) => {
  return (
    <Stack flexDirection={'column'} sx={{ height: '100%', width: '100%' }}>
      <div>
        <Box sx={wrapperStyles}>
          <Typography variant="h5" sx={sx} color="text.primary">
            {date}
          </Typography>
        </Box>
        {children}
      </div>
      <Box sx={{ height: 'stretch', justifyContent: 'center', display: 'flex' }}>
        {divider && <Divider color={theme.palette.primary.light} orientation="vertical" sx={dividerStyles} flexItem />}
      </Box>
    </Stack>
  );
};

// Date Field Styles
const wrapperStyles = {
  border: '1px solid',
  borderColor: 'primary.main',
  borderRadius: '8px',
  height: '64px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    height: '37px',
  },
};

const dividerStyles = {
  width: '1px',
  height: '100%',
};
