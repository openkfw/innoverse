import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

interface DateFieldProps {
  date: string;
  divider: boolean;
}

export const DateField = ({ date, divider }: DateFieldProps) => {
  return (
    <Stack display="flex" justifyContent="flex-start" alignItems="center">
      <Box sx={wrapperStyles}>
        <Typography variant="h5" color="text.primary">
          {date}
        </Typography>
      </Box>
      {divider && <Divider color={theme.palette.primary.light} orientation="vertical" sx={dividerStyles} />}
    </Stack>
  );
};

// Date Field Styles
const wrapperStyles = {
  border: '1px solid',
  borderColor: 'primary.main',
  borderRadius: '8px',
  width: 170,
  height: 64,
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const dividerStyles = {
  width: '1px',
  height: 112,
};
