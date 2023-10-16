import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface YearFieldProps {
  year: string;
}

export const YearField = ({ year }: YearFieldProps) => {
  return (
    <Grid container item mb={1} xs={3} justifyContent="center">
      <Box sx={wrapperStyles}>
        <Typography variant="subtitle2" color="primary.main">
          {year}
        </Typography>
      </Box>
    </Grid>
  );
};

// Year Field Styles
const wrapperStyles = {
  p: 1,
  background: 'rgba(0, 90, 140, 0.10)',
  borderRadius: '8px',
  width: 170,
  textAlign: 'center',
};
