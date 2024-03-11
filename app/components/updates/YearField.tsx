import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface YearFieldProps {
  year: string;
  sx?: SxProps;
}

export const YearField = ({ year, sx }: YearFieldProps) => {
  return (
    <Box sx={wrapperStyles({ sx })}>
      <Typography variant="subtitle2" color="primary.main">
        {year}
      </Typography>
    </Box>
  );
};

// Year Field Styles
const wrapperStyles = ({ sx }: { sx?: SxProps }): SxProps => ({
  p: 1,
  my: 1,
  background: 'rgba(0, 90, 140, 0.10)',
  borderRadius: '8px',
  textAlign: 'center',
  ...sx,
});
